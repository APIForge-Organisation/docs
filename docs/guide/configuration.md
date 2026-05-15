# Configuration

## Node.js

All options are passed to the `apiforge()` factory. Every option is optional except `mode`.

```js
app.use(apiforge({
  mode:          'local',
  dbPath:        '.apiforge.db',
  dashboardPort: 4242,
  flushInterval: 60_000,
  env:           'production',
  release:       'v1.4.0',
  service:       'user-service',
  sampling:      1.0,
  ignorePaths:   ['/favicon.ico', '/health'],
}))
```

## Python

All options are passed to `ApiForgeMiddleware`. Every option is optional except `mode`.

```python
app.add_middleware(
    ApiForgeMiddleware,
    mode="local",
    db_path=".apiforge.db",
    dashboard_port=4242,
    flush_interval=60_000,   # ms
    env="production",
    release="v1.4.0",
    service="user-service",
    sampling=1.0,
    ignore_paths=["/favicon.ico", "/health"],
)
```

::: tip Python naming
Python uses `snake_case` for option names. All other semantics — including units — are identical to the Node.js SDK.
:::

---

## Options

### `mode` / `mode`

- **Type:** `'local'`
- **Required:** yes

The storage and transport mode. Only `'local'` (SQLite) is available. SaaS mode is planned for a future version.

---

### `dbPath` / `db_path`

- **Type:** `string`
- **Default:** `'.apiforge.db'`

Path to the SQLite database file. Created automatically if it does not exist.

---

### `dashboardPort` / `dashboard_port`

- **Type:** `number` / `int`
- **Default:** `4242`

Port for the local dashboard HTTP server. Set to `0` to disable the dashboard entirely.

```js
// Node.js
apiforge({ mode: 'local', dashboardPort: 0 })    // no dashboard
apiforge({ mode: 'local', dashboardPort: 9000 })  // custom port
```

```python
# Python
ApiForgeMiddleware(mode="local", dashboard_port=0)     # no dashboard
ApiForgeMiddleware(mode="local", dashboard_port=9000)  # custom port
```

---

### `flushInterval` / `flush_interval`

- **Type:** `number` / `int` (milliseconds) — Default: `60000`

How often the in-memory buffer is flushed to SQLite. Both SDKs use **milliseconds**.

::: warning Minimum recommended value
Values below 5 seconds may impact performance under high traffic. The default of 60s is appropriate for most applications.
:::

---

### `env`

- **Type:** `string`
- **Default (Node.js):** `process.env.NODE_ENV ?? 'production'`
- **Default (Python):** `'production'`

Environment label stored with each metric.

---

### `release`

- **Type:** `string | null`
- **Default:** `null`

Version tag for the current deployment. When provided, APIForge creates a comparison point in the timeline and generates before/after insights after each deploy.

```js
// Node.js
apiforge({ mode: 'local', release: process.env.npm_package_version })
```

```python
# Python
import os
ApiForgeMiddleware(mode="local", release=os.environ.get("RELEASE"))
```

See [Release Tracking](/features/release-tracking) for details.

---

### `service`

- **Type:** `string`
- **Default:** `'default'`

Service name, used to distinguish multiple APIs sharing the same database.

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
const mw = apiforge({ mode: 'local' })
app.use(mw)

process.on('SIGTERM', () => {
  mw.shutdown()
  server.close()
})
```

### Python

```python
import atexit

mw = ApiForgeMiddleware(mode="local")
app.add_middleware(mw)

atexit.register(mw.shutdown)
```
