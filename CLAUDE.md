# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Weniger Songs UI is a React 19 + TypeScript web application showcasing songs by Dr. Brad Weniger. It's a single-page application with a responsive design (table for desktop, cards for mobile) powered by Apollo Client and Strapi GraphQL backend.

**Tech Stack:** React 19, TypeScript 7, Vite, Apollo Client, Ant Design, React Router 7, GraphQL Code Generator

## Common Commands

### Development

```bash
pnpm install          # Install dependencies (requires Node 20+, PNPM 9+)
pnpm start            # Start dev server (uses phase.dev for env variables)
```

### Code Quality

```bash
pnpm lint             # Lint TypeScript files in src/ with oxlint (config: .oxlintrc.json)
pnpm lint:fix         # Lint and auto-fix
pnpm prettier         # Format all files (check and write)
pnpm prettier:ci      # Format check only (for CI)
```

### GraphQL

```bash
pnpm generate         # Regenerate GraphQL types and hooks from schema
```

Run this after modifying `/src/graphql/song.graphql` to update `/src/graphql/index.tsx`

### Build

```bash
pnpm build            # Type-check (tsc) then production build with Vite, output in build/
pnpm type-check       # Type-check only
```

## Architecture

### State Management

- **Local UI state:** React `useState()` hooks for component state
- **Server state:** Apollo Client's in-memory cache for GraphQL data
- **No global state library** - the app is simple enough for local + Apollo state

### GraphQL Integration

- **Backend:** Strapi CMS at `http://localhost:5502` (proxied) with GraphQL endpoint at `/graphql`
- **Code generation:** GraphQL operations defined in `.graphql` files are auto-generated into TypeScript hooks
  - Source: `/src/graphql/song.graphql`
  - Output: `/src/graphql/index.tsx` (auto-generated, don't edit manually)
  - Config: `/codegen.yml`
- **Query pattern:** Uses lazy queries (`useGetSongsLazyQuery()`) for manual control over when data is fetched
- **Apollo setup:** Custom link pipeline strips `__typename` from variables to avoid schema conflicts

### Routing

- Single route at `/` using React Router 7
- Setup in `/src/App.tsx`
- Currently only the home page exists

### Responsive Design

- **Desktop (≥md breakpoint):** TableData component renders Ant Design table
- **Mobile (<md breakpoint):** CardData component renders card list with infinite scroll
- Uses Ant Design's `useBreakpoint()` hook to determine screen size
- Separate components optimize each experience rather than conditional rendering

### Component Structure

```
HomePage (src/pages/home/index.tsx)
├── Manages song data fetching via lazy GraphQL queries
├── Handles search, sort, and pagination state
├── Responds to screen size changes
└── Renders based on breakpoint:
    ├── TableData (desktop) - paginated table
    ├── CardData (mobile) - infinite scroll cards
    └── TableSettings (mobile) - sort/filter drawer
```

### Build Configuration

- **Vite** (`vite.config.ts`) with `@vitejs/plugin-react`; dev server on port 3000 proxies `/graphql` to `http://localhost:5502`
- **Env vars:** `envPrefix: 'REACT_APP_'` keeps the existing names; read them via `import.meta.env` (typed in `src/vite-env.d.ts`)
- **Output:** `build/` (what Netlify publishes)
- **Path aliases:** `@gql` → `./src/graphql/index.tsx` (`resolve.alias` in `vite.config.ts` for bundling, `tsconfig.paths.json` for types)
- **Type-checking:** Vite does not type-check; `pnpm build` runs `tsc` first
- **Linting:** separate from the build, via `pnpm lint` (oxlint)
- **Source maps:** Disabled in production builds

## Key Files

| File/Directory             | Purpose                                                              |
| -------------------------- | -------------------------------------------------------------------- |
| `src/apollo/index.ts`      | Apollo Client setup with HTTP link and cache config                  |
| `src/graphql/`             | GraphQL queries (`.graphql`) and generated types/hooks (`index.tsx`) |
| `src/pages/home/`          | Home page component and sub-components                               |
| `src/helpers/constants.ts` | App configuration (page size, sort defaults)                         |
| `codegen.yml`              | GraphQL code generator configuration                                 |
| `vite.config.ts`           | Vite config: React plugin, env prefix, `@gql` alias, dev proxy, output dir |
| `tsconfig.paths.json`      | TypeScript path alias configuration                                  |

## Development Notes

### GraphQL Workflow

1. Modify queries/fragments in `/src/graphql/song.graphql`
2. Run `pnpm generate` to regenerate types and hooks
3. Generated hooks are available at `@gql` (e.g., `import { useGetSongsLazyQuery } from '@gql'`)
4. Never manually edit `/src/graphql/index.tsx` - it's auto-generated and excluded from linting

### Environment Variables

- Managed via **Phase.dev** (recently migrated from Doppler)
- Variables loaded at runtime via `phase run` command
- Key variables:
  - `REACT_APP_SERVER_URL` - Backend API base URL
  - `REACT_APP_YOUTUBE_URL` - YouTube base URL for video links
  - `REACT_APP_VERSION` - App version (auto-injected from package.json)

### Git Hooks

- **pre-commit:** Runs prettier, oxlint, and sort-package-json on staged files
- **commit-msg:** Validates commit message format (commitlint)
- Configured via Husky + lint-staged

### Plan Documentation

- When creating plan markdown files, save them in the `plans/` folder
- This keeps architectural decisions and implementation plans organized and separate from code

### Data Flow Pattern

```
User interaction → HomePage state update → Lazy query execution →
Apollo Client → Strapi GraphQL → Apollo cache → Component re-render
```

### Unique Patterns

- **Lazy queries** provide manual control over data fetching (no automatic query on mount)
- **Centralized table settings** in HomePage manage sort, pagination, and search for both views
- **Fragment-based queries** ensure field consistency (`SongFragement`)
- **Omit typename link** strips `__typename` from variables to prevent backend conflicts
