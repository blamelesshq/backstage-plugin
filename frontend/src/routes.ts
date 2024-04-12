import { createRouteRef } from '@backstage/core-plugin-api';

export const rootRouteRef = createRouteRef({
  id: 'blameless',
   // The parameters that must be included in the path of this route reference
   params: ['incidents'],
});
