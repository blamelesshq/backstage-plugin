import { CatalogClient } from '@backstage/catalog-client';
import { BlamelessService } from './blameless';
import { TaskScheduler } from '@backstage/backend-tasks';
import { BlamelessConnectionConfig, Service } from './types';


export class BlamelessJob {
    public readonly blamelessService: BlamelessService;
    private readonly catalogClient: CatalogClient;
    constructor(connectionConfig: BlamelessConnectionConfig) {
        this.blamelessService = new BlamelessService(connectionConfig);
        this.catalogClient = new CatalogClient({ discoveryApi: this.blamelessService.connectionConfig.discovery });
    }

    async listCatalog(): Promise<any[]> {
        // get list of backstage entities by kind
        const kinds = this.blamelessService.kinds;
        const entities = await this.catalogClient.getEntities({ filter: {kind : kinds}});
        return entities.items;
    }

    async updateBlamelessServices(): Promise<void> {
        // log update blameless services
        this.blamelessService.connectionConfig.logger.info('Updating blameless services');
        // get list of entities
        const entities = await this.listCatalog();
        // map entities to services
        const services: Service[] = entities.map((entity: any) => {
            return {
                name: entity.metadata.name,
                kind: entity.kind,
                namespace: entity.metadata.namespace || 'default',
                type: entity.spec.type || 'other',
            }
        });
        // update blameless services
        await this.blamelessService.updateServices(services);
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