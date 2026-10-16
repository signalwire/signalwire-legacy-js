> **⚠️ This package is superseded by [`@signalwire/sdk`](https://www.npmjs.com/package/@signalwire/sdk).**
> `@signalwire/sdk` is the recommended SignalWire package for server-side TypeScript/Node.js:
> AI voice agents, real-time call control (RELAY) and the REST APIs in a single install.
>
> `npm install @signalwire/sdk` · [Documentation](https://developer.signalwire.com/sdks/agents-sdk)
>
> This package receives critical fixes only.

# SignalWire SDKs for JavaScript

This [monorepo](https://en.wikipedia.org/wiki/Monorepo) contains different implementations of the SignalWire SDKs. These allow you to build applications that can run in a variety of JavaScript environments such as a browser, a node.js server or a smartphone.

### Packages

| Project                      | Package                                                                              | README                                         | CHANGELOG                                            |
| ---------------------------- | ------------------------------------------------------------------------------------ | ---------------------------------------------- | ---------------------------------------------------- |
| **@signalwire/core**         | [`@signalwire/core`](https://www.npmjs.com/package/@signalwire/core)                 | [`README.md`](packages/core/README.md)         | [`CHANGELOG.md`](packages/core/CHANGELOG.md)         |
| **@signalwire/js**           | [`@signalwire/js`](https://www.npmjs.com/package/@signalwire/js)                     | [`README.md`](packages/js/README.md)           | [`CHANGELOG.md`](packages/js/CHANGELOG.md)           |
| **@signalwire/node**         | _WIP_                                                                                | [`README.md`](packages/node/README.md)         | [`CHANGELOG.md`](packages/node/CHANGELOG.md)         |
| **@signalwire/realtime-api** | [`@signalwire/realtime-api`](https://www.npmjs.com/package/@signalwire/realtime-api) | [`README.md`](packages/realtime-api/README.md) | [`CHANGELOG.md`](packages/realtime-api/CHANGELOG.md) |
| **@signalwire/webrtc**       | [`@signalwire/webrtc`](https://www.npmjs.com/package/@signalwire/webrtc)             | [`README.md`](packages/webrtc/README.md)       | [`CHANGELOG.md`](packages/webrtc/CHANGELOG.md)       |

Refer to the README of each package for further details.

### Development Setup

#### Requirements

- npm 7+ ([more info](https://docs.npmjs.com/cli/v7/using-npm/workspaces))
- Node.js 14+

#### Local Environment Setup

From the root folder run:

1. `npm i`
2. `npm run build`

#### Development Workflow

The normal flow should look to something like this:

1. Make a change in one of the existing (or new) packages
2. Run `npm run changeset`. This will ask you a set of questions about the changes you've made.
3. Create a `Pull Request` on GitHub.

## License

Copyright © 2018-2023 SignalWire. It is free software, and may be redistributed under the terms specified in the [MIT-LICENSE](https://github.com/signalwire/signalwire-js/blob/master/LICENSE) file.
