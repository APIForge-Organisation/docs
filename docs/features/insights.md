# Automatic Insights

Insights are plain-language alerts generated automatically from your traffic data — no dashboards to configure, no thresholds to set manually.

They appear in the dashboard's **Insights** panel and are recalculated on every flush cycle (default: every 60 seconds).

## Insight types

### ANOMALY

Detects statistically abnormal spikes in P99 latency using Z-score analysis.

> *"`GET /search` P99 latency is 8× above the 7-day average (current: 1240ms, normal: 148ms). Possible cause: dependency timeout or unusual traffic pattern."*

**Triggers when:** P99 latency exceeds the moving average by more than 3 standard deviations.

---

### DEAD

Identifies endpoints that have received no traffic for an extended period — safe candidates for deprecation.

> *"`DELETE /legacy/import` has received no requests in 23 days. Consider deprecating this endpoint."*

**Triggers when:** An endpoint has zero requests for the past **21 days** (configurable via `deadThresholdDays`).

---

### PERF / OK

Compares performance metrics before and after a deployment, when a `release` tag is configured.

> **PERF** — *"`POST /orders` P99 latency increased by 40% after deploying v1.3.0 (14h32 yesterday). Before: 230ms — After: 322ms."*

> **OK** — *"Deploy v1.4.0 (3 hours ago) introduced no detectable regression. Latency stable, error rate unchanged."*

**Triggers when:** A `release` value is set in the config and at least 30 minutes of post-deploy data is available.

See [Release Tracking](/features/release-tracking) for setup.

## How insights are prioritized

Insights are sorted by severity in the dashboard:

| Priority | Types |
|---|---|
| 🔴 Critical | `ANOMALY` with Z-score > 5, `PERF` regression > 50% |
| 🟠 Warning | `PERF` regression 20–50%, `ANOMALY` Z-score 3–5 |
| ⚫ Info | `DEAD` endpoints |
| 🟢 Positive | `OK` (clean deploy confirmation) |

## Enabling release insights

Set the `release` option to activate `PERF` and `OK` insights:

```js
app.use(apiforge({
  mode: 'local',
  release: process.env.npm_package_version, // e.g. '1.4.0'
}))
```

Each time the value changes (i.e. on a new deploy), APIForge creates a comparison baseline automatically.
