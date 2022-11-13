import algosdk, { AtomicTransactionComposer } from 'algosdk';
import { Schema } from '../generate';
import { ApplicationState, AccountState } from './state';
export declare type MethodArg = algosdk.ABIArgument | algosdk.Transaction | object | MethodArg[];
export declare type MethodArgs = Record<string, MethodArg>;
export declare type ABIReturnType = object | void | algosdk.ABIValue;
export declare type TransactionOverrides = Partial<algosdk.TransactionParams>;
export declare type TransactionResult = {
    confirmedRound: number;
    txIDs: string[];
    methodResults: algosdk.ABIResult[];
};
export declare function decodeNamedTuple(v: algosdk.ABIValue | undefined, keys: string[]): object;
export interface InnerTransaction {
    txn: algosdk.Transaction;
    createdAsset?: bigint;
    createdApp?: bigint;
}
export declare class ABIResult<T extends ABIReturnType> {
    txID: string;
    rawReturnValue: Uint8Array;
    method: algosdk.ABIMethod;
    txInfo: Record<string, unknown> | undefined;
    returnValue: algosdk.ABIValue | undefined;
    decodeError: Error | undefined;
    value: T | undefined;
    inners: InnerTransaction[];
    constructor(result: algosdk.ABIResult, value?: T);
}
export declare type CreateResult = {
    appId: number;
    appAddress: string;
    txId: string;
};
export declare class ApplicationClient {
    client: algosdk.Algodv2;
    appId: number;
    appAddress: string;
    signer: algosdk.TransactionSigner;
    sender: string;
    methods?: algosdk.ABIMethod[];
    approvalProgram?: string;
    clearProgram?: string;
    approvalProgramBinary?: Uint8Array;
    clearProgramBinary?: Uint8Array;
    approvalProgramMap?: algosdk.SourceMap;
    clearProgramMap?: algosdk.SourceMap;
    appSchema?: Schema;
    acctSchema?: Schema;
    constructor(opts: {
        client: algosdk.Algodv2;
        signer: algosdk.TransactionSigner;
        sender: string;
        appId?: number;
    });
    compile(program: string): Promise<[Uint8Array, algosdk.SourceMap]>;
    private ensurePrograms;
    create(txParams?: TransactionOverrides): Promise<CreateResult>;
    delete(txParams?: TransactionOverrides): Promise<TransactionResult>;
    update(txParams?: TransactionOverrides): Promise<TransactionResult>;
    optIn(txParams?: TransactionOverrides): Promise<TransactionResult>;
    closeOut(txParams?: TransactionOverrides): Promise<TransactionResult>;
    clearState(txParams?: TransactionOverrides): Promise<TransactionResult>;
    execute(atc: AtomicTransactionComposer): Promise<algosdk.ABIResult>;
    addMethodCall(method: algosdk.ABIMethod, args?: MethodArgs, txParams?: TransactionOverrides, atc?: algosdk.AtomicTransactionComposer): Promise<algosdk.AtomicTransactionComposer>;
    wrapLogicError(e: Error): Error;
    resolve(source: string, data: bigint | number | string | Uint8Array): Promise<MethodArg>;
    getSuggestedParams(txParams?: TransactionOverrides, coverInners?: number): Promise<algosdk.SuggestedParams>;
    getApplicationState(raw?: boolean): Promise<ApplicationState>;
    getAccountState(address?: string, raw?: boolean): Promise<AccountState>;
    private getSender;
    private getLocalSchema;
    private getGlobalSchema;
}
//# sourceMappingURL=application_client.d.ts.map