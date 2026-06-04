# Automatic Insights

Insights are plain-language alerts generated automatically from your traffic data — no dashboards to configure, no thresholds to set manually.

They appear in the dashboard's **Insights** panel and are recalculated on every flush cycle (default: every 60 seconds). Filter chips let you show only a specific type.

## Insight types

### ANOMALY

Detects statistically abnormal spikes in P99 latency using Z-score analysis.

> *"`GET /search` P99 latency is 8× above the 7-day average (current: 1240ms, normal: 148ms). Possible cause: dependency timeout or unusual traffic pattern."*

**Triggers when:** P99 latency exceeds the 7-day moving average by more than 3 standard deviations.

---

### DRIFT

Detects progressive, long-term latency degradation that would be invisible on a real-time dashboard — a slow leak rather than a spike.

> *"`GET /products` has been progressively degrading for 18 days: +3.2ms/day. 30-day projection: +96ms."*

**How it works:** Ordinary least squares (OLS) linear regression over daily P90 buckets for the last 30 days, computed per endpoint.

**Triggers when:**
- At least **7 days** of data are available for the endpoint
- The regression slope is **≥ 5ms per day**

The insight includes the slope, the number of days observed, and a 30-day projection.

---

### DEAD

Identifies endpoints that have received no traffic for an extended period — safe candidates for deprecation.

> *"`DELETE /legacy/import` has received no requests in 23 days. Consider deprecating this endpoint."*

**Triggers when:** An endpoint has zero requests for the past **21 days**.

---

### PERF / OK

Compares performance metrics before and after a deployment, when a `release` tag is configured.

> **PERF** — *"`POST /orders` P99 latency increased by 40% after deploying v1.3.0. Before: 230ms — After: 322ms."*

> **OK** — *"Deploy v1.4.0 improved `GET /products` by 12%. Before: 85ms — After: 75ms."*

**Triggers when:** A `release` value is set in the config and at least 30 minutes of post-deploy data is available.

See [Release Tracking](/features/release-tracking) for setup.

---

### UNTRACKED

Identifies routes declared in your router that have never received a single request. Useful for spotting dead code, misconfigured routing, or undocumented endpoints.

> *"`POST /admin/export` is declared in the router but has never received any traffic."*

**Triggers when:** A route appears in the router registry but has zero entries in the metrics database.

::: tip Available on all SDKs
- **Node.js** — scans the Express router automatically on the first request
- **Python** — scans the Starlette/FastAPI router automatically on the first request
- **PHP / Laravel** — syncs the Laravel route registry via the ServiceProvider on boot
:::

---

## How insights are prioritized

Insights are sorted by severity in the dashboard:

| Priority | Types |
|---|---|
| 🔴 Critical | `ANOMALY` with Z-score > 5, `PERF` regression > 50% |
| 🟠 Warning | `DRIFT` (progressive degradation), `PERF` regression 20–50%, `ANOMALY` Z-score 3–5 |
| ⚫ Info | `DEAD` endpoints, `UNTRACKED` routes |
| 🟢 Positive | `OK` (clean deploy confirmation) |

## Enabling release insights

Set the `release` option to activate `PERF` and `OK` insights:

::: code-group

```js [Node.js]
app.use(apiforge({ release: 'v1.4.0' }))
```

```python [Python]
app.add_middleware(ApiForgeMiddleware, release="v1.4.0")
```

```bash [PHP / Laravel (.env)]
APIFORGE_RELEASE=v1.4.0
```

:::

Each time the value changes (i.e. on a new deploy), APIForge creates a comparison baseline automatically.
