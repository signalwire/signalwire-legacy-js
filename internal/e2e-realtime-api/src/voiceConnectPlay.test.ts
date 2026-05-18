import tap from 'tap'
import { SignalWire, Voice } from '@signalwire/realtime-api'
import {
  type TestHandler,
  createTestRunner,
  makeSipDomainAppAddress,
} from './utils'

/**
 * Repro for signalwire/cloud-product#18806:
 *   "Can't call play() on a call not established yet."
 *
 * After `await call.connect(...)` resolves, immediately invoke `playTTS()`
 * on the returned peer. The peer's _payload (callId/nodeId) may not be set
 * yet because the connect promise resolves on `calling.call.connect`
 * (connect_state=connected) while the peer's `calling.call.state` event can
 * still be in flight.
 */
const handler: TestHandler = ({ domainApp }) => {
  if (!domainApp) {
    throw new Error('Missing domainApp')
  }

  return new Promise<number>(async (resolve, reject) => {
    try {
      const client = await SignalWire({
        host: process.env.RELAY_HOST || 'relay.swire.io',
        project: process.env.RELAY_PROJECT as string,
        token: process.env.RELAY_TOKEN as string,
        debug: {
          logWsTraffic: true,
        },
      })

      const callsReceived = new Set<string | undefined>()

      const unsubVoice = await client.voice.listen({
        topics: [domainApp.call_relay_context],
        onCallReceived: async (call) => {
          try {
            callsReceived.add(call.id)
            console.log(
              `Got call number: ${callsReceived.size}`,
              call.id,
              call.from,
              call.to,
              call.direction
            )

            await call.answer()
            tap.equal(call.state, 'answered', 'Inbound call answered')

            // Party B leg: just answer and let party A drive the bridge.
            if (callsReceived.size === 2) {
              return
            }

            // Party A leg: bridge to a new SIP destination.
            const peer = await call.connectSip({
              from: makeSipDomainAppAddress({
                name: 'connect-from',
                domain: domainApp.domain,
              }),
              to: makeSipDomainAppAddress({
                name: 'connect-to',
                domain: domainApp.domain,
              }),
              timeout: 30,
            })

            tap.equal(call.connected, true, 'A: call.connected is true')
            tap.equal(peer.connected, true, 'A: peer.connected is true')

            // The race we are probing: peer's callId/nodeId comes from the
            // peer's own `calling.call.state` event, which may not have
            // arrived yet.
            console.log(
              'Peer ids right after connect:',
              'id=', peer.id,
              'callId=', peer.callId,
              'nodeId=', peer.nodeId
            )

            tap.ok(
              peer.callId,
              'peer.callId is defined immediately after connect resolves'
            )
            tap.ok(
              peer.nodeId,
              'peer.nodeId is defined immediately after connect resolves'
            )

            // The actual repro: this should not throw "not established yet".
            try {
              const playback = await peer.playTTS({
                text: 'reproducing the race',
                language: 'en-US',
              })
              tap.ok(playback.id, 'playTTS resolved without race error')
              await playback.stop().catch(() => {})
            } catch (err: any) {
              tap.fail(
                `playTTS threw immediately after connect: ${err?.message ?? err}`
              )
            }

            await peer.hangup().catch(() => {})
            await call.disconnected().catch(() => {})
            await call.hangup().catch(() => {})
          } catch (error) {
            console.error('onCallReceived error', error)
            reject(4)
          }
        },
      })

      // Kick the flow by dialing into the same relay context.
      const call = await client.voice.dialSip({
        to: makeSipDomainAppAddress({
          name: 'to',
          domain: domainApp.domain,
        }),
        from: makeSipDomainAppAddress({
          name: 'from',
          domain: domainApp.domain,
        }),
        timeout: 30,
      })
      tap.ok(call.id, 'Outbound call resolved')

      await call.waitFor('ended')
      tap.equal(call.state, 'ended', 'Outbound call state is "ended"')

      await unsubVoice()
      await client.disconnect()
      resolve(0)
    } catch (error) {
      console.error('VoiceConnectPlay error', error)
      reject(4)
    }
  })
}

async function main() {
  const runner = createTestRunner({
    name: 'Voice Connect+Play Race E2E',
    testHandler: handler,
    executionTime: 60_000,
    useDomainApp: true,
  })

  await runner.run()
}

main()
