# Local Dashboard

The local dashboard is a built-in web UI served automatically by the SDK. It shows the same interface across all SDKs.

::: info Cloud mode
In cloud mode, the local dashboard is not started. Metrics are visualized in the APIForge cloud dashboard instead. See [Cloud Mode](/guide/cloud-mode).
:::

## Access

::: code-group

```txt [Node.js / Python]
http://localhost:4242
```

```txt [PHP / Laravel]
http://localhost:8000/_apiforge
```

:::

**Node.js and Python** start a dedicated HTTP server on port 4242 automatically in the background when your app starts.

**PHP / Laravel** serves the dashboard via routes registered at `/_apiforge` on your app's own port — no separate process is needed.

## Panels

### Health Score

A single **0–100 score** summarizing the global health of your API, computed from four dimensions:

| Dimension | Weight |
|---|---|
| Availability (2xx rate, last 24h) | 30% |
| Performance (P90 vs historical baseline) | 30% |
| Stability (absence of anomalies, last 7 days) | 25% |
| Quality (proportion of active, healthy endpoints) | 15% |

A score above **85** is healthy. Below **60** indicates a problem that needs attention.

### Latency chart

Time series of P50, P90 and P99 latency per endpoint. Click any route in the table to focus the chart on that route.

Available time ranges: **24h / 7d / 30d**.

### Routes table

All instrumented routes, sorted by request volume. Columns:

| Column | Description |
|---|---|
| Route | Parameterized pattern — e.g. `GET /users/:id` or `GET /users/{user_id}` |
| Requests | Total calls in the selected time range |
| P50 / P90 / P99 | Latency percentiles in milliseconds |
| Avg size | Average response body size in bytes (`Content-Length`), when available |
| Error rate | Percentage of 4xx + 5xx responses |
| Status | `OK`, `SLOW`, `DEGRADED`, or `DEAD` |

### Insights panel

Automatically generated alerts — no configuration required. Filter chips let you narrow the list to a specific insight type: **ANOMALY**, **DRIFT**, **DEAD**, **PERF**, or **UNTRACKED**.

See [Automatic Insights](/features/insights).

## Disabling the dashboard

::: code-group

```js [Node.js]
app.use(apiforge({ dashboardPort: 0 }))
```

```python [Python]
app.add_middleware(ApiForgeMiddleware, dashboard_port=0)
```

```bash [PHP / Laravel (.env)]
APIFORGE_DASHBOARD=false
```

:::

## Custom port / prefix

::: code-group

```js [Node.js]
app.use(apiforge({ dashboardPort: 9090 }))
// Dashboard → http://localhost:9090
```

```python [Python]
app.add_middleware(ApiForgeMiddleware, dashboard_port=9090)
# Dashboard → http://localhost:9090
```

```bash [PHP / Laravel (.env)]
APIFORGE_DASHBOARD_PREFIX=debug/apiforge
# Dashboard → http://localhost:8000/debug/apiforge
```

:::

## Security note

The dashboard has no authentication in local mode. **Do not expose port 4242 (or the `/_apiforge` prefix) to the public internet.** Use a firewall rule or SSH tunnel if you need to access it remotely:

```bash
# Node.js / Python
ssh -L 4242:localhost:4242 user@your-server
# Then open http://localhost:4242

# PHP / Laravel — protect the route in production via middleware
```
