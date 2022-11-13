import { Transaction } from 'algosdk';
import { WalletData, SignedTxn, Wallet } from './wallet';
import WalletConnect from '@walletconnect/client';
declare class WC extends Wallet {
    connector: WalletConnect;
    constructor(network: string, data: WalletData);
    connect(cb: () => void): Promise<boolean>;
    waitForConnected(): Promise<boolean>;
    static displayName(): string;
    displayName(): string;
    static img(_inverted: boolean): string;
    img(inverted: boolean): string;
    isConnected(): boolean;
    disconnect(): void;
    sign(txns: Transaction[]): Promise<SignedTxn[]>;
}
export default WC;
//# sourceMappingURL=walletconnect.d.ts.map