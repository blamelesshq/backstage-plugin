import React from 'react';
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
    name: 'BlamelessPage',
    component: () =>
      import('./components/Blameless').then(m => m.IncidentComponent),
    mountPoint: rootRouteRef,
  }),
);