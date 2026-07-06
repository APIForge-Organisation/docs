# API Reference

This page documents the HTTP API exposed by the **local dashboard** embedded in every SDK — the same API the bundled dashboard UI calls to render charts and insights. It is useful if you want to pull metrics into your own tooling instead of (or alongside) the embedded UI.

::: tip Not the Cloud ingest API
This is the read-only API served by each SDK's own local dashboard process. It has nothing to do with the SaaS ingest endpoint used in [Cloud Mode](/guide/cloud-mode) — cloud mode disables the local dashboard entirely.
:::

## Base URL

| SDK | Base URL | Notes |
|---|---|---|
| Node.js | `http://127.0.0.1:<dashboardPort>` | Default port `4242`. Bound to loopback only — not reachable from other machines. |
| Python | `http://127.0.0.1:<dashboard_port>` | Default port `4242`. Bound to loopback only. |
| PHP (Laravel) | `https://your-app.test/<dashboard_prefix>` | Default prefix `_apiforge`. Served on the same Laravel app/port — reachable by anyone who can reach your app, unless you restrict the route yourself (e.g. behind auth middleware or your local-only environment). |

There is no authentication on these endpoints in Node.js/Python (they only listen on loopback, so this is not a network-exposed risk by default). On PHP, since the dashboard rides on your existing Laravel routes, restrict access yourself if your app is reachable beyond your own machine (e.g. gate the route group behind `auth` middleware, or disable it in production via `dashboard_enabled => false`).

## Endpoints

### `GET /`

Serves the dashboard UI (single HTML page, assets inlined or self-hosted — see [Local Dashboard](/guide/dashboard)).

### `GET /api/summary`

Top-level numbers shown on the dashboard's overview screen: health score, last-24h call volume/error rate/latency, route counts, and the full current insights list.

```json
{
  "health_score": 87,
  "calls_24h": 48213,
  "error_rate_24h": 0.42,
  "avg_p90_24h": 134.7,
  "avg_p99_24h": 310.2,
  "active_routes": 12,
  "total_routes": 15,
  "insights_count": 2,
  "insights": [ /* Insight[], see below */ ]
}
```

| Field | Type | Notes |
|---|---|---|
| `health_score` | `number \| null` | 0–100. `null` when there has been no traffic at all. See [Health Score](/features/health-score). |
| `calls_24h` | `number` | Total requests in the last 24h (excludes ghost/untracked traffic accounting — see `is_ghost` under `/api/routes`). |
| `error_rate_24h` | `number` | Percentage (0–100), 2 decimal places. `(4xx + 5xx) / total * 100`. |
| `avg_p90_24h` / `avg_p99_24h` | `number \| null` | Average P90/P99 latency in ms across all routes over the last 24h. |
| `active_routes` | `number` | Distinct `route+method` pairs with traffic in the last 24h. |
| `total_routes` | `number` | Distinct `route+method` pairs ever seen. |
| `insights_count` | `number` | `insights.length`, provided for convenience. |
| `insights` | `Insight[]` | Same shape as `GET /api/insights` (Python) — see [Insight object](#insight-object). |

### `GET /api/routes`

Per-route aggregated stats, one row per `(route, method)` pair, for the requested time window.

**Query params:** `hours` (optional, default `24`) — lookback window.

```json
[
  {
    "route": "GET /users/:id",
    "method": "GET",
    "is_ghost": 0,
    "calls": 1024,
    "calls_2xx": 1000,
    "calls_3xx": 10,
    "calls_4xx": 12,
    "calls_5xx": 2,
    "p50": 45.2,
    "p90": 134.7,
    "p99": 310.2,
    "lat_max": 890.1,
    "bytes_avg": 2048.0,
    "request_size_avg": 128.0,
    "inflight_avg": 3.1,
    "inflight_max": 9
  }
]
```

Routes declared in your app but never called (see [Insights → UNTRACKED](/features/insights#untracked)) are appended to this list with `untracked: true` and all metric fields `null`/`0`.

Results are capped at 100 rows, ghost routes last, sorted by call volume descending.

### `GET /api/timeseries`

Time-bucketed stats (one point per minute) for a single `route`+`method`, for charting.

**Query params:** `route` (required), `method` (required), `hours` (optional, default `24`).

```json
[
  { "bucket_ts": 1751800020, "calls": 42, "p50": 40.1, "p90": 120.4, "p99": 280.0, "errors": 1, "redirects": 0 }
]
```

::: warning SDK inconsistency
On Node.js and PHP, omitting `route` or `method` returns `400 { "error": "route and method are required" }`. On Python, omitting them silently falls back to the same data as `/api/global-timeseries` instead of erroring — this divergence hasn't been reconciled yet, don't rely on the fallback behavior.
:::

### `GET /api/global-timeseries`

Same shape as `/api/timeseries`, aggregated across **all** routes (no `route`/`method` filter).

**Query params:** `hours` (optional, default `24`).

```json
[
  { "bucket_ts": 1751800020, "calls": 512, "p50": 38.0, "p90": 110.2, "p99": 260.5, "errors": 3 }
]
```

### `GET /api/releases`

Known deploys (from the `release` config option), most recent first, capped at 20.

```json
[
  { "release_tag": "v1.4.0", "release_ts": 1751800020, "routes_affected": 12 }
]
```

### `GET /api/insights` <Badge type="tip" text="Python only" />

Returns the `Insight[]` array alone (same content as the `insights` field of `/api/summary`). Node.js and PHP don't expose this as a separate endpoint today — use `/api/summary` on those SDKs.

## Insight object

Every entry in an `Insight[]` array (from `/api/summary` or `/api/insights`) has the same shape, regardless of type:

```json
{
  "type": "PERF",
  "severity": "error",
  "route": "/users/:id",
  "method": "GET",
  "message": "`GET /users/:id` P90 increased by 34% after v1.4.0. Before: 90ms — After: 121ms.",
  "data": { "release": "v1.4.0", "before_p90": 90, "after_p90": 121, "delta_pct": 34.4 }
}
```

| Field | Type | Notes |
|---|---|---|
| `type` | `string` | One of `PERF`, `OK`, `DEAD`, `ANOMALY`, `DRIFT`, `UNTRACKED`. See [Automatic Insights](/features/insights) for what triggers each one. |
| `severity` | `string` | `success` \| `info` \| `warning` \| `error` — drives the color/icon in the UI. |
| `route` / `method` | `string` | The endpoint the insight is about. |
| `message` | `string` | Human-readable, ready to display as-is. |
| `data` | `object` | Shape depends on `type` — see below. |

### `data` shape per type

| Type | `data` fields |
|---|---|
| `PERF` / `OK` | `release`, `before_p90`, `after_p90`, `delta_pct` |
| `ANOMALY` | `current_p99`, `baseline_p99`, `z_score` |
| `DEAD` | `last_seen_ts`, `inactive_days` |
| `DRIFT` | `slope_ms_per_day`, `observed_days`, `projection_30d_ms` |
| `UNTRACKED` | `first_seen_ts` |

## Errors

All endpoints return plain-text `404` for unknown paths. `/api/timeseries` is the only endpoint with a documented `400` (see above). No endpoint returns `5xx` under normal operation — internal errors are caught and degrade to empty results rather than propagating (consistent with the SDKs never being allowed to crash the host app).
