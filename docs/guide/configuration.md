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
Python uses `snake_case` for option names. All other semantics — including units — are identical to the Node.js SDK.
:::

---

## Options

### `cloudUrl` / `cloud_url`

- **Type:** `string | null`
- **Default:** `null`

Base URL of the APIForge SaaS API. Required for cloud mode, along with `apiKey`. When set, local SQLite storage and the embedded dashboard are disabled.

---

### `apiKey` / `api_key`

- **Type:** `string | null`
- **Default:** `null`

Project API key, starting with `af_`. Generated from the APIForge dashboard when you create a project. Must be provided together with `cloudUrl`.

::: warning Keep your API key secret
Never commit your API key to source control. Use an environment variable: `process.env.APIFORGE_API_KEY` (Node.js) or `os.environ["APIFORGE_API_KEY"]` (Python).
:::

---

### `dbPath` / `db_path`

- **Type:** `string`
- **Default:** `'.apiforge.db'`

Path to the SQLite database file (local mode only). Created automatically if it does not exist.

---

### `dashboardPort` / `dashboard_port`

- **Type:** `number` / `int`
- **Default:** `4242`

Port for the local dashboard HTTP server (local mode only). Set to `0` to disable the dashboard entirely.

```js
// Node.js
apiforge({ dashboardPort: 0 })    // no dashboard
apiforge({ dashboardPort: 9000 }) // custom port
```

```python
# Python
ApiForgeMiddleware(dashboard_port=0)     # no dashboard
ApiForgeMiddleware(dashboard_port=9000)  # custom port
```

---

### `flushInterval` / `flush_interval`

- **Type:** `number` / `int` (milliseconds) — Default: `60000`

How often the in-memory buffer is flushed (to SQLite in local mode, to the SaaS API in cloud mode).

::: warning Minimum recommended value
Values below 5 seconds may impact performance under high traffic. The default of 60s is appropriate for most applications.
:::

---

### `env`

- **Type:** `string`
- **Default (Node.js):** `process.env.NODE_ENV ?? 'production'`
- **Default (Python):** `os.environ.get("ENV", "production")`

Environment label stored with each metric (e.g. `'production'`, `'staging'`).

---

### `release`

- **Type:** `string | null`
- **Default:** `null`

Version tag for the current deployment. When provided, APIForge creates a comparison point in the timeline and generates before/after insights after each deploy.

```js
// Node.js
apiforge({ release: process.env.npm_package_version })
```

```python
# Python
ApiForgeMiddleware(release=os.environ.get("RELEASE"))
```

See [Release Tracking](/features/release-tracking) for details.

---

### `service`

- **Type:** `string`
- **Default:** `'default'`

Service name. In local mode, used to distinguish multiple APIs sharing the same database. In cloud mode, used to group routes in the dashboard.

---

### `sampling`

- **Type:** `number / float` (0.0 – 1.0)
- **Default:** `1.0`

Fraction of requests to instrument. Set below `1.0` under very high traffic to reduce overhead.

---

### `ignorePaths` / `ignore_paths`

- **Type:** `string[]` / `list[str]`
- **Default:** `['/favicon.ico']`

Paths to exclude from instrumentation. Supports exact matches.

---

## Graceful shutdown

### Node.js

```js
const mw = apiforge()
app.use(mw)

process.on('SIGTERM', () => {
  mw.shutdown()
  server.close()
})
```

### Python

```python
import atexit

mw = ApiForgeMiddleware(app)

atexit.register(mw.shutdown)
```
