import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Table, TableColumn, Progress, ResponseErrorPanel } from '@backstage/core-components';
import {SearchBar} from '@backstage/plugin-search-react';
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
  },
  searchBar: {
    marginBottom: '1rem',
    width: '50%',
    borderRadius: '10px',
  },

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
  param:{
    page: number;
    limit: number;
    count: number;
  };
  setParam: (param: {page: number, limit: number, count:number}) => void;
};

export const DenseTable = ({ incidents, param, setParam }: DenseTableProps) => {
  const classes = useStyles();
  const columns: TableColumn[] = [
    { id:1, title: 'ID', field: 'id', width: '8%'},
    { id:2, title: 'Postmortem', field: 'postmortem', width: '8%'},
    { id:3, title: 'Title', field: 'title', width: '30%'},
    { id:4, title: 'Type', field: 'type', width: '10%'},
    { id:5, title: 'Severity', field: 'severity', width: '10%'},
    { id:6, title: 'Status', field: 'status', width: '14%'},
    { id:7, title: 'Created', field: 'created', width: '20%'},
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

  const pageChanged = (page: number) => {
    setParam({
      ...param,
      page: page
    });
  };
  return (
      <Table
        title="Incidents"
        options={{
          search: false,
          paging: true,
          columnResizable: true,
          pageSize: param.limit,
          paginationPosition: 'bottom',
        }}
        columns={columns}
        data={data || []}
        onPageChange={(page: number) => pageChanged(page)}
        totalCount={param.count}
        page={param.page}
        />
    );
};

export const IncidentFetchComponent = () => {
  const classes = useStyles();
  const [search, setSearch] = useState('');
  const [param, setParam] = useState({
    page: 0,
    limit:20,
    count: 0,
  });
  const searchChanged = (val: string) => {
    setSearch(val);
  };
  const config = useApi(configApiRef);
  const { value, loading, error } = useAsync(async (): Promise<BlamelessIncident[]> => {
    // fetch blameless incidents
    try {
      const backendUrl = config.getString('backend.baseUrl');
      const response = await fetch(`${backendUrl}/api/blameless/incidents?limit=${param.limit}&page=${param.page}&search=${search}`);
      const data = await response.json();
      if (!response.ok) {
        throw data.error || 'error occurred fetching incidents';
      }
      
      setParam({
        ...param,
        count: data.pagination.count,
      });
      return data.incidents;
    } catch (error_) {
      throw new Error(`Failed to fetch incidents, ${error_}`);
    }
  }, [param.page, search]);


  if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  return(
    <>
      <SearchBar
        placeholder="Search for incidents"
        value={search}
        onChange={(val) => searchChanged(val)}
        className={classes.searchBar}
      />
      {loading? <Progress /> : <DenseTable incidents={value || []} param={param} setParam={setParam}/>}
    </>
  );
};
