# Cloud Mode

Cloud mode sends your metrics to the APIForge SaaS instead of storing them locally. The local SQLite database and the embedded dashboard are not started — everything is handled on the cloud side.

## When to use cloud mode

| | Local mode | Cloud mode |
|---|---|---|
| Setup | Zero config | Requires an API key |
| Data storage | SQLite on your server | APIForge SaaS |
| Dashboard | Embedded (port 4242 / `/_apiforge`) | Cloud dashboard |
| Multi-service | One DB per machine | Unified across all services |
| Internet required | No | Yes |

Use **local mode** during development or when you want full data ownership.
Use **cloud mode** in production when you want a unified view across multiple services and deployments.

## Setup

### 1. Create a project

Sign in to the APIForge dashboard and create a project. You will receive an API key starting with `af_`.

::: warning
The API key is shown only once at creation time. Store it immediately in your secrets manager or environment variables.
:::

### 2. Add the middleware

::: code-group

```js [Node.js]
const { apiforge } = require('apiforgejs')

app.use(apiforge({
  cloudUrl: 'https://api.apiforge.fr',
  apiKey:   process.env.APIFORGE_API_KEY,
  service:  'my-api',
  env:      process.env.NODE_ENV,
  release:  process.env.npm_package_version,
}))
```

```python [Python]
import os
from apiforgepy import ApiForgeMiddleware

app.add_middleware(
    ApiForgeMiddleware,
    cloud_url=os.environ["APIFORGE_CLOUD_URL"],
    api_key=os.environ["APIFORGE_API_KEY"],
    service="my-api",
    env=os.environ.get("ENV", "production"),
    release=os.environ.get("RELEASE"),
)
```

```php [PHP / Laravel]
// .env
// APIFORGE_CLOUD_URL=https://api.apiforge.fr
// APIFORGE_API_KEY=af_...
// APIFORGE_SERVICE=my-api

// bootstrap/app.php — no code change vs local mode
->withMiddleware(function (Middleware $middleware) {
    $middleware->append(\ApiForge\Laravel\ApiForgeMiddleware::class);
})
```

:::

### 3. Set environment variables

```bash
APIFORGE_CLOUD_URL=https://api.apiforge.fr
APIFORGE_API_KEY=af_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## How it works

1. The SDK intercepts each request and records route, method, status code, and latency.
2. Every `flushInterval` (default: 60 s), the buffer is aggregated into per-route statistics and sent to `POST /ingest` on the SaaS API.
3. The SaaS stores the metrics in TimescaleDB and makes them available through the cloud dashboard.

::: info PHP buffering
PHP does not have a long-running process, so the SDK uses a file-based buffer (`/tmp/apiforgephp_*.jsonl`). Events accumulate per request and are flushed on the first request after `APIFORGE_FLUSH_INTERVAL` seconds.
:::

## Circuit breaker

If the SaaS API is unreachable, the SDK automatically backs off:

- After **5 consecutive failures**, the transport pauses for **60 seconds**.
- During the pause, flush calls are silently skipped — your application is never blocked.
- After the pause, the SDK resumes sending normally.

A warning is logged when the circuit opens:

```
[apiforgejs]  Cloud flush failures — pausing for 60s. Error: ...
[apiforgepy]  Cloud flush failures — pausing for 60s. Error: ...
[apiforgephp] Cloud flush error: HTTP 503 — ...
[apiforgephp] Circuit open — pausing for 60s.
```

## Rotating an API key

If your API key is compromised, rotate it from the dashboard (`Project settings → Rotate key`). The old key is invalidated immediately. Update the environment variable and redeploy.

## Security

- API keys are stored as HMAC-SHA256 hashes server-side — the raw key is never persisted.
- All traffic between the SDK and the SaaS is encrypted over HTTPS.
- The SDK never reads request bodies, headers, cookies, or query parameter values regardless of mode.
