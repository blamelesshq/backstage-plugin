import {
  errorHandler,
  loadBackendConfig,
  HostDiscovery,
} from '@backstage/backend-common';
import express from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';
import { BlamelessJob } from './cron-job';

export interface RouterOptions {
  logger: Logger;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger } = options;

  const config = await loadBackendConfig({
    argv: process.argv,
    logger: logger,
  });

  const router = Router();
  router.use(express.json());

  // Start the cron job
  const blamelessJob =new BlamelessJob({config, logger: logger, discovery: HostDiscovery.fromConfig(config)});
  await blamelessJob.start();

  router.get('blameless/health', (_, response) => {
    logger.info('PONG!');
    response.json({ status: 'ok' });
  });

  router.use(errorHandler());
  return router;
}
