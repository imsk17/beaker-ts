/// <reference types="node" />
import algosdk from 'algosdk';
export declare type SandboxAccount = {
    addr: string;
    privateKey: Buffer;
    signer: algosdk.TransactionSigner;
};
export declare type KMDConfig = {
    host: string;
    port: string;
    token: string;
    wallet: string;
    password: string;
};
export declare const DefaultKMDConfig: KMDConfig;
export declare function getAccounts(config?: KMDConfig): Promise<SandboxAccount[]>;
//# sourceMappingURL=accounts.d.ts.map