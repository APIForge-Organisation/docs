# Quick Start

Get APIForge running in your Express.js application in under 5 minutes.

## Requirements

- Node.js **22.5 or higher** (uses the built-in `node:sqlite` module)
- An Express.js application (v4 or v5)

## Installation

```bash
npm install apiforgejs
```

## Add the middleware

```js
const express = require('express')
const { apiforge } = require('apiforgejs')

const app = express()

// Add this line — that's it
app.use(apiforge({ mode: 'local' }))

app.get('/users/:id', (req, res) => {
  res.json({ id: req.params.id })
})

app.listen(3000)
```

## Open the dashboard

Once your server receives its first requests, open:

```
http://localhost:4242
```

You'll see:

- **Health Score** — a 0–100 score summarizing your API's health
- **Latency per endpoint** — P50, P90, P99 in real time
- **Error rate by route** — 2xx / 4xx / 5xx breakdown
- **Automatic insights** — plain-language alerts, no configuration needed

::: tip First metrics
The dashboard aggregates data every 60 seconds by default. Send a few requests to your API, wait one minute, and refresh — your first metrics will appear.
:::

## ESM projects

```js
import { apiforge } from 'apiforgejs'
```

## Verify it works

```bash
# Send a few test requests
curl http://localhost:3000/users/1
curl http://localhost:3000/users/2
curl http://localhost:3000/users/404-test

# Check the dashboard
open http://localhost:4242
```

## What's next

- [Configuration](/guide/configuration) — customize the dashboard port, flush interval, sampling rate and more
- [Local Dashboard](/guide/dashboard) — understand what each panel shows
- [Automatic Insights](/features/insights) — what APIForge detects and how to act on it
