import { Transaction } from 'algosdk';
import { WalletData, SignedTxn, Wallet } from './wallet';
declare class AlgoSignerWallet extends Wallet {
    constructor(network: string, data: WalletData);
    static displayName(): string;
    displayName(): string;
    static img(inverted: boolean): string;
    img(inverted: boolean): string;
    connect(): Promise<boolean>;
    waitForLoaded(): Promise<boolean>;
    sign(txns: Transaction[]): Promise<SignedTxn[]>;
}
export default AlgoSignerWallet;
//# sourceMappingURL=algosigner.d.ts.map