# Release Tracking

Release tracking automatically compares your API's performance before and after each deployment, giving you a clear answer to: *"Did this deploy make things better or worse?"*

## Setup

Pass the current version as the `release` option:

```js
app.use(apiforge({
  mode: 'local',
  release: process.env.npm_package_version,
}))
```

Or hardcode it during the deploy process:

```js
app.use(apiforge({
  mode: 'local',
  release: 'v1.4.0',
}))
```

::: tip Automate with environment variables
Most CI/CD systems expose the version or git tag as an environment variable. Inject it at build time so it changes automatically on every deploy.
:::

## How it works

1. When the `release` value **changes** (new deploy detected), APIForge records a baseline snapshot of the last 24h of metrics per endpoint.
2. After **30 minutes** of post-deploy traffic, the engine compares new metrics against the baseline.
3. A `PERF` or `OK` insight is generated for each endpoint with enough traffic.

## What is compared

| Metric | Compared |
|---|---|
| P50 latency | Before vs after |
| P90 latency | Before vs after |
| P99 latency | Before vs after |
| Error rate (4xx + 5xx) | Before vs after |

## Example insights generated

```
✅ OK   v1.4.0 (deployed 3h ago) — No regression detected.
         Latency stable across 12 endpoints. Error rate unchanged.

⚠️ PERF  POST /checkout — P99 +38% after v1.4.0
         Before: 210ms · After: 290ms
         Consider reviewing changes to the checkout handler.

✅ OK   GET /products — P90 improved by 12% after v1.4.0
         Before: 85ms · After: 75ms
```

## Requirements

- The `release` value must change between deploys (same value = no new baseline)
- At least **100 requests** on an endpoint are needed for a statistically valid comparison
- The comparison window is **30 minutes** minimum post-deploy
