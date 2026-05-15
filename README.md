# APIForge — Documentation

**Source of the [APIForge documentation site](https://apiforge-organisation.github.io/docs/).**

[![Deploy](https://img.shields.io/github/actions/workflow/status/APIForge-Organisation/docs/deploy.yml?branch=main&label=Deploy)](https://github.com/APIForge-Organisation/docs/actions)
[![Live](https://img.shields.io/badge/docs-live-0066FF)](https://apiforge-organisation.github.io/docs/)

---

## What's in here

| Path | Content |
|---|---|
| `docs/index.md` | Homepage |
| `docs/guide/` | Getting started, configuration, dashboard |
| `docs/features/` | Health Score, Insights, Release Tracking |
| `docs/.vitepress/config.js` | Site navigation and theme config |

Built with [VitePress](https://vitepress.dev). Deployed automatically to GitHub Pages on every push to `main`.

## Local development

```bash
npm install
npm run dev
```

Then open **http://localhost:5173/docs/**.

## Deployment

Any push to `main` triggers the [deploy workflow](.github/workflows/deploy.yml), which builds the site and publishes it to GitHub Pages. No manual step required.

---

**→ [apiforge-organisation.github.io/docs](https://apiforge-organisation.github.io/docs/)**
