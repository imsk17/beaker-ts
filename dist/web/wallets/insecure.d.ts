import type { Transaction } from 'algosdk';
import { WalletData, SignedTxn, Wallet } from './wallet';
declare class InsecureWallet extends Wallet {
    pkToSk: Record<string, Uint8Array>;
    constructor(network: string, data: WalletData);
    connect(storedMnemonic: string): Promise<boolean>;
    static displayName(): string;
    displayName(): string;
    static img(_inverted: boolean): string;
    img(inverted: boolean): string;
    isConnected(): boolean;
    disconnect(): void;
    serialize(): WalletData;
    sign(txns: Transaction[]): Promise<SignedTxn[]>;
}
export default InsecureWallet;
//# sourceMappingURL=insecure.d.ts.map