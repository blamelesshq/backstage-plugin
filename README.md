# blameless Plugin

Welcome to the blameless backstage backend plugin!


## Overview

**Backstage Backend Sync Plugin** is a backend plugin designed specifically for Blameless clients who need to synchronize their entities effortlessly. 
With this plugin, clients can seamlessly sync their entities with blameless on a periodic interval, ensuring consistency and accuracy.


## Installation

To install the Blameless backstage plugin.
run the following command in the root of your backstage app
You can install MyNpmPackage via yarn:

```bash
  yarn --cwd packages/backend add @blamelesshq/blameless-backstage app
```
 
## Requirments

To utilize the Blameless plugin, please ensure that the following config are added to you config yaml file:


```yaml
blameless:
  authKey: your blameless-key //xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
  baseUrl: your blameless base url // https://example.blameless.com
  interval: 30 // in minutes
  kinds:
    - Component
```

## Usage

To use the plugin add the following code to your 
``` packages/backend/src/index.ts ```

The blamless backstage backend plugin uses the New Backend System
```Javascript
// packages/backend/src/index.ts

import { createBackend } from '@backstage/backend-defaults';

const backend = createBackend();
backend.add(import('@backstage/plugin-app-backend/alpha'));
backend.add(import('@backstage/plugin-catalog-backend/alpha'));
backend.add(import('@backstage/plugin-scaffolder-backend/alpha'));
backend.add(
  import('@backstage/plugin-catalog-backend-module-scaffolder-entity-model'),
);
... 
backend.add(import('@blamelesshq/blameless-backstage')); //<<-- Add the blameless plugin 
....

```

