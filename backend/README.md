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
  authKey: your blameless-key # xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
  baseUrl: your blameless base url # https://example.blameless.com
  interval: 30 # in minutes
  kinds:
    - Component
```

## Usage

To use the plugin add the following code to your 
``` packages/backend/src/index.ts ```

#### For the new Backend system

To enable Auth Service-to-Service:
  run this command to generate the signing secret:
  ```bash
  node -p 'require("crypto").randomBytes(24).toString("base64")'
  ```

  Then enbale the the Auth uncomment the following lines in the app-config.yaml
  ```yaml
  backend:
    # Used for enabling authentication, secret is shared by all backend plugins
    # See https://backstage.io/docs/auth/service-to-service-auth for
    # information on the format
    auth:
      keys:
        - secret: GiNQIQJ0mSXj8NxQlZZHPbddmehKrd8h #<<----- siging secret generated earlier
  ```

  Then
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
  backend.add(import('@blamelesshq/blameless-backstage/backend')); //<<-- Add the blameless plugin 
  ....

  ```


#### For the old Backend system

  Create new file under the plugins call it blameless
  ```Javascript
  // packages/backend/src/plugins/blameless.ts
  import {createRouter} from '@blamelesshq/blameless-backstage/backend';
  import { Router } from 'express';
  import { PluginEnvironment } from '../types';

  export default async function createPlugin(
    env: PluginEnvironment,
  ): Promise<Router> {
    // Here is where you will add all of the required initialization code that
    // your backend plugin needs to be able to start!

    // The env contains a lot of goodies, but our router currently only
    // needs a logger
    return await createRouter({
      logger: env.logger,
    });
  }
  ```
  Add the following the index file
  ```Javascript
  // packages/backend/src/index.ts
  import blameless from './plugins/blameless';

  ...
  const blamelessEnv = useHotMemoize(module, () => createEnv('blameless'));
  
  ....
  apiRouter.use('/blameless', await blameless(blamelessEnv));
  ```