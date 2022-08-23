# Beaker Typescript Client Generator

EXPERIMENTAL

> :warning: **Barely works, zero tests, hardcoded paths**

Right now to generate a client, use Beaker@app-spec-src

- write out the app_spec to json
- run:

```sh
npm run gen amm.json ./src/ # or whatever json to read/path to write
```

- wiggle `try.ts` to import your new client and do whatever
- report issues (bound to be lots)
