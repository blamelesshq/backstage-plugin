import { mockServices, startTestBackend } from '@backstage/backend-test-utils';
import request from 'supertest';
import { blamelessPlugin } from './plugin';


describe('blameless', () => {
    it('can serve values from config', async () => {
        const fakeConfig = { blamelessPlugin: { value: 7 } };
        const { server } = await startTestBackend({
            features: [
                blamelessPlugin(),
                mockServices.rootConfig.factory({data: fakeConfig}),
            ],
        });
    
        const response = await request(server).get('blameless/health');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ status: 'ok' });
    });
});