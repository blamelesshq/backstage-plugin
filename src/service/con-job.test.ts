import { BlamelessJob } from './cron-job';
import { BlamelessService } from './blameless';
import { TaskScheduler } from '@backstage/backend-tasks';


const entities = [{ apiVersion:'', metadata: { name: 'test', namespace:'default' }, kind: 'test', spec: { type: 'test' } }];
jest.mock('@backstage/catalog-client', () => {
    return {
        CatalogClient: jest.fn().mockImplementation(() => {
            return {
                getEntities: jest.fn().mockResolvedValue({ items: entities}),
            };
        }),
    };
});

jest.mock('./blameless', () => {
    return {
        BlamelessService: jest.fn().mockImplementation(() => {
            return {
                updateServices: jest.fn(),
                connectionConfig: {
                    discovery: {getBaseUrl:jest.fn(), getExternalBaseUrl:jest.fn()},
                    config: {getString: jest.fn()},
                    logger: {info: jest.fn()}
                },
                kinds: ['test'],
                interval: 5,
            };
        }),
    };
});
jest.mock('@backstage/backend-tasks', () => {
    return {
        TaskScheduler: {
            fromConfig: jest.fn().mockReturnValue({
                forPlugin: jest.fn().mockReturnValue({
                    scheduleTask: jest.fn(),
                }),
            }),
        },
    };
});

describe('BlamelessJob', () => {
    let mockBlamelessService: jest.Mocked<BlamelessService>;

    beforeEach(() => {
        mockBlamelessService = new BlamelessService({} as any) as jest.Mocked<BlamelessService>;
    });
    it('should list catalog', async () => {
        const job = new BlamelessJob(mockBlamelessService.connectionConfig);
        const result = await job.listCatalog();

        expect(result).toEqual(entities);
    });

    it('should update blameless services', async () => {
        const job = new BlamelessJob(mockBlamelessService.connectionConfig);
        await job.updateBlamelessServices();

        expect(job.blamelessService.connectionConfig.logger.info).toHaveBeenCalledWith('Updating blameless services');
        expect(job.blamelessService.updateServices).toHaveBeenCalledWith(entities);
    });

    it('should start cron job', async () => {
        const job = new BlamelessJob(mockBlamelessService.connectionConfig);

        await job.start();
        expect(job.blamelessService.connectionConfig.logger.info).toHaveBeenCalledWith('Starting crone job');
        expect(TaskScheduler.fromConfig(job.blamelessService.connectionConfig.config).forPlugin).toHaveBeenCalledWith('blameless-backend');
        expect(TaskScheduler.fromConfig(job.blamelessService.connectionConfig.config).forPlugin('blameless-backend').scheduleTask).toHaveBeenCalledWith({
            id: 'blameless-service-update',
            frequency: { cron: `*/${mockBlamelessService.interval} * * * *` },
            timeout: { seconds: 30 },
            fn: expect.any(Function),
        });
    });
});
