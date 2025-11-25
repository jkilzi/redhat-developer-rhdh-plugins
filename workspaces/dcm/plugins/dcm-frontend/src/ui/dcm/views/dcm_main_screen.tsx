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
import { Page, Header, Content, InfoCard } from '@backstage/core-components';
import { Grid, Typography } from '@material-ui/core';
import { DcmProvidersList } from './dcm_providers_list';

export const DcmMainScreen = () => {
  return (
    <Page themeId="tool">
      <Header
        title="DCM"
        subtitle="Overview of data center providers and instances"
      />
      <Content>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <InfoCard title="Welcome to DCM">
              <Typography variant="body1" paragraph>
                This plugin displays information about your data center
                infrastructure, including various providers and virtual machine
                instances.
              </Typography>
              <Typography variant="body2" color="textSecondary">
                View and manage your OpenShift Virtualization instances, cloud
                providers, and other infrastructure components from this
                centralized dashboard.
              </Typography>
            </InfoCard>
          </Grid>
          <Grid item xs={12}>
            <DcmProvidersList />
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};
