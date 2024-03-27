import { createPlugin, createRoutableExtension } from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const blamelessuiPlugin = createPlugin({
  id: 'blamelessui',
  routes: {
    root: rootRouteRef,
  },
});

export const BlamelessuiPage = blamelessuiPlugin.provide(
  createRoutableExtension({
    name: 'BlamelessuiPage',
    component: () =>
      import('./components/ExampleComponent').then(m => m.ExampleComponent),
    mountPoint: rootRouteRef,
  }),
);
