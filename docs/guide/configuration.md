# Configuration

## Node.js

All options are passed to the `apiforge()` factory. All options are optional — calling `apiforge()` with no arguments starts local mode with defaults.

```js
// Local mode (default)
app.use(apiforge({
  dbPath:        '.apiforge.db',
  dashboardPort: 4242,
  env:           'production',
  release:       'v2.0.0',
  service:       'user-service',
  sampling:      1.0,
  ignorePaths:   ['/favicon.ico', '/health'],
}))

// Cloud mode
app.use(apiforge({
  cloudUrl:    'https://api.apiforge.fr',
  apiKey:      'af_your_key',
  env:         'production',
  release:     'v2.0.0',
  service:     'user-service',
  sampling:    1.0,
  ignorePaths: ['/favicon.ico', '/health'],
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
    api_key="af_your_key",
    env="production",
    release="v2.0.0",
    service="user-service",
)
```

::: tip Python naming
Python uses `snake_case` for option names. All other semantics are identical to the Node.js SDK.
:::

## PHP (Laravel)

Publish the config file and set values explicitly — the SDK does not read environment variables:

```bash
php artisan vendor:publish --tag=apiforge-config
```

```php
// config/apiforge.php
return [
    'cloud_url' => null,               // set to 'https://api.apiforge.fr' for cloud mode
    'api_key'   => null,               // set to 'af_...' for cloud mode
    'env'       => 'production',
    'release'   => 'v2.0.0',
    'service'   => 'user-service',
    'sampling'  => 1.0,
    'dashboard_enabled' => true,
    'dashboard_prefix'  => '_apiforge',
    'ignore_paths' => ['/favicon.ico'],
];
```

::: tip PHP dashboard
The local dashboard is served at `/_apiforge` via Laravel routing, not on a separate port.
:::

---

## Options reference

### `cloudUrl` / `cloud_url` / `cloud_url` (PHP config key)

- **Type:** `string | null` — **Default:** `null`

Base URL of the APIForge SaaS API. Required for cloud mode, along with `apiKey`. When set, local SQLite storage and the embedded dashboard are disabled.

---

### `apiKey` / `api_key` / `api_key` (PHP config key)

- **Type:** `string | null` — **Default:** `null`

Project API key, starting with `af_`. Must be provided together with `cloudUrl`.

::: warning Keep your API key secret
Never commit your API key to source control. Use your secrets manager or a `.env` file excluded from git.
:::

---

### `dbPath` / `db_path`

- **Type:** `string` — **Default:** `'.apiforge.db'` (Node.js / Python) · `storage_path('.apiforge.db')` (PHP)

Path to the SQLite database file (local mode only). Created automatically if it does not exist.

---

### `dashboardPort` / `dashboard_port`

- **Type:** `number / int` — **Default:** `4242`
- **PHP equivalent:** `dashboard_enabled` + `dashboard_prefix` config keys

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

```php
// PHP — config/apiforge.php
'dashboard_enabled' => false,           // disabled
'dashboard_prefix'  => 'debug/api',     // custom prefix
```

---

### `env`

- **Type:** `string` — **Default:** `'production'`

Environment label stored with each metric (e.g. `'production'`, `'staging'`). Set explicitly — no environment variable is read automatically.

---

### `release`

- **Type:** `string | null` — **Default:** `null`

Version tag for the current deployment. When provided, APIForge creates a before/after comparison on every deploy.

```js
// Node.js — set from your build system
apiforge({ release: 'v1.4.0' })
```

```python
# Python
ApiForgeMiddleware(release="v1.4.0")
```

```php
// PHP — config/apiforge.php
'release' => 'v1.4.0',
```

See [Release Tracking](/features/release-tracking).

---

### `service`

- **Type:** `string` — **Default:** `'default'`

Service name. Used to group routes in the dashboard across multiple API processes.

---

### `sampling`

- **Type:** `number / float` (0.0 – 1.0) — **Default:** `1.0`

Fraction of requests to instrument. Reduce under very high traffic to lower overhead.

---

### `ignorePaths` / `ignore_paths`

- **Type:** `string[]` — **Default:** `['/favicon.ico']`

Paths excluded from instrumentation. Exact matches only.

---

## Flush interval

Metrics are aggregated in memory (Node.js, Python) or in a local temp file (PHP) and flushed every **60 seconds**. This value is fixed and not configurable — it ensures a consistent, predictable load on the ingest API.

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

### PHP

The middleware flushes at the end of every request. No teardown needed for PHP-FPM.
