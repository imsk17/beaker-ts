import type { Wallet, WalletData } from './wallets/wallet';
import type { TransactionSigner } from 'algosdk';
export declare enum WalletName {
    WalletConnect = "wallet-connect",
    AlgoSigner = "algo-signer",
    MyAlgoConnect = "my-algo-connect",
    InsecureWallet = "insecure-wallet",
    KMDWallet = "kmd-wallet"
}
export declare const ImplementedWallets: Record<string, typeof Wallet>;
export declare const PlaceHolderSigner: TransactionSigner;
export interface SessionWalletData {
    walletPreference: WalletName;
    data: WalletData;
}
export declare class SessionWalletManager {
    static setWalletPreference(network: string, pref: WalletName): void;
    static getWallet(network: string, swd: SessionWalletData): Wallet;
    static connect(network: string): Promise<boolean>;
    static disconnect(network: string): void;
    static connected(network: string): boolean;
    static setAcctIdx(network: string, idx: number): void;
    static wallet(network: string): Wallet;
    static address(network: string): string;
    static signer(network: string): TransactionSigner;
    static read(network: string): SessionWalletData;
    static write(network: string, data: SessionWalletData): void;
}
//# sourceMappingURL=session_wallet.d.ts.map