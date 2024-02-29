# blameless

Welcome to the blameless backstage backend plugin!


## Getting started

Your plugin has been added to the example app in this repository, meaning you'll be able to access it by running `yarn
start` in the root directory, and then navigating to [/blameless](http://localhost:3000/blameless).

You can also serve the plugin in isolation by running `yarn start` in the plugin directory.
This method of serving the plugin provides quicker iteration speed and a faster startup and hot reloads.
It is only meant for local development, and the setup for it can be found inside the [/dev](/dev) directory.


## Installation

To install the Blameless backstage plugin.
run the following command in the root of your backstage app
You can install MyNpmPackage via yarn:

```bash
  yarn --cwd packages/backend add @blamelesshq/blameless-backstage app
```
 
## Requirments

To utilize the Blameless plugin, please ensure that the following config are added to you config yaml file:

- balemeless:
  auth:
    key: your blameless-key //xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
    url: your blameless base url
  baseUrl: your blameless base url
  interval: 30 // in minutes


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
