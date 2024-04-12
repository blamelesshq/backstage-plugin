import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { blamelessuiPlugin, BlamelessuiPage } from '../src/plugin';

createDevApp()
  .registerPlugin(blamelessuiPlugin)
  .addPage({
    element: <BlamelessuiPage />,
    title: 'Root Page',
    path: '/blamelessui'
  })
  .render();
