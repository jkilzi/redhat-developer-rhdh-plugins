# Orchestrator Plugin for Backstage

The Orchestrator for Backstage is a mechanism designed to facilitate the implementation and execution of developer self-service flows. It serves as a vital component that enhances and augments the existing scaffolder functionality of Backstage with a more flexible and powerful set of features including long-running and asynchronous flows.

The orchestrator works harmoniously with other Backstage components such as the Software Catalog, permissions, and plugins as well as others. By leveraging its capabilities, organizations can orchestrate and coordinate developer self-service flows effectively.

## Context

The Backstage Orchestrator plugin aims to provide a better option to Scaffolder, based on workflows to have a more flexible and powerful tool that addresses the need by streamlining and automating processes, allowing developers to focus more on coding and innovation.

The orchestrator relies on [SonataFlow](https://sonataflow.org/), a powerful tool for building cloud-native workflow applications.

The main idea is to keep the same user experience for users, leveraging the UI components, input forms, and flow that Scaffolder provides, this way it should be straightforward for users and transparent no matter whether using Templates or Workflows, both can live together being compatible with integration points.

The orchestrator controls the flow orchestrating operations/tasks that may be executed in any external service including Scaffolder Actions, this way it is possible to leverage any existing Action hence Software Templates can be easily migrated to workflows opening the door to extend them to more complex use cases.

## Capabilities

**Advanced core capabilities**

- Stateful/long-lived
- Branching and parallelism
- Error management and compensation
- Event-driven supporting [CloudEvents](https://cloudevents.io)
- Audit logging
- Sub-flows
- Choreography
- Timer/timeout control
- Built-in powerful expression evaluation with JQ
- Low Code/No code
- Cloud-native architecture Kubernetes/OpenShift with Operator support
- OpenAPI / REST built-in integration etc.

**Client-side tooling**

- Orchestration visualization / graphical editor
- Integration with service catalog/actions
- GitHub integration
- Form generation
- Runtime monitoring of instances
- Dashboards
- Potential custom integrations (user interaction, notifications, etc.)

## For administrators

### Installation

The Orchestrator plugin is composed of the following packages:

- `@red-hat-developer-hub/backstage-plugin-orchestrator-backend` package connects the Backstage server to the Orchestrator. For setup process, see [Backend Setup](#setting-up-the-orchestrator-backend-package)
- `@red-hat-developer-hub/backstage-plugin-orchestrator` package contains frontend components for the Orchestrator plugin. For setup process, see [Frontend Setup](#setting-up-the-orchestrator-frontend-package)
- `@red-hat-developer-hub/backstage-plugin-orchestrator-common` package contains shared code between the Orchestrator plugin packages.

#### Prerequisites for running the plugins locally in development mode

- Docker up and running

#### Setting up the Orchestrator as a dynamic plugin in a Helm deployment

Please follow this link for instructions: https://github.com/janus-idp/backstage-showcase/blob/main/docs/dynamic-plugins/installing-plugins.md#installing-external-dynamic-plugins.

#### Setting up the configuration for the Orchestrator plugin

The following configuration is required for the Orchestrator plugin to work properly:

```yaml title="app-config.yaml"
backend:
  csp:
    frame-ancestors: ['http://localhost:3000', 'http://localhost:7007']
    script-src: ["'self'", "'unsafe-inline'", "'unsafe-eval'"]
    script-src-elem: ["'self'", "'unsafe-inline'", "'unsafe-eval'"]
    connect-src: ["'self'", 'http:', 'https:', 'data:']
orchestrator:
  sonataFlowService:
    baseUrl: http://localhost
    port: 8899
    autoStart: true
    workflowsSource:
      gitRepositoryUrl: https://github.com/parodos-dev/backstage-orchestrator-workflows
      localPath: /tmp/orchestrator/repository
  dataIndexService:
    url: http://localhost:8899
```

- When interacting with an existing SonataFlow infrastructure, the `sonataFlowService` config section must be entirely omitted and the `dataIndexService.url` must point to the existing Data Index Service.

For more information about the configuration options, including other optional properties, see the [config.d.ts](plugins/orchestrator-common/config.d.ts) file.

#### How to use the Git Hub identity provider

The `workspaces/orchestrator/app-config.yaml` and the `workspaces/orchestrator/packages/app/src/App.tsx` files contain sufficient configuration to use the Git Hub identity provider.

Feel free to update the `users.yaml` file to match your identity.

To run, additional secrets needs to be provided:

```
export AUTH_GITHUB_CLIENT_ID=...fill
export AUTH_GITHUB_CLIENT_SECRET=...fill

yarn dev
```

#### Setting up the Orchestrator backend package

1. Install the Orchestrator backend plugin using the following command:

   ```console
   yarn workspace backend add @red-hat-developer-hub/backstage-plugin-orchestrator-backend
   ```

1. Add the following code to the `packages/backend/src/index.ts` file:

   ```ts title="packages/backend/src/index.ts"
   const backend = createBackend();

   /* highlight-add-next-line */
   backend.add(
     import('@red-hat-developer-hub/backstage-plugin-orchestrator-backend'),
   );

   backend.start();
   ```

#### Setting up the Orchestrator frontend package

1. Install the Orchestrator frontend plugin using the following command:

   ```console
   yarn workspace app add @red-hat-developer-hub/backstage-plugin-orchestrator
   ```

1. Add a route to the `OrchestratorPage` and the customized template card component to Backstage App (`packages/app/src/App.tsx`):

   ```tsx title="packages/app/src/App.tsx"
   /* highlight-add-next-line */
   import { OrchestratorPage } from '@red-hat-developer-hub/backstage-plugin-orchestrator';

   const routes = (
     <FlatRoutes>
       {/* ... */}
       {/* highlight-add-next-line */}
       <Route path="/orchestrator" element={<OrchestratorPage />} />
     </FlatRoutes>
   );
   ```

1. Add the Orchestrator to Backstage sidebar (`packages/app/src/components/Root/Root.tsx`):

   ```tsx title="packages/app/src/components/Root/Root.tsx"
   /* highlight-add-next-line */
   import { OrchestratorIcon } from '@red-hat-developer-hub/backstage-plugin-orchestrator';

   export const Root = ({ children }: PropsWithChildren<{}>) => (
     <SidebarPage>
       <Sidebar>
         <SidebarGroup label="Menu" icon={<MenuIcon />}>
           {/* ... */}
           {/* highlight-add-start */}
           <SidebarItem
             icon={OrchestratorIcon}
             to="orchestrator"
             text="Orchestrator"
           />
           {/* highlight-add-end */}
         </SidebarGroup>
         {/* ... */}
       </Sidebar>
       {children}
     </SidebarPage>
   );
   ```

### Extensible Workflow Execution Form

The `orchestrator` plugin includes an extensible form for executing forms. For detailed guidance see the [Extensible Workflow Execution Form Documentation](https://github.com/redhat-developer/rhdh-plugins/blob/main/workspaces/orchestrator/plugins/orchestrator/docs/extensibleForm.md).

## For users

### Using the Orchestrator plugin in Backstage

The Orchestrator plugin enhances the Backstage with the execution of developer self-service flows. It provides a graphical editor to visualize workflow definitions, and a dashboard to monitor the execution of the workflows.

Refer to the [Quick start](https://github.com/redhat-developer/rhdh-plugins/blob/main/workspaces/orchestrator/plugins/orchestrator/docs/quickstart.md) to install the Orchestrator using the helm chart and execute a sample workflow through the Red Hat Developer Hub orchestrator plugin UI.

## OpenAPI

The plugin provides OpenAPI `v2` endpoints definition to facilitate communication between the frontend and backend. This approach minimizes the data that needs to be sent to the frontend, provides flexibility and avoids dependencies on changes in the [CNCF serverless specification](https://github.com/serverlessworkflow/specification/blob/main/specification.md). It also allows for a seamless transition if there's a need to replace the backend implementation.

In addition, by leveraging on OpenAPI spec, it is possible to generate clients and create CI steps.

OpenAPI specification [file](https://github.com/redhat-developer/rhdh-plugins/blob/main/workspaces/orchestrator/plugins/orchestrator-common/src/openapi/openapi.yaml) is available in [orchestrator-common](https://github.com/redhat-developer/rhdh-plugins/blob/main/workspaces/orchestrator/plugins/orchestrator-common).  
OpenAPI specification documentation is available [here](https://github.com/redhat-developer/rhdh-plugins/blob/main/workspaces/orchestrator/plugins/orchestrator-common/src/generated/docs/markdown/README.md)

### orchestrator-common

The typescript client is generated in [generated](https://github.com/redhat-developer/rhdh-plugins/blob/main/workspaces/orchestrator/plugins/orchestrator-common/src/generated/client) folder from openapi.yaml specification file.

### orchestrator-backend

The orchestrator backend can use the generated schema to validate the HTTP requests and responses.

### audit log

The orchestrator backend has audit logs for all incoming requests.

For more information about audit logs in RHDH, please refer to [the official documentation](https://docs.redhat.com/en/documentation/red_hat_developer_hub/1.2/html/getting_started_with_red_hat_developer_hub/assembly-audit-log#con-audit-log-config_assembly-audit-log).
[The official Log storage OpenShift documentation](https://docs.openshift.com/container-platform/4.15/observability/logging/log_storage/about-log-storage.html) may also be of interest.

#### Development instruction

Checkout the backstage-plugin

`git clone git@github.com:red-hat-developer-hub/backstage-plugins.git`

If you need to change the OpenAPI spec, edit the [openapi.yaml](https://github.com/redhat-developer/rhdh-plugins/blob/main/workspaces/orchestrator/plugins/orchestrator-common/src/openapi/openapi.yaml) according to your needs and then execute from the project root folder:

`yarn --cwd plugins/orchestrator-common openapi`

This command updates the [generated files](https://github.com/redhat-developer/rhdh-plugins/blob/main/workspaces/orchestrator/plugins/orchestrator-common/src/generated) including API, client and docs.

> NOTE: Do not manually edit auto-generated files

If you add a new component in the spec, then you need to export the generated typescript object [here](https://github.com/redhat-developer/rhdh-plugins/blob/main/workspaces/orchestrator/plugins/orchestrator-common/src/generated/client/api.ts). For example, if you define

```yaml
components:
  schemas:
    Person:
      type: object
      properties:
        name:
          type: string
        surname:
          type: string
```

then

```typescript
export type Person = components['schemas']['Person'];
```

When defining a new endpoint, you have to define the `operationId`.
That `id` is the one that you can use to implement the endpoint logic.

For example, let's assume you add

```yaml
paths:
  /names:
    get:
      operationId: getNames
      description: Get a list of names
      responses:
        '200':
          description: Success
          content:
            application/json:
              schema:
               type: array
                items:
                  $ref: '#/components/schemas/Person'
```

Then you can implement the endpoint in [router.ts](https://github.com/redhat-developer/rhdh-plugins/blob/main/workspaces/orchestrator/plugins/orchestrator-backend/src/service/router.ts) referring the operationId `getNames`:

```typescript
api.register('getNames', async (_c, _req, res: express.Response, next) => {
  // YOUR LOGIC HERE
  const result: Person[] = [
    { name: 'John', surname: 'Snow' },
    { name: 'John', surname: 'Black' },
  ];

  res.status(200).json(result);
});
```
