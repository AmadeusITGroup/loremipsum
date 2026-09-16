# Sample landing page sandbox

This small, generic site exercises the static-site mechanics needed before a real publication: token-based styling, hash navigation, Markdown discovery, responsive layout, CI, and a GitHub Pages artifact.

All visible content is fabricated placeholder text. It is intentionally not a source of facts, branding, project history, or production configuration.

## Local development

Install the exact dependencies from the lockfile, then use the development server or production preview:

- `npm ci`
- `npm run dev`
- `npm run build`
- `npm run preview`

The application has these hash routes:

- `#/` — landing page
- `#/context` — context page
- `#/notes` — Markdown note index
- `#/note/<slug>` — one Markdown note

To simulate a project-site build, set `BASE_PATH` to the repository path before building. The Pages workflow calculates this value from the repository name automatically.

## Validation

`npm run validate` runs placeholder-content checks, TypeScript, the Vite production build, and a high-severity npm audit. The CI workflow also generates an application SBOM and uploads it as an artifact.

## GitHub Pages test

The Pages workflow is included for a separate test repository. Before using it, create or select a repository intended only for this fixture, enable GitHub Pages with GitHub Actions as the source, and review the workflow permissions. No push, merge, remote setup, or publication is performed by creating this local sandbox.

## Structure

- `src/main.ts` — routes, rendering, and interactions
- `src/content.ts` — Markdown loading and sanitization
- `src/content/notes/` — fake notes
- `src/style.css` — theme and responsive layout
- `scripts/validate-content.mjs` — deterministic content guard
- `.github/workflows/` — generic CI, Pages, dependency, analysis, and scorecard workflows
