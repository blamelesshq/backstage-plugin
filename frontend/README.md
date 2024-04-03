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

To use the plugin add the following code to your 
``` packages/app/src/components/Root/Root.tsx ```

  ```Javascript
  // packages/app/src/components/Root/Root.tsx
  ...
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
  ...
import {BlamelessuiPage} from '@blamelesshq/blameless-backstage/frontend';

  const routes = (
   ... 
   <Route path="blameless" element={<BlamelessuiPage />} /> //<<-- Add the blameless plugin
   ....
  )
  ....


  ```
