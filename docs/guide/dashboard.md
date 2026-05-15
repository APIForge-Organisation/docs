# Local Dashboard

The local dashboard is a built-in web UI served automatically by the SDK on port 4242 (configurable).

```
http://localhost:4242
```

No installation, no separate server, no configuration needed.

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
| Route | Parameterized pattern — e.g. `GET /users/:id` |
| Requests | Total calls in the selected time range |
| P50 / P90 / P99 | Latency percentiles in milliseconds |
| Error rate | Percentage of 4xx + 5xx responses |
| Status | `OK`, `SLOW`, `DEGRADED`, or `DEAD` |

### Insights panel

Automatically generated alerts — no configuration required. See [Automatic Insights](/features/insights).

## Disabling the dashboard

Set `dashboardPort: 0` in your config:

```js
app.use(apiforge({ mode: 'local', dashboardPort: 0 }))
```

This is useful in production environments where you don't want to expose an extra port, or in test environments.

## Custom port

```js
app.use(apiforge({ mode: 'local', dashboardPort: 9090 }))
// Dashboard → http://localhost:9090
```

## Security note

The dashboard has no authentication in local mode. **Do not expose port 4242 to the public internet.** Use a firewall rule or SSH tunnel if you need to access it remotely:

```bash
ssh -L 4242:localhost:4242 user@your-server
# Then open http://localhost:4242 locally
```
