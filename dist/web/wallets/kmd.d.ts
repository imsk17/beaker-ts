import algosdk from 'algosdk';
import { WalletData, Wallet, SignedTxn } from './wallet';
import type { KMDConfig } from '../../sandbox/accounts';
export declare class KMDWallet extends Wallet {
    pkToSk: Record<string, Uint8Array>;
    constructor(network: string, data: WalletData);
    connect(config?: KMDConfig): Promise<boolean>;
    static displayName(): string;
    displayName(): string;
    static img(_inverted: boolean): string;
    img(inverted: boolean): string;
    disconnect(): void;
    serialize(): WalletData;
    sign(txns: algosdk.Transaction[]): Promise<SignedTxn[]>;
}
//# sourceMappingURL=kmd.d.ts.map