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
          config: coreServices.rootConfig,
          discovery: coreServices.discovery,
          http: coreServices.httpRouter,
        },
        async init({ http, logger, config, discovery}) {
          http.addAuthPolicy({ path: '/', allow: 'unauthenticated', });
          http.use(
            await createRouter({
                logger: loggerToWinstonLogger(logger),
                discovery: discovery,
                config: config,
            }),
          );
        },
      });
    },
  });