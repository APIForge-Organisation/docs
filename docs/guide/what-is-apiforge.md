# What is APIForge?

APIForge is a **behavioral intelligence and observability platform** specialized for backend APIs.

Unlike generic monitoring tools that display raw metrics, APIForge **understands how your APIs behave over time**: detecting performance drifts, correlating releases with incidents, and surfacing actionable insights automatically.

## The problem it solves

Most observability tools show you *what is happening* — a latency spike, an error rate. APIForge tells you *why and since when*.

| Problem | APIForge answer |
|---|---|
| "Did this deploy break something?" | Before/after release comparison, automatic |
| "Why is this endpoint slow?" | P50/P90/P99 per route, drift detection over 7–30 days |
| "Which endpoints can I safely remove?" | Dead endpoint detection (no traffic in N days) |
| "Is my API healthy right now?" | Health Score 0–100, computed continuously |

## Three core principles

### Privacy-first

Not a policy — an architecture constraint. The SDK is built so it is **technically impossible** to collect sensitive data, even if you wanted to.

What is captured: route pattern, HTTP method, status code, latency, timestamp.

What is never captured: request body, response body, headers, cookies, tokens, IP addresses, query parameter values, any user-identifying data.

### Local-first

APIForge works completely offline. No account required, no cloud configuration, no database to set up. All data is stored in a single SQLite file on your server.

The dashboard, the insights engine, the Health Score — everything runs in the same process as your application.

### Developer-first

Installation time under 5 minutes. One mandatory parameter (`mode: 'local'`). The dashboard auto-starts. Insights surface automatically.

## What APIForge is not

- **Not a logging tool** — it does not record logs, errors, or stack traces.
- **Not a general APM** — it does not instrument your database queries or internal function calls.
- **Not a clone of Datadog or Grafana** — it does not monitor infrastructure.

## Next steps

- [Quick Start](/guide/getting-started) — install and see your first metrics in under 5 minutes
- [Configuration](/guide/configuration) — all available options
- [Automatic Insights](/features/insights) — what APIForge detects and how
