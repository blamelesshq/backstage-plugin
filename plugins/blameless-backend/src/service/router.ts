import { errorHandler, PluginEndpointDiscovery } from '@backstage/backend-common';
import express from 'express';
import Router from 'express-promise-router';
import { Config } from '@backstage/config';
import { Logger } from 'winston';
import { BlamelessJob } from './crone-job';

export interface RouterOptions {
  logger: Logger;
  config: Config;
  discovery: PluginEndpointDiscovery;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { config, logger, discovery } = options;

  const router = Router();
  router.use(express.json());

  router.get('/health', (_, response) => {
    logger.info('PONG!');
    response.json({ status: 'ok' });
  });

  router.get('/entities', (_, response) => {
    logger.info('Getting entities');
    // start crone job
    const blamelessJob = new BlamelessJob({config, logger, discovery});
    blamelessJob.start();
    response.json({ status: 'ok' });
  }
  );

  router.use(errorHandler());
  return router;
}
