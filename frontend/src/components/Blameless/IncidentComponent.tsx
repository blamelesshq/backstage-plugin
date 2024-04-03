import React from 'react';
import { Grid } from '@material-ui/core';
import {
  Header,
  Page,
  Content,
  ContentHeader,
  HeaderLabel,
} from '@backstage/core-components';
import { IncidentFetchComponent } from '../BlamelessFetch/IncidentFetchComponent';

export const IncidentComponent = () => (
  <Page themeId="tool">
    <Header title="Welcome to blameless" subtitle="Incident management">
      <HeaderLabel label="Owner" value="Blameless" />
    </Header>
    <Content>
      <ContentHeader title="Blameless Incidents"/>
      <Grid container spacing={3} direction="column">
        <Grid item>
          <IncidentFetchComponent />
        </Grid>
      </Grid>
    </Content>
  </Page>
);
