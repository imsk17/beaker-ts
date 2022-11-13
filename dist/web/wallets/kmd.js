"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KMDWallet = void 0;
const algosdk_1 = __importDefault(require("algosdk"));
const wallet_1 = require("./wallet");
const __1 = require("../..");
class KMDWallet extends wallet_1.Wallet {
    constructor(network, data) {
        super(network, data);
        this.pkToSk = {};
        const extra = data.extra;
        if (extra !== undefined && 'pkMap' in extra) {
            for (const [k, v] of Object.entries(extra['pkMap'])) {
                // @ts-ignore
                this.pkToSk[k] = Buffer.from(v, 'base64');
            }
        }
    }
    async connect(config) {
        this.accounts = [];
        const accts = await __1.sandbox.getAccounts(config);
        for (const sba of accts) {
            this.pkToSk[sba.addr] = new Uint8Array(sba.privateKey);
            this.accounts.push(sba.addr);
        }
        return true;
    }
    static displayName() {
        return 'KMD Wallet';
    }
    displayName() {
        return KMDWallet.displayName();
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    static img(_inverted) {
        return '';
    }
    img(inverted) {
        return KMDWallet.img(inverted);
    }
    disconnect() {
        this.accounts = [];
        this.pkToSk = {};
    }
    serialize() {
        const pkMap = {};
        for (const [k, v] of Object.entries(this.pkToSk)) {
            pkMap[k] = Buffer.from(v.buffer).toString('base64');
        }
        return {
            acctList: this.accounts,
            defaultAcctIdx: this.defaultAccountIdx,
            extra: { pkMap: pkMap },
        };
    }
    async sign(txns) {
        const signed = [];
        const defaultAddr = this.getDefaultAddress();
        for (const txidx in txns) {
            const txn = txns[txidx];
            if (txn === undefined)
                continue;
            const addr = algosdk_1.default.encodeAddress(txn.from.publicKey);
            const acct = this.pkToSk[addr];
            if (acct !== undefined && addr === defaultAddr) {
                signed.push({ txID: txn.txID(), blob: txn.signTxn(acct) });
            }
            else {
                signed.push({ txID: '', blob: new Uint8Array() });
            }
        }
        return signed;
    }
}
exports.KMDWallet = KMDWallet;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia21kLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3dlYi93YWxsZXRzL2ttZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxzREFBOEI7QUFDOUIscUNBQXlEO0FBRXpELDZCQUFnQztBQUVoQyxNQUFhLFNBQVUsU0FBUSxlQUFNO0lBR25DLFlBQVksT0FBZSxFQUFFLElBQWdCO1FBQzNDLEtBQUssQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDckIsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7UUFFakIsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUN6QixJQUFJLEtBQUssS0FBSyxTQUFTLElBQUksT0FBTyxJQUFJLEtBQUssRUFBRTtZQUMzQyxLQUFLLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRTtnQkFDbkQsYUFBYTtnQkFDYixJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDO2FBQzNDO1NBQ0Y7SUFDSCxDQUFDO0lBRVEsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFrQjtRQUN2QyxJQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztRQUNuQixNQUFNLEtBQUssR0FBRyxNQUFNLFdBQU8sQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDaEQsS0FBSyxNQUFNLEdBQUcsSUFBSSxLQUFLLEVBQUU7WUFDdkIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxVQUFVLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ3ZELElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUM5QjtRQUNELE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVELE1BQU0sQ0FBVSxXQUFXO1FBQ3pCLE9BQU8sWUFBWSxDQUFDO0lBQ3RCLENBQUM7SUFFRCxXQUFXO1FBQ1QsT0FBTyxTQUFTLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDakMsQ0FBQztJQUVELDZEQUE2RDtJQUM3RCxNQUFNLENBQVUsR0FBRyxDQUFDLFNBQWtCO1FBQ3BDLE9BQU8sRUFBRSxDQUFDO0lBQ1osQ0FBQztJQUVELEdBQUcsQ0FBQyxRQUFpQjtRQUNuQixPQUFPLFNBQVMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDakMsQ0FBQztJQUVRLFVBQVU7UUFDakIsSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7UUFDbkIsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7SUFDbkIsQ0FBQztJQUNRLFNBQVM7UUFDaEIsTUFBTSxLQUFLLEdBQTJCLEVBQUUsQ0FBQztRQUN6QyxLQUFLLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDaEQsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUNyRDtRQUVELE9BQU87WUFDTCxRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVE7WUFDdkIsY0FBYyxFQUFFLElBQUksQ0FBQyxpQkFBaUI7WUFDdEMsS0FBSyxFQUFFLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRTtTQUN4QixDQUFDO0lBQ0osQ0FBQztJQUVRLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBMkI7UUFDN0MsTUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDO1FBQ2xCLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO1FBQzdDLEtBQUssTUFBTSxLQUFLLElBQUksSUFBSSxFQUFFO1lBQ3hCLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN4QixJQUFJLEdBQUcsS0FBSyxTQUFTO2dCQUFFLFNBQVM7WUFFaEMsTUFBTSxJQUFJLEdBQUcsaUJBQU8sQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUN2RCxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRS9CLElBQUksSUFBSSxLQUFLLFNBQVMsSUFBSSxJQUFJLEtBQUssV0FBVyxFQUFFO2dCQUM5QyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxFQUFFLEdBQUcsQ0FBQyxJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7YUFDNUQ7aUJBQU07Z0JBQ0wsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksVUFBVSxFQUFFLEVBQUUsQ0FBQyxDQUFDO2FBQ25EO1NBQ0Y7UUFDRCxPQUFPLE1BQU0sQ0FBQztJQUNoQixDQUFDO0NBQ0Y7QUE5RUQsOEJBOEVDIn0=