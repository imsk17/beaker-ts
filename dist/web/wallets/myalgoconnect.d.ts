import { Transaction } from 'algosdk';
import { WalletData, SignedTxn, Wallet } from './wallet';
import MyAlgo from '@randlabs/myalgo-connect';
declare class MyAlgoConnectWallet extends Wallet {
    walletConn: MyAlgo;
    constructor(network: string, data: WalletData);
    static displayName(): string;
    displayName(): string;
    static img(inverted: boolean): string;
    img(inverted: boolean): string;
    connect(): Promise<boolean>;
    doSign(defaultAcct: string, txns: Transaction[]): Promise<SignedTxn[]>;
    sign(txns: Transaction[]): Promise<SignedTxn[]>;
}
export default MyAlgoConnectWallet;
//# sourceMappingURL=myalgoconnect.d.ts.map