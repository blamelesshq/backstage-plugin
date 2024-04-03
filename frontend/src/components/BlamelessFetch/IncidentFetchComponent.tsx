import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Table, TableColumn, Progress, ResponseErrorPanel } from '@backstage/core-components';
import useAsync from 'react-use/lib/useAsync';
import { useApi, configApiRef } from '@backstage/core-plugin-api';

const useStyles = makeStyles({
  avatar: {
    height: 32,
    width: 32,
    borderRadius: '50%',
  },
  link:{
    color:'blue'
  }
});

type BlamelessIncident = {
  id: number,
  title: string,
  status: string,
  severity: string,
  incident_type: string,
  created: string,
  postmortem_url: string,
  incident_url: string,
};

type DenseTableProps = {
  incidents: BlamelessIncident[];
};

export const DenseTable = ({ incidents }: DenseTableProps) => {
  const classes = useStyles();

  const columns: TableColumn[] = [
    { title: 'ID', field: 'id', width: '8%'},
    { title: 'Postmortem', field: 'postmortem', width: '8%'},
    { title: 'Title', field: 'title', width: '30%'},
    { title: 'Type', field: 'type', width: '10%'},
    { title: 'Severity', field: 'severity', width: '10%'},
    { title: 'Status', field: 'status', width: '14%'},
    { title: 'Created', field: 'created', width: '20%'},
  ];

  const data = incidents.map(incident => {
    return {
      id: <a href={incident.incident_url} target='blank' className={classes.link}>INC-{incident.id}</a>,
      postmortem: incident.postmortem_url?
      <a href={incident.postmortem_url} target='blank' className={classes.link}>RS-{incident.id}</a>
      : 'N/A',
      title: incident.title,
      type: incident.incident_type,
      severity: incident.severity,
      status: incident.status,
      created: new Date(incident.created).toLocaleString(),
    };
  });
  return (
      <Table
        title="Incidents"
        options={{
          search: false,
          paging: false,
          columnResizable: true,
        }}
        columns={columns}
        data={data || []}
      />
    );
};

export const IncidentFetchComponent = () => {
  const config = useApi(configApiRef);
  const { value, loading, error } = useAsync(async (): Promise<BlamelessIncident[]> => {
    // fetch blameless incidents
    const backendUrl = config.getString('backend.baseUrl');
    const response = await fetch(`${backendUrl}/api/blameless/incidents`);
    return response?.json() || [];
  }, []);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  return <DenseTable incidents={value || []} />;
};
