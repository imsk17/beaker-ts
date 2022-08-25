# Beaker Typescript Client Generator

EXPERIMENTAL

> :warning: **Barely works, zero tests, hardcoded paths**

## Example

git clone this repo and cd into it

```sh
rm src/examples/hello/hellobeaker_client.ts
npm run gen src/examples/hello/hello.json src/examples/hello
npm run hello
```

## Generate a client

To generate a client, use [beaker-pyteal](https://github.com/algorand-devrel/beaker) to create an Application and write the app spec to json

```sh
npm run gen $PATH_TO_APP_SPEC_JSON $PATH_TO_WHERE_CLIENT_SHOULD_BE_WRITTEN 
```

Please report issues (bound to be lots)