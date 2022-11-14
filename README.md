
> :warning: **Just a patch until the [ISSUE](https://github.com/algorand-devrel/beaker-ts/issues/18) is resolved ** 
> :warning: **The fork should be replaced as soon as the original repo starts supporting cjs** 

# Beaker Typescript Client Generator

> :warning: **Experimental. Zero tests. Please report issues**

## Generate an ApplicationSpec

Use [beaker-pyteal](https://github.com/algorand-devrel/beaker) to create an Application and write the ApplicationSpec to json

```py
import json
from beaker import Application

# Create your Application with Beaker
class HelloBeaker(Application):
    @external
    def hello(self, name: abi.String, *, output: abi.String):
      return output.set(Concat(Bytes("Hello, "), name.get()))

if __name__ == "__main__":
  # Writes contract.json, HelloBeaker.json, approval.teal, and clear.teal 
  # to the `artifacts` directory
  HelloBeaker().dump("artifacts")
```

> The ApplicationSpec contains the ARC4 ABI spec with some extra bits to help the client

## Generate a TypeScript Client

In a node project directory install beaker-ts
```sh
npm install beaker-ts
```

Generate the client using the `beaker generate` command

```sh
$ npx beaker help generate

Usage: beaker generate [options] <path-to-spec> <path-to-write>

Generates an application client given an application spec

Options:
  -l, --local  whether or not to use local import
  -h, --help   display help for command
```

Example:
```sh
npx beaker generate examples/hello/hello.json examples/hello/
```

This should create a new file called `hellobeaker_client.ts`

The client can now be imported and used to create or call the app methods by name and with expected types.

```ts
// Helpers to get accounts and algod client for sandbox
import * as bkr from "beaker-ts";

// Our autogenerated client
import {HelloBeaker} from "./hellobeaker_client";

(async function () {

  // Grab an account
  const acct = (await bkr.sandbox.getAccounts()).pop();
  if (acct === undefined) return;

  // Create a new client that will talk to our app
  // Including a signer lets it worry about signing
  // the app call transactions 
  const appClient = new HelloBeaker({
    client: bkr.clients.sandboxAlgod(),
    signer: acct.signer,
    sender: acct.addr,
  });

  // Deploy our app on chain (Only works if the ApplicationSpec was used to generate the client)
  const [appId, appAddr, txId] = await appClient.create();
  console.log(`Created app ${appId} with address ${appAddr} in tx ${txId}`);

  // Call the method by name, with named and typed arguments
  const result = await appClient.hello({name: "Beaker"});
  // Get a typed result back from our app call
  console.log(result.value); // Hello, Beaker

})();
```

See the [examples directory](https://github.com/algorand-devrel/beaker-ts/tree/master/examples) for usage examples.

Please report issues
