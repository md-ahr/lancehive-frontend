# LanceHive Frontend

React 19 + TypeScript + Vite frontend for the LanceHive freelancer workspace platform.

## Agentic Workflow (Cursor)

- **[Cursor Agent Guide](./AGENTS.md)** — skills, rules, task workflow
- **[Development Plan](./docs/development-plan.md)** — tasks with **Done when** acceptance criteria
- **[Standards](./docs/standards/)** — DoD, testing, errors, naming, security, conventions, **commits**
- **[Pages & Routes](./docs/pages-and-routes.md)** — route map and component inventory
- **[Agentic Workflow](./docs/agentic-workflow.md)** — 7-step build process + audit
- **[API User Journey](./docs/user-journey-api.md)** — API integration guide
- **Cursor Rules** — `.cursor/rules/` (auto-loaded)
- **Cursor Skills** — `.cursor/skills/` (invoke per task type)

## Development

```bash
pnpm install
cp .env.example .env
pnpm dev
```

---

## React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.
You can also try [the experimental native React Compiler support in plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md#rust-react-compiler) by using `compiler: true` in the plugin options instead of using the Babel plugin.

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
