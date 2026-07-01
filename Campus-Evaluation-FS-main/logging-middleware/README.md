## Logging Middleware

Reusable `Log()` function for sending structured logs to the evaluation service.

### Usage

```js
import { Log } from "./log";

await Log("frontend", "error", "component", "Button failed to render.");
```

### Parameters

| Param    | Values                                                    |
|----------|-----------------------------------------------------------|
| stack    | `backend`, `frontend`                                     |
| level    | `debug`, `info`, `warn`, `error`, `fatal`                 |
| package  | Frontend: `api`, `component`, `hook`, `page`, `state`, `style` |
|          | Shared: `auth`, `config`, `middleware`, `utils`          |
| message  | Free-text description                                    |
