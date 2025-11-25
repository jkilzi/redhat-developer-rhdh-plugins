# DCM Workspace - Agent Guide

This document provides essential information for AI agents and developers working on the DCM (Dynamic Configuration Management) workspace within the Red Hat Developer Hub plugins repository.

## Overview

The DCM workspace is a Backstage plugin workspace that follows Red Hat Developer Hub (RHDH) best practices. RHDH is built on top of [CNCF Backstage](https://backstage.io/), an open platform for building developer portals. This workspace contains frontend plugins designed to extend Backstage functionality.

## Repository Context

This workspace is part of the [`redhat-developer/rhdh-plugins`](https://github.com/redhat-developer/rhdh-plugins) monorepo, which hosts plugins developed by Red Hat. The repository follows patterns similar to [`backstage/community-plugins`](https://github.com/backstage/community-plugins).

### Key Repository Information

- **License**: Apache 2.0 (all plugins must use this license)
- **NPM Scope**: `@red-hat-developer-hub` (public packages)
- **Versioning**: Semantic versioning via [Changesets](https://github.com/atlassian/changesets)
- **Node Version**: 18 || 20 (as specified in `package.json` engines)

## Workspace Structure

```
workspaces/dcm/
├── plugins/
│   └── dcm-frontend/          # Frontend plugin package
│       ├── dev/               # Standalone development server
│       ├── src/
│       │   ├── components/    # React components
│       │   ├── plugin.ts      # Plugin definition
│       │   ├── routes.ts      # Route definitions
│       │   └── index.ts       # Public API exports
│       └── package.json
├── app-config.yaml            # Backstage app configuration
├── catalog-info.yaml          # Backstage catalog entity
├── package.json               # Workspace root package.json
├── tsconfig.json              # TypeScript configuration
└── README.md
```

## Plugin Architecture

### Frontend Plugin Structure

The `dcm-frontend` plugin follows standard Backstage frontend plugin patterns:

1. **Plugin Definition** (`src/plugin.ts`):

   - Uses `createPlugin` from `@backstage/core-plugin-api`
   - Defines plugin ID: `dcm-frontend`
   - Exports routable extensions via `createRoutableExtension`

2. **Routes** (`src/routes.ts`):

   - Defines route references using `createRouteRef`
   - Used for navigation and deep linking

3. **Components** (`src/components/`):

   - React components using Material-UI v4
   - Follow Backstage component patterns (Page, Header, Content, InfoCard)
   - Include test files (`.test.tsx`)

4. **Public API** (`src/index.ts`):
   - Exports plugin and page components
   - This is what consumers import

### Development Setup

- **Standalone Development**: Run `yarn start` in the plugin directory for isolated development
- **Full App Development**: Run `yarn dev` in workspace root for full Backstage environment
- **Dev Server**: Located in `plugins/dcm-frontend/dev/index.tsx`

## Best Practices for Backstage/RHDH Plugins

### 1. Code Organization

- **Component Structure**: Group related components in folders with:

  - Component file (`.tsx`)
  - Test file (`.test.tsx`)
  - Index file (`index.ts`) for clean exports

- **File Naming**: Use PascalCase for component files, camelCase for utilities

### 2. Backstage Patterns

- **Use Backstage Components**: Prefer `@backstage/core-components` over raw Material-UI when available

  - `Page`, `Header`, `Content`, `ContentHeader`
  - `InfoCard`, `Table`, `Progress`, `ResponseErrorPanel`
  - `SupportButton` for help links

- **Theme Support**: Use `themeId` prop on `Page` component for consistent theming

  - Common values: `"tool"`, `"home"`, `"service"`, `"website"`

- **Route References**: Always use `createRouteRef` for navigation, never hardcode paths

### 3. TypeScript Guidelines

- **Strict Types**: Use explicit types, avoid `any`
- **API Types**: Define interfaces/types for API responses
- **Component Props**: Always type component props explicitly

### 4. Testing

- **Test Files**: Co-locate test files with components (`.test.tsx`)
- **Testing Library**: Use `@testing-library/react` and `@backstage/test-utils`
- **Test Coverage**: Include tests for:
  - Component rendering
  - User interactions
  - Error states
  - Loading states

### 5. Dependencies

- **Peer Dependencies**: React should be a peer dependency (not direct dependency)
- **Backstage Packages**: Use `@backstage/*` packages from the same major version
- **Material-UI**: This workspace uses Material-UI v4 (`@material-ui/core@^4.12.2`)

### 6. API Integration

- **Backend Communication**: Use Backstage's proxy configuration in `app-config.yaml`
- **API Clients**: Consider creating typed API clients for backend communication
- **Error Handling**: Always handle loading and error states in async operations

### 7. Code Style

- **Prettier**: Code is formatted with Prettier using `@spotify/prettier-config`
- **ESLint**: Follow ESLint rules configured in the workspace
- **Copyright Headers**: Include Red Hat copyright header in all source files:
  ```typescript
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
  ```

## Development Workflow

### Making Changes

1. **Create a Branch**: Work on feature branches, not directly on `main`
2. **Create Changesets**: Always create a changeset for version bumps:
   ```bash
   cd workspaces/dcm
   yarn changeset
   ```
3. **Run Tests**: Ensure all tests pass before committing
4. **Update API Reports**: If API changes are made, regenerate API reports:
   ```bash
   yarn build:api-reports
   ```

### Versioning and Releases

- **Changesets**: Required for all changes that affect package versions
- **Automatic Releases**: Merging a PR with a changeset triggers a "Version packages" PR
- **Changelog**: Changesets automatically update `CHANGELOG.md` files

### API Reports

- **Purpose**: API Extractor generates API reports to track public API changes
- **Location**: `plugins/*/report.api.md`
- **Update**: Run `yarn build:api-reports` when making API changes
- **CI Check**: API reports are validated in CI

## Common Tasks

### Adding a New Component

1. Create component folder: `src/components/NewComponent/`
2. Create component file: `NewComponent.tsx`
3. Create test file: `NewComponent.test.tsx`
4. Create index file: `index.ts` (export component)
5. Import and use in parent components

### Adding a New Route

1. Define route reference in `src/routes.ts`:
   ```typescript
   export const newRouteRef = createRouteRef({
     id: 'dcm-frontend-new-route',
   });
   ```
2. Add route to plugin definition in `src/plugin.ts`
3. Create routable extension if needed

### Adding Dependencies

1. Add to `package.json` dependencies or devDependencies
2. Run `yarn install` in workspace root
3. Update lockfile if needed
4. Consider if it should be a peer dependency

## Configuration Files

### `package.json`

- **Workspace Configuration**: Defines workspace packages (`plugins/*`, `packages/*`)
- **Scripts**: Standard Backstage CLI scripts for build, test, lint
- **Dependencies**: Workspace-level dev dependencies

### `app-config.yaml`

- **Backstage Configuration**: App-level settings for Backstage
- **Proxy Configuration**: Backend API proxy endpoints
- **Auth Configuration**: Authentication provider settings

### `catalog-info.yaml`

- **Backstage Catalog Entity**: Defines the workspace as a Backstage component
- **Metadata**: Name, description, owner, lifecycle stage

### `tsconfig.json`

- **TypeScript Configuration**: Extends `@backstage/cli/config/tsconfig.json`
- **Includes**: Source files from `plugins/*/src` and `packages/*/src`
- **Target**: ES2022 with React JSX support

## Testing Guidelines

### Unit Tests

- Use `@testing-library/react` for component testing
- Use `@backstage/test-utils` for Backstage-specific test utilities
- Mock external dependencies and API calls

### Test Structure

```typescript
import { render, screen } from '@testing-library/react';
import { TestApiProvider } from '@backstage/test-utils';
import { Component } from './Component';

describe('Component', () => {
  it('should render', () => {
    render(<Component />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

## Documentation

- **README.md**: Should describe the plugin, its purpose, and basic usage
- **API Documentation**: Use TSDoc comments for public APIs
- **Component Documentation**: Document component props and usage

## Resources

- [Backstage Documentation](https://backstage.io/docs)
- [Backstage Plugin Development](https://backstage.io/docs/plugins)
- [Red Hat Developer Hub](https://developers.redhat.com/developer-hub)
- [Repository Contributing Guide](../../CONTRIBUTING.md)
- [Backstage Architecture Decisions](https://backstage.io/docs/architecture-decisions)

## Important Notes for Agents

1. **Always check existing patterns**: Look at similar components/plugins before creating new ones
2. **Follow the monorepo structure**: Understand workspace vs plugin-level configurations
3. **Respect API boundaries**: Don't break public APIs without proper versioning
4. **Test your changes**: Ensure tests pass and add tests for new functionality
5. **Create changesets**: Any change that affects versioning needs a changeset
6. **Update API reports**: When changing public APIs, regenerate API reports
7. **Use Backstage patterns**: Prefer Backstage components and patterns over custom implementations
8. **License compliance**: Always include the Apache 2.0 copyright header

## Getting Help

- Review the [CONTRIBUTING.md](../../CONTRIBUTING.md) for repository-specific guidelines
- Check [Backstage documentation](https://backstage.io/docs) for plugin development patterns
- Look at similar plugins in this repository for examples
- Consult the [Backstage community](https://github.com/backstage/backstage/discussions) for questions
