---
layout: home

hero:
  name: APIForge
  text: API Observability,\nDone Right.
  tagline: Understand your APIs. Detect drifts. Ship with confidence. Local-first, privacy-first, up and running in 5 minutes.
  actions:
    - theme: brand
      text: Quick Start
      link: /guide/getting-started
    - theme: alt
      text: View on GitHub
      link: https://github.com/APIForge-Organisation

features:
  - icon: 🔒
    title: Privacy-first by architecture
    details: The SDK never reads request bodies, headers, or tokens. Route parameters are captured as patterns only — never real values. In local mode, zero data leaves your machine.

  - icon: 💾
    title: Local-first by default
    details: Works completely offline. No account, no cloud configuration, no credit card. Just install and one line of code. Your data stays in a SQLite file on your server.

  - icon: ⚡
    title: Up and running in 5 minutes
    details: One middleware, zero mandatory config. Dashboard auto-starts on port 4242. P50/P90/P99 latency, error rates, Health Score — all visible immediately.

  - icon: 🧠
    title: Automatic insights
    details: Plain-language alerts generated from your traffic — no dashboards to configure. Anomaly detection, dead endpoint identification, before/after release comparison.

  - icon: ☁️
    title: Cloud mode — optional
    details: Send metrics to the APIForge SaaS instead of storing locally. One extra parameter, no infrastructure to manage. Your local mode setup works unchanged.

  - icon: 🟢
    title: Node.js SDK — apiforgejs
    details: Drop-in Express.js middleware. Requires Node.js ≥ 22.5. Install via npm.

  - icon: 🐍
    title: Python SDK — apiforgepy
    details: Drop-in FastAPI / Starlette middleware. Requires Python ≥ 3.11. Install via pip.
---
