"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAccounts = exports.DefaultKMDConfig = void 0;
const algosdk_1 = __importDefault(require("algosdk"));
const kmd_token = 'a'.repeat(64);
const kmd_host = 'http://localhost';
const kmd_port = '4002';
const kmd_wallet = 'unencrypted-default-wallet';
const kmd_password = '';
exports.DefaultKMDConfig = {
    host: kmd_host,
    token: kmd_token,
    port: kmd_port,
    wallet: kmd_wallet,
    password: kmd_password,
};
async function getAccounts(config = exports.DefaultKMDConfig) {
    const kmdClient = new algosdk_1.default.Kmd(config.token, config.host, config.port);
    const wallets = await kmdClient.listWallets();
    let walletId;
    for (const wallet of wallets['wallets']) {
        if (wallet['name'] === config.wallet)
            walletId = wallet['id'];
    }
    if (walletId === undefined)
        throw Error('No wallet named: ' + config.wallet);
    const handleResp = await kmdClient.initWalletHandle(walletId, config.password);
    const handle = handleResp['wallet_handle_token'];
    const addresses = await kmdClient.listKeys(handle);
    const acctPromises = [];
    for (const addr of addresses['addresses']) {
        acctPromises.push(kmdClient.exportKey(handle, config.password, addr));
    }
    const keys = await Promise.all(acctPromises);
    // Don't need to wait for it
    kmdClient.releaseWalletHandle(handle);
    return keys.map((k) => {
        const addr = algosdk_1.default.encodeAddress(k.private_key.slice(32));
        const acct = { sk: k.private_key, addr: addr };
        const signer = algosdk_1.default.makeBasicAccountTransactionSigner(acct);
        return {
            addr: acct.addr,
            privateKey: acct.sk,
            signer: signer,
        };
    });
}
exports.getAccounts = getAccounts;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWNjb3VudHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc2FuZGJveC9hY2NvdW50cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxzREFBOEI7QUFFOUIsTUFBTSxTQUFTLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNqQyxNQUFNLFFBQVEsR0FBRyxrQkFBa0IsQ0FBQztBQUNwQyxNQUFNLFFBQVEsR0FBRyxNQUFNLENBQUM7QUFDeEIsTUFBTSxVQUFVLEdBQUcsNEJBQTRCLENBQUM7QUFDaEQsTUFBTSxZQUFZLEdBQUcsRUFBRSxDQUFDO0FBZ0JYLFFBQUEsZ0JBQWdCLEdBQUc7SUFDOUIsSUFBSSxFQUFFLFFBQVE7SUFDZCxLQUFLLEVBQUUsU0FBUztJQUNoQixJQUFJLEVBQUUsUUFBUTtJQUNkLE1BQU0sRUFBRSxVQUFVO0lBQ2xCLFFBQVEsRUFBRSxZQUFZO0NBQ1YsQ0FBQztBQUVSLEtBQUssVUFBVSxXQUFXLENBQy9CLFNBQW9CLHdCQUFnQjtJQUVwQyxNQUFNLFNBQVMsR0FBRyxJQUFJLGlCQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7SUFFMUUsTUFBTSxPQUFPLEdBQUcsTUFBTSxTQUFTLENBQUMsV0FBVyxFQUFFLENBQUM7SUFFOUMsSUFBSSxRQUFRLENBQUM7SUFDYixLQUFLLE1BQU0sTUFBTSxJQUFJLE9BQU8sQ0FBQyxTQUFTLENBQUMsRUFBRTtRQUN2QyxJQUFJLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxNQUFNLENBQUMsTUFBTTtZQUFFLFFBQVEsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDL0Q7SUFFRCxJQUFJLFFBQVEsS0FBSyxTQUFTO1FBQUUsTUFBTSxLQUFLLENBQUMsbUJBQW1CLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBRTdFLE1BQU0sVUFBVSxHQUFHLE1BQU0sU0FBUyxDQUFDLGdCQUFnQixDQUNqRCxRQUFRLEVBQ1IsTUFBTSxDQUFDLFFBQVEsQ0FDaEIsQ0FBQztJQUNGLE1BQU0sTUFBTSxHQUFHLFVBQVUsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0lBRWpELE1BQU0sU0FBUyxHQUFHLE1BQU0sU0FBUyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNuRCxNQUFNLFlBQVksR0FBdUMsRUFBRSxDQUFDO0lBQzVELEtBQUssTUFBTSxJQUFJLElBQUksU0FBUyxDQUFDLFdBQVcsQ0FBQyxFQUFFO1FBQ3pDLFlBQVksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO0tBQ3ZFO0lBQ0QsTUFBTSxJQUFJLEdBQUcsTUFBTSxPQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBRTdDLDRCQUE0QjtJQUM1QixTQUFTLENBQUMsbUJBQW1CLENBQUMsTUFBTSxDQUFDLENBQUM7SUFFdEMsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7UUFDcEIsTUFBTSxJQUFJLEdBQUcsaUJBQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM1RCxNQUFNLElBQUksR0FBRyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsV0FBVyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQXFCLENBQUM7UUFDbEUsTUFBTSxNQUFNLEdBQUcsaUJBQU8sQ0FBQyxpQ0FBaUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMvRCxPQUFPO1lBQ0wsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO1lBQ2YsVUFBVSxFQUFFLElBQUksQ0FBQyxFQUFFO1lBQ25CLE1BQU0sRUFBRSxNQUFNO1NBQ0csQ0FBQztJQUN0QixDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUF4Q0Qsa0NBd0NDIn0=