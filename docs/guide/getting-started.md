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

```js
const express = require('express')
const { apiforge } = require('apiforgejs')

const app = express()

app.use(apiforge({ mode: 'local' }))

app.get('/users/:id', (req, res) => {
  res.json({ id: req.params.id })
})

app.listen(3000)
```

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

```python
from fastapi import FastAPI
from apiforgepy import ApiForgeMiddleware

app = FastAPI()

app.add_middleware(ApiForgeMiddleware, mode="local")

@app.get("/users/{user_id}")
def get_user(user_id: int):
    return {"id": user_id}
```

---

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

## What's next

- [Configuration](/guide/configuration) — customize the dashboard port, flush interval, sampling rate and more
- [Local Dashboard](/guide/dashboard) — understand what each panel shows
- [Automatic Insights](/features/insights) — what APIForge detects and how to act on it
