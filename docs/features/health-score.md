# Health Score

The Health Score is a single **0–100 number** that summarizes the overall health of your API at a glance. It is computed continuously and displayed prominently at the top of the dashboard.

## Calculation

The score combines four weighted dimensions:

| Dimension | Weight | What is measured |
|---|---|---|
| **Availability** | 30% | Ratio of 2xx responses over the last 24 hours |
| **Performance** | 30% | P90 latency compared to the 30-day historical baseline |
| **Stability** | 25% | Absence of anomalies and error spikes over the last 7 days |
| **Quality** | 15% | Proportion of endpoints that are active and not degraded |

### Availability (30%)

```
score = (2xx_requests / total_requests) × 100
```

A 99% success rate gives a full 30 points. Below 95% the score drops sharply.

### Performance (30%)

Compares current P90 latency against the 30-day baseline:

- P90 at or below baseline → full 30 points
- P90 10–30% above baseline → partial score
- P90 more than 50% above baseline → 0 points on this dimension

### Stability (25%)

Counts anomaly events in the last 7 days (Z-score P99 spikes, sudden error rate increases). Each unresolved anomaly reduces the stability score.

### Quality (15%)

```
score = (active_endpoints / total_endpoints) × 100
```

An endpoint is considered "active and healthy" if it has received traffic in the last 21 days and has no open `PERF` insight.

## Reading the score

| Score | Status | Meaning |
|---|---|---|
| 85 – 100 | 🟢 Healthy | All systems nominal |
| 65 – 84 | 🟡 Warning | One or more dimensions need attention |
| 40 – 64 | 🟠 Degraded | Performance or availability issues detected |
| 0 – 39 | 🔴 Critical | Significant problems requiring immediate action |
