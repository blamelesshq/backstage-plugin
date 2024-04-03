# blameless Plugin

Welcome to the blameless backstage front-end plugin!


## Overview

**Backstage Front-End Plugin** is a front-end plugin designed specifically for Blameless clients, offering seamless integration with the Backstage platform to manage and access Blameless incidents directly from the Backstage user interface. This plugin provides Blameless users with convenient and intuitive tools to interact with their incidents, enabling efficient incident management workflows within the familiar Backstage environment. With features customized for Blameless clients, such as incident tracking, resolution status updates, and retrospective analysis, the Backstage Front-End Plugin enhances collaboration and transparency in incident response processes.


## Installation

To install the Blameless backstage plugin.
run the following command in the root of your backstage app
You can install Blameless via yarn:

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

### Front-End

  To use the plugin add the following code to your 
  ``` packages/app/src/components/Root/Root.tsx ```

  ```Javascript
    // packages/app/src/components/Root/Root.tsx
  import {BlamelessLogo} from '@blamelesshq/blameless-backstage/frontend';

    export const Root = ({ children }: PropsWithChildren<{}>) => (
    ... 
    <SidebarItem icon={BlamelessLogo} to="blameless" text="Blameless" />; //<<-- Add the blameless plugin 
    ....
    );
  ```


  and add the following: 
  ``` packages/app/src/App.tsx ```

  ```Javascript
  // packages/app/src/App.tsx
  import {BlamelessuiPage} from '@blamelesshq/blameless-backstage/frontend';

    const routes = (
    ... 
    <Route path="blameless" element={<BlamelessuiPage />} /> //<<-- Add the blameless plugin
    ....
    )
    ....

  ```


### Backend-End
To use the plugin add the following code to your 
``` packages/backend/src/index.ts ```

#### For the new Backend system
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