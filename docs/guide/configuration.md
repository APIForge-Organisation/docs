# Configuration

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

## Options

### `mode`

- **Type:** `'local'`
- **Required:** yes
- **Default:** —

The storage and transport mode. Only `'local'` (SQLite) is available in v0.x. SaaS mode is planned for v1.0.

---

### `dbPath`

- **Type:** `string`
- **Default:** `'.apiforge.db'`

Path to the SQLite database file. The file is created automatically if it does not exist.

```js
apiforge({ mode: 'local', dbPath: '/var/data/apiforge.db' })
```

---

### `dashboardPort`

- **Type:** `number`
- **Default:** `4242`

Port for the local dashboard HTTP server. Set to `0` to disable the dashboard entirely.

```js
apiforge({ mode: 'local', dashboardPort: 0 })  // no dashboard
apiforge({ mode: 'local', dashboardPort: 9000 }) // custom port
```

---

### `flushInterval`

- **Type:** `number` (milliseconds)
- **Default:** `60000` (60 seconds)

How often the in-memory buffer is flushed to SQLite. Lower values give more granular data at the cost of more frequent writes.

::: warning Minimum recommended value
Values below `5000` (5s) may impact performance under high traffic. The default of 60s is appropriate for most applications.
:::

---

### `env`

- **Type:** `string`
- **Default:** `process.env.NODE_ENV ?? 'production'`

Environment label stored with each metric. Useful when running multiple environments pointing to the same database.

```js
apiforge({ mode: 'local', env: process.env.NODE_ENV })
```

---

### `release`

- **Type:** `string | null`
- **Default:** `process.env.APP_VERSION ?? null`

Version tag for the current deployment. When provided, APIForge creates a comparison point in the timeline and generates before/after insights after each deploy.

```js
apiforge({ mode: 'local', release: process.env.npm_package_version })
```

See [Release Tracking](/features/release-tracking) for details.

---

### `service`

- **Type:** `string`
- **Default:** `'default'`

Service name, used to distinguish multiple APIs sharing the same database.

```js
apiforge({ mode: 'local', service: 'payment-api' })
```

---

### `sampling`

- **Type:** `number` (0.0 – 1.0)
- **Default:** `1.0`

Fraction of requests to instrument. Set below `1.0` under very high traffic to reduce overhead.

```js
apiforge({ mode: 'local', sampling: 0.1 }) // instrument 10% of requests
```

---

### `ignorePaths`

- **Type:** `string[]`
- **Default:** `['/favicon.ico']`

Paths to exclude from instrumentation. Supports exact matches.

```js
apiforge({
  mode: 'local',
  ignorePaths: ['/favicon.ico', '/health', '/ready', '/metrics'],
})
```

## Graceful shutdown

The middleware exposes a `shutdown()` method for clean teardown (flushes the buffer and closes the SQLite connection):

```js
const mw = apiforge({ mode: 'local' })
app.use(mw)

process.on('SIGTERM', () => {
  mw.shutdown()
  server.close()
})
```
