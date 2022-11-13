import type { Transaction } from 'algosdk';
export interface SignedTxn {
    txID: string;
    blob: Uint8Array;
}
export interface WalletData {
    acctList: string[];
    defaultAcctIdx: number;
    extra: Record<string, any>;
}
export declare class Wallet {
    accounts: string[];
    defaultAccountIdx: number;
    network: string;
    constructor(network: string, data: WalletData);
    isConnected(): boolean;
    setDefaultIdx(idx: number): void;
    getDefaultAddress(): string;
    static displayName(): string;
    static img(_inverted: boolean): string;
    connect(_settings?: any): Promise<boolean>;
    disconnect(): void;
    sign(_txns: Transaction[]): Promise<SignedTxn[]>;
    serialize(): WalletData;
}
//# sourceMappingURL=wallet.d.ts.map