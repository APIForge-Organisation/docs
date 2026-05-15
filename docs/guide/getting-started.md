# Quick Start

Get APIForge running in your application in under 5 minutes.

## Node.js — Express.js

### Requirements

- Node.js **22.5 or higher** (uses the built-in `node:sqlite` module)
- An Express.js application (v4 or v5)

### Installation

```bash
npm install apiforgejs
```

### Add the middleware

::: code-group

```js [Local mode]
const express = require('express')
const { apiforge } = require('apiforgejs')

const app = express()

app.use(apiforge())

app.get('/users/:id', (req, res) => {
  res.json({ id: req.params.id })
})

app.listen(3000)
```

```js [Cloud mode]
const express = require('express')
const { apiforge } = require('apiforgejs')

const app = express()

app.use(apiforge({
  cloudUrl: 'https://api.apiforge.fr',
  apiKey:   process.env.APIFORGE_API_KEY,
  service:  'my-api',
}))

app.listen(3000)
```

:::

### ESM projects

```js
import { apiforge } from 'apiforgejs'
```

---

## Python — FastAPI / Starlette

### Requirements

- Python **3.11 or higher**
- A FastAPI or Starlette application

### Installation

```bash
pip install apiforgepy
```

### Add the middleware

::: code-group

```python [Local mode]
from fastapi import FastAPI
from apiforgepy import ApiForgeMiddleware

app = FastAPI()

app.add_middleware(ApiForgeMiddleware)

@app.get("/users/{user_id}")
def get_user(user_id: int):
    return {"id": user_id}
```

```python [Cloud mode]
import os
from fastapi import FastAPI
from apiforgepy import ApiForgeMiddleware

app = FastAPI()

app.add_middleware(
    ApiForgeMiddleware,
    cloud_url=os.environ["APIFORGE_CLOUD_URL"],
    api_key=os.environ["APIFORGE_API_KEY"],
    service="my-api",
)
```

:::

---

## Open the local dashboard

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

::: info Cloud mode
In cloud mode the local dashboard is not started. Metrics are sent to the APIForge SaaS and displayed in the cloud dashboard. See [Cloud Mode](/guide/cloud-mode).
:::

## What's next

- [Configuration](/guide/configuration) — customize the dashboard port, flush interval, sampling rate and more
- [Local Dashboard](/guide/dashboard) — understand what each panel shows
- [Cloud Mode](/guide/cloud-mode) — send metrics to the APIForge SaaS
- [Automatic Insights](/features/insights) — what APIForge detects and how to act on it
