import React, {useState} from 'react';
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
  pagination:{
    page: number;
    limit: number;
    count: number;
  };
  setPagination: (pagination: {page: number, limit: number, count:number}) => void;
};

export const DenseTable = ({ incidents, pagination, setPagination }: DenseTableProps) => {
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

  const stateChanged = (val: number) => {
    setPagination({
      ...pagination,
      page: val
    });
  };
  return (
    <>
      <Table
        title="Incidents"
        options={{
          search: false,
          paging: true,
          columnResizable: true,
          pageSize: pagination.limit,
        }}
        columns={columns}
        data={data || []}
        onPageChange={(page) => stateChanged(page)}
        totalCount={pagination.count}
        page={pagination.page}
        />
      </>
    );
};

export const IncidentFetchComponent = () => {
  const [pagination, setPagination] = useState({
    page: 0,
    limit:20,
    count: 0,
  });
  const config = useApi(configApiRef);
  const { value, loading, error } = useAsync(async (): Promise<BlamelessIncident[]> => {
    // fetch blameless incidents
    const backendUrl = config.getString('backend.baseUrl');
    const response = await fetch(`${backendUrl}/api/blameless/incidents?limit=${pagination.limit}&page=${pagination.page}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch incidents, ${response.status}`);
    }
    const data = await response.json();
    setPagination({
      ...pagination,
      count: data.pagination.count,
    });
    return data.incidents;
  }, [pagination.page]);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  return <DenseTable incidents={value || []} pagination={pagination} setPagination={setPagination} />;
};
