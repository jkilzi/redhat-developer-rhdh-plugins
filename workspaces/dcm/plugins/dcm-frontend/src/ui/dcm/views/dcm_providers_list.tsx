/*
 * Copyright Red Hat, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {
  Table,
  TableColumn,
  InfoCard,
  Progress,
} from '@backstage/core-components';
import { useAsync } from 'react-use';
import { Box, Chip, Typography, makeStyles } from '@material-ui/core';
import StorageIcon from '@material-ui/icons/Storage';
import CloudIcon from '@material-ui/icons/Cloud';
import ComputerIcon from '@material-ui/icons/Computer';

const useStyles = makeStyles(theme => ({
  statusChip: {
    fontWeight: 'bold',
  },
  running: {
    backgroundColor: theme.palette.success.main,
    color: theme.palette.success.contrastText,
  },
  stopped: {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
  },
  pending: {
    backgroundColor: theme.palette.warning.main,
    color: theme.palette.warning.contrastText,
  },
}));

type Provider = {
  id: string;
  name: string;
  type: string;
  status: 'running' | 'stopped' | 'pending';
  instances: number;
  region: string;
  description: string;
};

const getProviderIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'openshift virtualization':
      return <ComputerIcon />;
    case 'cloud':
      return <CloudIcon />;
    default:
      return <StorageIcon />;
  }
};

export const DcmProvidersList = () => {
  const classes = useStyles();

  // Fetch providers data
  const { value, loading, error } = useAsync(async () => {
    // In a real implementation, this would fetch from an API
    // For now, we'll return mock data based on the catalog
    const providers: Provider[] = [
      {
        id: 'openshift-virt-001',
        name: 'OpenShift Virtualization Cluster 1',
        type: 'OpenShift Virtualization',
        status: 'running',
        instances: 250,
        region: 'US-East',
        description: 'Primary production cluster for OpenShift VMs',
      },
      {
        id: 'openshift-virt-002',
        name: 'OpenShift Virtualization Cluster 2',
        type: 'OpenShift Virtualization',
        status: 'running',
        instances: 180,
        region: 'US-West',
        description: 'Secondary cluster for disaster recovery',
      },
      {
        id: 'openshift-virt-003',
        name: 'OpenShift Virtualization Dev Cluster',
        type: 'OpenShift Virtualization',
        status: 'running',
        instances: 95,
        region: 'EU-Central',
        description: 'Development and testing environment',
      },
      {
        id: 'cloud-provider-001',
        name: 'AWS Infrastructure',
        type: 'Cloud',
        status: 'running',
        instances: 342,
        region: 'Multi-Region',
        description: 'Amazon Web Services cloud infrastructure',
      },
      {
        id: 'on-prem-dc-001',
        name: 'On-Premises Data Center',
        type: 'Physical',
        status: 'running',
        instances: 156,
        region: 'Corporate HQ',
        description: 'Legacy on-premises infrastructure',
      },
    ];

    return providers;
  });

  if (loading) {
    return <Progress />;
  }

  if (error) {
    return (
      <InfoCard title="Providers">
        <Typography color="error">
          Error loading providers: {error.message}
        </Typography>
      </InfoCard>
    );
  }

  const columns: TableColumn<Provider>[] = [
    {
      title: 'Provider',
      field: 'name',
      highlight: true,
      render: (row: Provider) => (
        <Box display="flex" alignItems="center" sx={{ gridGap: 1 }}>
          {getProviderIcon(row.type)}
          <Box ml={1}>
            <Typography variant="body2" style={{ fontWeight: 'bold' }}>
              {row.name}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {row.description}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      title: 'Type',
      field: 'type',
      width: '15%',
    },
    {
      title: 'Status',
      field: 'status',
      width: '12%',
      render: (row: Provider) => (
        <Chip
          label={row.status.toUpperCase()}
          size="small"
          className={`${classes.statusChip} ${classes[row.status]}`}
        />
      ),
    },
    {
      title: 'Instances',
      field: 'instances',
      type: 'numeric',
      width: '10%',
      render: (row: Provider) => (
        <Typography variant="body2" style={{ fontWeight: 'bold' }}>
          {row.instances}
        </Typography>
      ),
    },
    {
      title: 'Region',
      field: 'region',
      width: '15%',
    },
  ];

  return (
    <InfoCard
      title="Data Center Providers"
      subheader={`Total Providers: ${value?.length || 0} | Total Instances: ${
        value?.reduce((sum, p) => sum + p.instances, 0) || 0
      }`}
    >
      <Table
        options={{
          search: true,
          paging: true,
          pageSize: 10,
          padding: 'dense',
        }}
        columns={columns}
        data={value || []}
        title=""
      />
    </InfoCard>
  );
};
