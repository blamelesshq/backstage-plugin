import {
    createBackendPlugin,
    coreServices,
  } from '@backstage/backend-plugin-api';
  import { loggerToWinstonLogger } from '@backstage/backend-common';
  import { createRouter } from './service/router';
  
  /**
   * The Blameless plugin is responsible for providing a backend for the Blameless
   * @public
   */
  export const blamelessPlugin = createBackendPlugin({
    pluginId: 'blameless',
    register(env) {
      env.registerInit({
        deps: {
            logger: coreServices.logger,
            http: coreServices.httpRouter,
        },
        async init({ http, logger }) {
          http.use(
            await createRouter({
                logger: loggerToWinstonLogger(logger),
            }),
          );
        },
      });
    },
  });