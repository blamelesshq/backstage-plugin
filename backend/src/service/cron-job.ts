
import { BlamelessService } from './blameless';
import { TaskScheduler } from '@backstage/backend-tasks';
import { BlamelessConnectionConfig } from './types';
import { ServerTokenManager } from '@backstage/backend-common';

export class BlamelessJob {
    public readonly blamelessService: BlamelessService;
    constructor(connectionConfig: BlamelessConnectionConfig) {
        this.blamelessService = new BlamelessService(connectionConfig);
    }

    async listCatalog(): Promise<any> {
        // get list of backstage entities by kind
        const kinds = this.blamelessService.kinds;
        // get token from app-config file
        // const token = this.blamelessService.connectionConfig.config.getString('backend.auth.keys[0].secret');
        const tokenManager = ServerTokenManager.fromConfig(this.blamelessService.connectionConfig.config, { logger: this.blamelessService.connectionConfig.logger });
        const token = await tokenManager.getToken();
        try{
            const entities = await this.blamelessService.connectionConfig.catalogClient.getEntities({
                filter: {
                    kind: kinds,
                },
            }, token);
            console.log(entities);
            return entities;
        } catch (error) {
            this.blamelessService.connectionConfig.logger.error('Error fetching entities from catalog', error);
            return error;
        }
    }

    async updateBlamelessServices(): Promise<void> {
        // log update blameless services
        this.blamelessService.connectionConfig.logger.info('Updating blameless services');
        // get list of entities
        const entities = await this.listCatalog();
        // update blameless services
        if (entities?.items){
            await this.blamelessService.updateServices(entities.items);
        } else {
            this.blamelessService.connectionConfig.logger.info('Failed to get entities from catalog');
        }
    }
    
    async start(): Promise<void> {
        // start crone job
        this.blamelessService.connectionConfig.logger.info('Starting crone job');
        const scheduler = TaskScheduler.fromConfig(this.blamelessService.connectionConfig.config).forPlugin('blameless-backend');
        scheduler.scheduleTask({
            id: 'blameless-service-update',
            frequency: {cron: `*/${this.blamelessService.interval} * * * *`},
            timeout: { seconds: 30 },
            fn: async () => {
                await this.updateBlamelessServices();
            }
        });
    }
}