# Agent guidance for the sample landing page sandbox

This repository is a disposable, generic fixture for testing a static site before real material is introduced. Keep it boring, deterministic, and safe to publish.

## Safety boundaries

- Use fake placeholder copy only. Do not add real people, private URLs, credentials, internal metrics, or unreleased material.
- Keep this fixture independent from any source repository. Do not copy branded assets, evidence captures, presentations, or local working files into it.
- Never put secrets in source, workflow arguments, logs, fixtures, or screenshots. Use environment-based authentication when a test genuinely needs it.
- Do not push, merge, enable Pages, or publish from a local checkout without an explicit decision to use a separate test repository.
- Treat `dist/` and `node_modules/` as generated files. Recreate them with npm and Vite instead of editing them.

## Architecture

- Keep the framework-free Vite, TypeScript, Markdown, and CSS stack.
- `src/main.ts` owns hash routing, page rendering, and small interactions.
- `src/content.ts` discovers and sanitizes Markdown notes.
- `src/content/notes/*.md` contains fake content used to exercise the content pipeline.
- `src/style.css` owns the token-based visual system and responsive layout.
- `vite.config.ts` reads `BASE_PATH` so project-site and root-site builds can be tested.
- Keep hash routes so GitHub Pages does not need server rewrites.

## Validation

Run the smallest relevant check while iterating, then finish with:

- `npm run validate`
- `git diff --check`
- a local preview check for Home, Context, Notes, and one note route
- keyboard, narrow viewport, overflow, and browser-console checks for visible changes

A passing local build proves compilation and packaging only. It does not prove that a remote repository has Pages enabled or that a workflow has published an artifact.

## Workflow rules

- Keep GitHub Actions pinned to immutable commit SHAs.
- Use least-privileged permissions and `persist-credentials: false` for checkout steps.
- Keep CI and Pages workflows manual or repository-event driven; do not add hidden network collection or publication steps.
- Do not replace a pinned action SHA with a mutable tag for convenience.
