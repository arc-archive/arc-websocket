import getPort from 'get-port';
import chalk from 'chalk';
import { startServer, stopServer } from './test/WSServer.mjs';

/** @typedef {import('@web/dev-server').DevServerConfig} DevServerConfig */
/** @typedef {import('@web/dev-server-core').ServerStartParams} ServerStartParams */

/** @type number */
let wsPort;

export default /** @type DevServerConfig */ ({
  plugins: [
    // ws server
    {
      name: 'ws-server',
      /**
       * @param {ServerStartParams} args
       */
      async serverStart(args) {
        wsPort = await getPort({ port: getPort.makeRange(8000, 8100) });
        await startServer(wsPort);
        args.logger.group();
        args.logger.log(`${chalk.white('ws:')} ${chalk.cyanBright(`ws://localhost:${wsPort}`)}`);
        args.logger.groupEnd();
        args.logger.log('');
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
        if (context.path === '/demo/env.js') {
          return `export default { port: "${wsPort}" }`;
        }
      },
    },
  ],
});
