import getPort from 'get-port';
import { startServer, stopServer } from './test/WSServer.mjs';

/** @typedef {import('@web/dev-server').DevServerConfig} DevServerConfig */

/** @type number */
let wsPort;

export default /** @type DevServerConfig */ ({
  plugins: [
    // ws server
    {
      name: 'ws-server',
      async serverStart() {
        wsPort = await getPort({ port: getPort.makeRange(8000, 8100) });
        await startServer(wsPort);
      },
      async serverStop() {
        await stopServer();
      },
    },

    // env variables
    {
      name: 'env-vars',
      // eslint-disable-next-line consistent-return
      serve(context) {
        if (context.path === '/test/env.js') {
          return `export default { port: "${wsPort}" }`;
        }
      },
    },
  ],
});
