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
balemeless:
  auth:
    key: your blameless-key //xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
    url: your blameless base url
  baseUrl: your blameless base url
  interval: 30 // in minutes
```

## Usage

To use the plugin add the following code to your 
``` packages/backend/src/index.ts ```

```Javascript

import {BlamelessJob} from '@blamelesshq/blameless-backstage'


....
 // Run the blameless cronjob in the blameless plugin
    const blamelessJob = new BlamelessJob({config, logger: getRootLogger(), discovery: HostDiscovery.fromConfig(config)});
    await blamelessJob.start();

```
