Beaker Typescript Client Generator


EXPERIMENTAL

Barely works, zero tests, hardcoded paths


Right now to generate a client, use Beaker@app-spec-src 
- write out the app_spec to json
- tweak `gen.ts` to point to it
- run:
```sh
npm run gen
```
- wiggle `try.ts` to import your new client and do whatever
- report issues (bound to be lots)
