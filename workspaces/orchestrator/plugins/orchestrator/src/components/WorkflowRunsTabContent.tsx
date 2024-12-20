/*
 * Copyright 2024 The Backstage Authors
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
import React, { useState } from 'react';

import {
  ErrorPanel,
  InfoCard,
  Link,
  SelectItem,
  TableColumn,
} from '@backstage/core-components';
import { useApi, useRouteRef } from '@backstage/core-plugin-api';

import { Grid } from '@material-ui/core';

import {
  capitalize,
  ellipsis,
  ProcessInstanceState,
  ProcessInstanceStatusDTO,
} from '@red-hat-developer-hub/backstage-plugin-orchestrator-common';

import { orchestratorApiRef } from '../api';
import { DEFAULT_TABLE_PAGE_SIZE, VALUE_UNAVAILABLE } from '../constants';
import usePolling from '../hooks/usePolling';
import { workflowInstanceRouteRef } from '../routes';
import { Selector } from './Selector';
import OverrideBackstageTable from './ui/OverrideBackstageTable';
import { mapProcessInstanceToDetails } from './WorkflowInstancePageContent';
import { WorkflowInstanceStatusIndicator } from './WorkflowInstanceStatusIndicator';
import { WorkflowRunDetail } from './WorkflowRunDetail';

const makeSelectItemsFromProcessInstanceValues = () =>
  [
    ProcessInstanceState.Active,
    ProcessInstanceState.Error,
    ProcessInstanceState.Completed,
    ProcessInstanceState.Aborted,
    ProcessInstanceState.Suspended,
  ].map(
    (status): SelectItem => ({
      label: capitalize(status),
      value: status,
    }),
  );

export const WorkflowRunsTabContent = () => {
  const orchestratorApi = useApi(orchestratorApiRef);
  const workflowInstanceLink = useRouteRef(workflowInstanceRouteRef);
  const [statusSelectorValue, setStatusSelectorValue] = useState<string>(
    Selector.AllItems,
  );

  const fetchInstances = React.useCallback(async () => {
    const instances = await orchestratorApi.listInstances({});
    const clonedData: WorkflowRunDetail[] =
      instances.data.items?.map(mapProcessInstanceToDetails) || [];
    return clonedData;
  }, [orchestratorApi]);

  const { loading, error, value } = usePolling(fetchInstances);

  const columns = React.useMemo(
    (): TableColumn<WorkflowRunDetail>[] => [
      {
        title: 'ID',
        field: 'id',
        render: data => (
          <Link to={workflowInstanceLink({ instanceId: data.id })}>
            {ellipsis(data.id)}
          </Link>
        ),
        sorting: false,
      },
      {
        title: 'Name',
        field: 'name',
      },
      {
        title: 'Status',
        field: 'status',
        render: data => (
          <WorkflowInstanceStatusIndicator
            status={data.status as ProcessInstanceStatusDTO}
          />
        ),
      },
      {
        title: 'Category',
        field: 'category',
        render: data => capitalize(data.category ?? VALUE_UNAVAILABLE),
      },
      { title: 'Started', field: 'started', defaultSort: 'desc' },
      { title: 'Duration', field: 'duration' },
    ],
    [workflowInstanceLink],
  );

  const statuses = React.useMemo(makeSelectItemsFromProcessInstanceValues, []);

  const filteredData = React.useMemo(
    () =>
      (value ?? []).filter(
        (row: WorkflowRunDetail) =>
          statusSelectorValue === Selector.AllItems ||
          row.status?.toLocaleLowerCase('en-US') === statusSelectorValue,
      ),
    [statusSelectorValue, value],
  );

  const selectors = React.useMemo(
    () => (
      <Grid container alignItems="center">
        <Grid item>
          <Selector
            label="Status"
            items={statuses}
            onChange={setStatusSelectorValue}
            selected={statusSelectorValue}
          />
        </Grid>
      </Grid>
    ),
    [statusSelectorValue, statuses],
  );
  const paging = (value?.length || 0) > DEFAULT_TABLE_PAGE_SIZE; // this behavior fits the backstage catalog table behavior https://github.com/backstage/backstage/blob/v1.14.0/plugins/catalog/src/components/CatalogTable/CatalogTable.tsx#L228

  return error ? (
    <ErrorPanel error={error} />
  ) : (
    <InfoCard noPadding title={selectors}>
      <OverrideBackstageTable
        title="Workflow Runs"
        options={{
          paging,
          search: true,
          pageSize: DEFAULT_TABLE_PAGE_SIZE,
        }}
        isLoading={loading}
        columns={columns}
        data={filteredData}
      />
    </InfoCard>
  );
};
