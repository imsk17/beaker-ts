"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionWalletManager = exports.PlaceHolderSigner = exports.ImplementedWallets = exports.WalletName = void 0;
const algosigner_1 = __importDefault(require("./wallets/algosigner"));
const insecure_1 = __importDefault(require("./wallets/insecure"));
const myalgoconnect_1 = __importDefault(require("./wallets/myalgoconnect"));
const walletconnect_1 = __importDefault(require("./wallets/walletconnect"));
const kmd_1 = require("./wallets/kmd");
// lambda to add network to the key so we dont cross streams
const walletDataKey = (network) => `bkr-${network}-wallet-data`;
// If you implement a new wallet, add it here and to `ImplementedWallets`
var WalletName;
(function (WalletName) {
    WalletName["WalletConnect"] = "wallet-connect";
    WalletName["AlgoSigner"] = "algo-signer";
    WalletName["MyAlgoConnect"] = "my-algo-connect";
    WalletName["InsecureWallet"] = "insecure-wallet";
    WalletName["KMDWallet"] = "kmd-wallet";
})(WalletName = exports.WalletName || (exports.WalletName = {}));
exports.ImplementedWallets = {
    [WalletName.WalletConnect]: walletconnect_1.default,
    [WalletName.AlgoSigner]: algosigner_1.default,
    [WalletName.MyAlgoConnect]: myalgoconnect_1.default,
    [WalletName.InsecureWallet]: insecure_1.default,
    [WalletName.KMDWallet]: kmd_1.KMDWallet,
};
// If you just need a placeholder signer
const PlaceHolderSigner = (_txnGroup, _indexesToSign) => {
    return Promise.resolve([]);
};
exports.PlaceHolderSigner = PlaceHolderSigner;
class SessionWalletManager {
    static setWalletPreference(network, pref) {
        const walletData = SessionWalletManager.read(network);
        if (!(pref in exports.ImplementedWallets))
            throw new Error(`Unknown wallet preference: ${pref}`);
        SessionWalletManager.write(network, Object.assign(Object.assign({}, walletData), { walletPreference: pref }));
    }
    static getWallet(network, swd) {
        const w = exports.ImplementedWallets[swd.walletPreference];
        if (w === undefined)
            throw new Error('Unknown wallet preference');
        return new w(network, swd.data);
    }
    static async connect(network) {
        const swd = SessionWalletManager.read(network);
        const wallet = SessionWalletManager.getWallet(network, swd);
        switch (swd.walletPreference) {
            case WalletName.WalletConnect:
                return await wallet.connect(() => {
                    // Persist state in session storage in a callback
                    SessionWalletManager.write(network, Object.assign(Object.assign({}, swd), { data: wallet.serialize() }));
                });
            default:
                if (await wallet.connect()) {
                    // Persist state in session storage
                    SessionWalletManager.write(network, Object.assign(Object.assign({}, swd), { data: wallet.serialize() }));
                    return true;
                }
        }
        // Fail
        wallet.disconnect();
        return false;
    }
    static disconnect(network) {
        const swd = SessionWalletManager.read(network);
        const wallet = SessionWalletManager.getWallet(network, swd);
        if (wallet !== undefined)
            wallet.disconnect();
        SessionWalletManager.write(network, Object.assign(Object.assign({}, swd), { data: wallet.serialize() }));
    }
    static connected(network) {
        const swd = SessionWalletManager.read(network);
        if (swd.walletPreference === undefined)
            return false;
        const wallet = SessionWalletManager.getWallet(network, swd);
        return wallet !== undefined && wallet.isConnected();
    }
    static setAcctIdx(network, idx) {
        const swd = SessionWalletManager.read(network);
        const wallet = SessionWalletManager.getWallet(network, swd);
        wallet.setDefaultIdx(idx);
        SessionWalletManager.write(network, Object.assign(Object.assign({}, swd), { data: wallet.serialize() }));
    }
    //
    static wallet(network) {
        return SessionWalletManager.getWallet(network, SessionWalletManager.read(network));
    }
    static address(network) {
        const swd = SessionWalletManager.read(network);
        const wallet = SessionWalletManager.getWallet(network, swd);
        return wallet.getDefaultAddress();
    }
    static signer(network) {
        const swd = SessionWalletManager.read(network);
        const wallet = SessionWalletManager.getWallet(network, swd);
        return (txnGroup, indexesToSign) => {
            return Promise.resolve(wallet.sign(txnGroup)).then((txns) => {
                return txns
                    .map((tx) => {
                    return tx.blob;
                })
                    .filter((_, index) => indexesToSign.includes(index));
            });
        };
    }
    // Static methods
    static read(network) {
        const data = sessionStorage.getItem(walletDataKey(network));
        return (data === null || data === ''
            ? { data: { acctList: [], defaultAcctIdx: 0 } }
            : JSON.parse(data));
    }
    static write(network, data) {
        sessionStorage.setItem(walletDataKey(network), JSON.stringify(data));
    }
}
exports.SessionWalletManager = SessionWalletManager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Vzc2lvbl93YWxsZXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvd2ViL3Nlc3Npb25fd2FsbGV0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHNFQUFvRDtBQUNwRCxrRUFBZ0Q7QUFDaEQsNEVBQTBEO0FBQzFELDRFQUF5QztBQUd6Qyx1Q0FBMEM7QUFLMUMsNERBQTREO0FBQzVELE1BQU0sYUFBYSxHQUFHLENBQUMsT0FBZSxFQUFVLEVBQUUsQ0FBQyxPQUFPLE9BQU8sY0FBYyxDQUFDO0FBRWhGLHlFQUF5RTtBQUN6RSxJQUFZLFVBTVg7QUFORCxXQUFZLFVBQVU7SUFDcEIsOENBQWdDLENBQUE7SUFDaEMsd0NBQTBCLENBQUE7SUFDMUIsK0NBQWlDLENBQUE7SUFDakMsZ0RBQWtDLENBQUE7SUFDbEMsc0NBQXdCLENBQUE7QUFDMUIsQ0FBQyxFQU5XLFVBQVUsR0FBVixrQkFBVSxLQUFWLGtCQUFVLFFBTXJCO0FBRVksUUFBQSxrQkFBa0IsR0FBa0M7SUFDL0QsQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLEVBQUUsdUJBQUU7SUFDOUIsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLEVBQUUsb0JBQWdCO0lBQ3pDLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxFQUFFLHVCQUFtQjtJQUMvQyxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsRUFBRSxrQkFBYztJQUMzQyxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsRUFBRSxlQUFTO0NBQ2xDLENBQUM7QUFFRix3Q0FBd0M7QUFDakMsTUFBTSxpQkFBaUIsR0FBc0IsQ0FDbEQsU0FBd0IsRUFDeEIsY0FBd0IsRUFDRCxFQUFFO0lBQ3pCLE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUM3QixDQUFDLENBQUM7QUFMVyxRQUFBLGlCQUFpQixxQkFLNUI7QUFRRixNQUFhLG9CQUFvQjtJQUMvQixNQUFNLENBQUMsbUJBQW1CLENBQUMsT0FBZSxFQUFFLElBQWdCO1FBQzFELE1BQU0sVUFBVSxHQUFHLG9CQUFvQixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN0RCxJQUFJLENBQUMsQ0FBQyxJQUFJLElBQUksMEJBQWtCLENBQUM7WUFDL0IsTUFBTSxJQUFJLEtBQUssQ0FBQyw4QkFBOEIsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUN4RCxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsT0FBTyxrQ0FDN0IsVUFBVSxLQUNiLGdCQUFnQixFQUFFLElBQUksSUFDdEIsQ0FBQztJQUNMLENBQUM7SUFFRCxNQUFNLENBQUMsU0FBUyxDQUFDLE9BQWUsRUFBRSxHQUFzQjtRQUN0RCxNQUFNLENBQUMsR0FBRywwQkFBa0IsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUNuRCxJQUFJLENBQUMsS0FBSyxTQUFTO1lBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO1FBQ2xFLE9BQU8sSUFBSSxDQUFDLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNsQyxDQUFDO0lBRUQsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBZTtRQUNsQyxNQUFNLEdBQUcsR0FBRyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDL0MsTUFBTSxNQUFNLEdBQUcsb0JBQW9CLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQztRQUU1RCxRQUFRLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRTtZQUM1QixLQUFLLFVBQVUsQ0FBQyxhQUFhO2dCQUMzQixPQUFPLE1BQU0sTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUU7b0JBQy9CLGlEQUFpRDtvQkFDakQsb0JBQW9CLENBQUMsS0FBSyxDQUFDLE9BQU8sa0NBQzdCLEdBQUcsS0FDTixJQUFJLEVBQUUsTUFBTSxDQUFDLFNBQVMsRUFBRSxJQUN4QixDQUFDO2dCQUNMLENBQUMsQ0FBQyxDQUFDO1lBRUw7Z0JBQ0UsSUFBSSxNQUFNLE1BQU0sQ0FBQyxPQUFPLEVBQUUsRUFBRTtvQkFDMUIsbUNBQW1DO29CQUNuQyxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsT0FBTyxrQ0FDN0IsR0FBRyxLQUNOLElBQUksRUFBRSxNQUFNLENBQUMsU0FBUyxFQUFFLElBQ3hCLENBQUM7b0JBQ0gsT0FBTyxJQUFJLENBQUM7aUJBQ2I7U0FDSjtRQUVELE9BQU87UUFDUCxNQUFNLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDcEIsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDO0lBRUQsTUFBTSxDQUFDLFVBQVUsQ0FBQyxPQUFlO1FBQy9CLE1BQU0sR0FBRyxHQUFHLG9CQUFvQixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMvQyxNQUFNLE1BQU0sR0FBRyxvQkFBb0IsQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBRTVELElBQUksTUFBTSxLQUFLLFNBQVM7WUFBRSxNQUFNLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDOUMsb0JBQW9CLENBQUMsS0FBSyxDQUFDLE9BQU8sa0NBQU8sR0FBRyxLQUFFLElBQUksRUFBRSxNQUFNLENBQUMsU0FBUyxFQUFFLElBQUcsQ0FBQztJQUM1RSxDQUFDO0lBRUQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxPQUFlO1FBQzlCLE1BQU0sR0FBRyxHQUFHLG9CQUFvQixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMvQyxJQUFJLEdBQUcsQ0FBQyxnQkFBZ0IsS0FBSyxTQUFTO1lBQUUsT0FBTyxLQUFLLENBQUM7UUFFckQsTUFBTSxNQUFNLEdBQUcsb0JBQW9CLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQztRQUM1RCxPQUFPLE1BQU0sS0FBSyxTQUFTLElBQUksTUFBTSxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQ3RELENBQUM7SUFFRCxNQUFNLENBQUMsVUFBVSxDQUFDLE9BQWUsRUFBRSxHQUFXO1FBQzVDLE1BQU0sR0FBRyxHQUFHLG9CQUFvQixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMvQyxNQUFNLE1BQU0sR0FBRyxvQkFBb0IsQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBRTVELE1BQU0sQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDMUIsb0JBQW9CLENBQUMsS0FBSyxDQUFDLE9BQU8sa0NBQU8sR0FBRyxLQUFFLElBQUksRUFBRSxNQUFNLENBQUMsU0FBUyxFQUFFLElBQUcsQ0FBQztJQUM1RSxDQUFDO0lBRUQsRUFBRTtJQUNGLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBZTtRQUMzQixPQUFPLG9CQUFvQixDQUFDLFNBQVMsQ0FDbkMsT0FBTyxFQUNQLG9CQUFvQixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FDbkMsQ0FBQztJQUNKLENBQUM7SUFDRCxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQWU7UUFDNUIsTUFBTSxHQUFHLEdBQUcsb0JBQW9CLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQy9DLE1BQU0sTUFBTSxHQUFHLG9CQUFvQixDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDNUQsT0FBTyxNQUFNLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztJQUNwQyxDQUFDO0lBRUQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFlO1FBQzNCLE1BQU0sR0FBRyxHQUFHLG9CQUFvQixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMvQyxNQUFNLE1BQU0sR0FBRyxvQkFBb0IsQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQzVELE9BQU8sQ0FBQyxRQUF1QixFQUFFLGFBQXVCLEVBQUUsRUFBRTtZQUMxRCxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FDaEQsQ0FBQyxJQUFpQixFQUFFLEVBQUU7Z0JBQ3BCLE9BQU8sSUFBSTtxQkFDUixHQUFHLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRTtvQkFDVixPQUFPLEVBQUUsQ0FBQyxJQUFJLENBQUM7Z0JBQ2pCLENBQUMsQ0FBQztxQkFDRCxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDekQsQ0FBQyxDQUNGLENBQUM7UUFDSixDQUFDLENBQUM7SUFDSixDQUFDO0lBRUQsaUJBQWlCO0lBQ2pCLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBZTtRQUN6QixNQUFNLElBQUksR0FBRyxjQUFjLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBQzVELE9BQU8sQ0FDTCxJQUFJLEtBQUssSUFBSSxJQUFJLElBQUksS0FBSyxFQUFFO1lBQzFCLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUUsY0FBYyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQy9DLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUNBLENBQUM7SUFDekIsQ0FBQztJQUVELE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBZSxFQUFFLElBQXVCO1FBQ25ELGNBQWMsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUN2RSxDQUFDO0NBQ0Y7QUFqSEQsb0RBaUhDIn0=