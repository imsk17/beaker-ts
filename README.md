# Beaker Typescript Client Generator

EXPERIMENTAL

> :warning: **Barely works, zero tests, hardcoded paths**

Right now to generate a client, use `beaker-pyteal>=0.1.2`

- write out the app_spec to json:

```py
import json
from beaker.client import ApplicationClient
#...
app_client = ApplicationClient(algod_client, App(), signer=signer)
with open("app.json", "w") as f:
  f.write(json.dumps(app_client.application_spec()))
```
- run:

```sh
npm run gen amm.json ./src/ # or whatever json to read/path to write
```

- wiggle `try.ts` to import your new client and do whatever
- report issues (bound to be lots)
