# Release Tracking

Release tracking automatically compares your API's performance before and after each deployment, giving you a clear answer to: *"Did this deploy make things better or worse?"*

## Setup

Pass the current version as the `release` option:

::: code-group

```js [Node.js]
app.use(apiforge({ release: 'v1.4.0' }))
```

```python [Python]
app.add_middleware(ApiForgeMiddleware, release="v1.4.0")
```

```bash [PHP / Laravel (.env)]
APIFORGE_RELEASE=v1.4.0
# or use APP_VERSION which is read by default
```

:::

Or hardcode it during the deploy process:

::: code-group

```js [Node.js]
app.use(apiforge({ release: 'v1.4.0' }))
```

```python [Python]
app.add_middleware(ApiForgeMiddleware, release="v1.4.0")
```

```php [PHP / Laravel]
// config/apiforge.php
'release' => env('APIFORGE_RELEASE', config('app.version')),
```

:::

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
| P90 latency | Before vs after |
| Error rate (4xx + 5xx) | Before vs after |

## Example insights generated

```
✅ OK   v1.4.0 (deployed 3h ago) — No regression detected.
         Latency stable across 12 endpoints. Error rate unchanged.

⚠️ PERF  POST /checkout — P90 +38% after v1.4.0
         Before: 210ms · After: 290ms
         Consider reviewing changes to the checkout handler.

✅ OK   GET /products — P90 improved by 12% after v1.4.0
         Before: 85ms · After: 75ms
```

## Requirements

- The `release` value must change between deploys (same value = no new baseline)
- At least **100 requests** on an endpoint are needed for a statistically valid comparison
- The comparison window is **30 minutes** minimum post-deploy
