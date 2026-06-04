# Configuration

## Node.js

All options are passed to the `apiforge()` factory. All options are optional — calling `apiforge()` with no arguments starts local mode with defaults.

```js
// Local mode (default)
app.use(apiforge({
  dbPath:        '.apiforge.db',
  dashboardPort: 4242,
  flushInterval: 60_000,
  env:           'production',
  release:       'v2.0.0',
  service:       'user-service',
  sampling:      1.0,
  ignorePaths:   ['/favicon.ico', '/health'],
}))

// Cloud mode
app.use(apiforge({
  cloudUrl:      'https://api.apiforge.fr',
  apiKey:        process.env.APIFORGE_API_KEY,
  flushInterval: 60_000,
  env:           'production',
  release:       'v2.0.0',
  service:       'user-service',
  sampling:      1.0,
  ignorePaths:   ['/favicon.ico', '/health'],
}))
```

## Python

All options are passed to `ApiForgeMiddleware`. All options are optional.

```python
# Local mode (default)
app.add_middleware(
    ApiForgeMiddleware,
    db_path=".apiforge.db",
    dashboard_port=4242,
    flush_interval=60_000,   # ms
    env="production",
    release="v2.0.0",
    service="user-service",
    sampling=1.0,
    ignore_paths=["/favicon.ico", "/health"],
)

# Cloud mode
app.add_middleware(
    ApiForgeMiddleware,
    cloud_url="https://api.apiforge.fr",
    api_key=os.environ["APIFORGE_API_KEY"],
    flush_interval=60_000,
    env="production",
    release="v2.0.0",
    service="user-service",
)
```

::: tip Python naming
Python uses `snake_case` for option names. All other semantics are identical to the Node.js SDK.
:::

## PHP (Laravel)

Configure via environment variables or by publishing the config file:

```bash
php artisan vendor:publish --tag=apiforge-config
```

| Variable | Default | Description |
|---|---|---|
| `APIFORGE_CLOUD_URL` | — | Cloud mode: SaaS API base URL |
| `APIFORGE_API_KEY` | — | Cloud mode: project API key (`af_…`) |
| `APIFORGE_ENV` | `APP_ENV` | Environment label |
| `APIFORGE_RELEASE` | `APP_VERSION` | Release/version tag |
| `APIFORGE_SERVICE` | `APP_NAME` | Service name |
| `APIFORGE_SAMPLING` | `1.0` | Sample rate 0.0–1.0 |
| `APIFORGE_FLUSH_INTERVAL` | `60` | Cloud mode: seconds between ingest flushes |
| `APIFORGE_DASHBOARD` | `true` | Enable/disable the local dashboard routes |
| `APIFORGE_DASHBOARD_PREFIX` | `_apiforge` | URL prefix for the local dashboard |

::: tip PHP-specific differences
- `APIFORGE_FLUSH_INTERVAL` is in **seconds** (not milliseconds like Node.js/Python)
- The local dashboard is served at `/_apiforge` via Laravel routing, not on a separate port
:::

---

## Options reference

### `cloudUrl` / `cloud_url` / `APIFORGE_CLOUD_URL`

- **Type:** `string | null` — **Default:** `null`

Base URL of the APIForge SaaS API. Required for cloud mode, along with `apiKey`. When set, local SQLite storage and the embedded dashboard are disabled.

---

### `apiKey` / `api_key` / `APIFORGE_API_KEY`

- **Type:** `string | null` — **Default:** `null`

Project API key, starting with `af_`. Must be provided together with `cloudUrl`.

::: warning Keep your API key secret
Never commit your API key to source control. Use an environment variable.
:::

---

### `dbPath` / `db_path`

- **Type:** `string` — **Default:** `'.apiforge.db'` (Node.js / Python) · `storage_path('.apiforge.db')` (PHP)

Path to the SQLite database file (local mode only). Created automatically if it does not exist.

---

### `dashboardPort` / `dashboard_port`

- **Type:** `number / int` — **Default:** `4242`
- **PHP equivalent:** `APIFORGE_DASHBOARD` + `APIFORGE_DASHBOARD_PREFIX`

Port for the local dashboard HTTP server. Set to `0` to disable.

```js
// Node.js
apiforge({ dashboardPort: 0 })    // disabled
apiforge({ dashboardPort: 9000 }) // custom port
```

```python
# Python
ApiForgeMiddleware(dashboard_port=0)     # disabled
ApiForgeMiddleware(dashboard_port=9000)  # custom port
```

```bash
# PHP — disable or change prefix
APIFORGE_DASHBOARD=false
APIFORGE_DASHBOARD_PREFIX=my-debug
```

---

### `flushInterval` / `flush_interval` / `APIFORGE_FLUSH_INTERVAL`

- **Node.js / Python:** milliseconds — **Default:** `60000`
- **PHP:** seconds — **Default:** `60`

How often the buffer is flushed (to SQLite in local mode, to the SaaS API in cloud mode).

::: warning Minimum recommended value
Values below 5 seconds may impact performance under high traffic.
:::

---

### `env` / `APIFORGE_ENV`

- **Default (Node.js):** `process.env.NODE_ENV ?? 'production'`
- **Default (Python):** `os.environ.get("ENV", "production")`
- **Default (PHP):** `APP_ENV`

Environment label stored with each metric (e.g. `'production'`, `'staging'`).

---

### `release` / `APIFORGE_RELEASE`

- **Type:** `string | null` — **Default:** `null`

Version tag for the current deployment. When provided, APIForge creates a before/after comparison on every deploy.

```js
apiforge({ release: process.env.npm_package_version })
```

```python
ApiForgeMiddleware(release=os.environ.get("RELEASE"))
```

```bash
# PHP
APIFORGE_RELEASE=v1.4.0
```

See [Release Tracking](/features/release-tracking).

---

### `service` / `APIFORGE_SERVICE`

- **Type:** `string` — **Default:** `'default'`

Service name. Used to group routes in the dashboard across multiple API processes.

---

### `sampling` / `APIFORGE_SAMPLING`

- **Type:** `number / float` (0.0 – 1.0) — **Default:** `1.0`

Fraction of requests to instrument. Reduce under very high traffic to lower overhead.

---

### `ignorePaths` / `ignore_paths` / `APIFORGE_IGNORE_PATHS`

- **Type:** `string[]` — **Default:** `['/favicon.ico']`

Paths excluded from instrumentation. Exact matches only.

---

## Graceful shutdown

### Node.js

```js
const mw = apiforge()
app.use(mw)

process.on('SIGTERM', () => {
  mw.shutdown() // flushes buffer, closes dashboard, closes SQLite
  server.close()
})
```

### Python

Cleanup is registered automatically via `atexit` — no action needed for standard deployments.

```python
import atexit
# Already called internally: atexit.register(middleware._cleanup)
```

### PHP

The middleware flushes at the end of every request. No teardown needed for PHP-FPM.
