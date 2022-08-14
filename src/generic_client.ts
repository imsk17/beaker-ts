import algosdk, { AtomicTransactionComposer } from "algosdk";
import { AppSpec } from "./generate/appspec";

export type MethodArgs = {
  [key: string]: string | number | Uint8Array | algosdk.TransactionWithSigner;
};
export default class GenericApplicationClient {
  client: algosdk.Algodv2;

  appId: number;
  appAddress: string;

  approvalProgram: string;
  clearProgram: string;

  approvalProgramBinary: Uint8Array;
  clearProgramBinary: Uint8Array;

  approvalProgramMap: algosdk.SourceMap;
  clearProgramMap: algosdk.SourceMap;

  appSpec: AppSpec;

  signer?: algosdk.TransactionSigner;

  constructor(opts: {
    client: algosdk.Algodv2;
    appId?: number;
    signer?: algosdk.TransactionSigner;
  }) {
    this.client = opts.client;
    this.appId = opts.appId;
    this.appAddress = algosdk.getApplicationAddress(opts.appId);

    this.signer = opts.signer;
  }

  async compile(program: string): Promise<[Uint8Array, algosdk.SourceMap]> {
    const result = await this.client.compile(program).sourcemap(true).do();
    return [
      new Uint8Array(Buffer.from(result["result"], "base64")),
      new algosdk.SourceMap(result["sourcemeap"]),
    ];
  }

  private async ensurePrograms() {
    if (this.approvalProgramBinary === undefined) {
      const [appBin, appMap] = await this.compile(this.approvalProgram);
      this.approvalProgramBinary = appBin;
      this.approvalProgramMap = appMap;
    }

    if (this.clearProgramBinary === undefined) {
      const [clearBin, clearMap] = await this.compile(this.clearProgram);
      this.clearProgramBinary = clearBin;
      this.clearProgramMap = clearMap;
    }
  }

  async create() {
    await this.ensurePrograms();

    const sp = await this.client.getTransactionParams().do();

    const atc = new algosdk.AtomicTransactionComposer();
    atc.addTransaction({
      txn: algosdk.makeApplicationCreateTxnFromObject({
        from: this.getSender(),
        suggestedParams: sp,
        onComplete: algosdk.OnApplicationComplete.NoOpOC,
        approvalProgram: this.approvalProgramBinary,
        clearProgram: this.clearProgramBinary,
        numLocalInts: 0,
        numLocalByteSlices: 0,
        numGlobalInts: 0,
        numGlobalByteSlices: 0,
      }),
      signer: this.signer,
    });

    try {
      const result = await atc.execute(this.client, 4);
    } catch (e) {
      //TODO: try wrap logic exception
      throw e;
    }
  }

  async delete() {
    const sp = await this.client.getTransactionParams().do();

    const atc = new algosdk.AtomicTransactionComposer();
    atc.addTransaction({
      txn: algosdk.makeApplicationCallTxnFromObject({
        from: this.getSender(),
        suggestedParams: sp,
        onComplete: algosdk.OnApplicationComplete.DeleteApplicationOC,
        appIndex: this.appId,
      }),
      signer: this.signer,
    });

    try {
      const result = await atc.execute(this.client, 4);
    } catch (e) {
      //TODO: try wrap logic exception
      throw e;
    }
  }

  async update() {
    await this.ensurePrograms();

    const sp = await this.client.getTransactionParams().do();

    const atc = new algosdk.AtomicTransactionComposer();
    atc.addTransaction({
      txn: algosdk.makeApplicationUpdateTxnFromObject({
        from: this.getSender(),
        suggestedParams: sp,
        approvalProgram: this.approvalProgramBinary,
        clearProgram: this.clearProgramBinary,
        appIndex: this.appId,
      }),
      signer: this.signer,
    });

    try {
      const result = await atc.execute(this.client, 4);
    } catch (e) {
      //TODO: try wrap logic exception
      throw e;
    }
  }

  async optIn() {}

  async closeOut() {}

  async clearState() {}

  async call(
    method: algosdk.ABIMethod,
    args?: MethodArgs,
    txParams?: algosdk.TransactionLike
  ): Promise<algosdk.ABIResult> {

    const atc = new AtomicTransactionComposer();
    atc.addMethodCall({
      appID: this.appId,
      method: method,
      methodArgs: Object.values(args),
      sender: this.getSender(),
      suggestedParams: undefined,
      signer: this.signer,
    });
    const results = await atc.execute(this.client, 4);
    return results.methodResults[0];
  }

  async addMethodCall() {}

  private getSender(): string {
    return "TODO:";
  }
}
