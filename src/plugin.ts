import {
    createBackendPlugin,
    coreServices,
  } from '@backstage/backend-plugin-api';
  import { loggerToWinstonLogger } from '@backstage/backend-common';
  import { createRouter } from './service/router';
  import {BlamelessJob} from './service/cron-job';
  
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
            discovery: coreServices.discovery,
            config: coreServices.rootConfig,
        },
        async init({ http, logger, discovery, config}) {
            // Start the cron job
            const blamelessJob = new BlamelessJob({config:config, logger: loggerToWinstonLogger(logger), discovery: discovery});
            await blamelessJob.start();
          http.use(
            await createRouter({
                logger: loggerToWinstonLogger(logger),
            }),
          );
        },
      });
    },
  });