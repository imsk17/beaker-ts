"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const algosdk_1 = __importDefault(require("algosdk"));
const wallet_1 = require("./wallet");
const client_1 = __importDefault(require("@walletconnect/client"));
const algorand_walletconnect_qrcode_modal_1 = __importDefault(require("algorand-walletconnect-qrcode-modal"));
const utils_1 = require("@json-rpc-tools/utils");
const logo = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIwIDIwSDE3LjUwNDdMMTUuODY5MyAxMy45NkwxMi4zNjI1IDIwSDkuNTYzNzVMMTQuOTc1OCAxMC42NDU2TDE0LjA5OTEgNy4zODE3TDYuNzk4NzQgMjBINEwxMy4yNTYxIDRIMTUuNzE3NkwxNi43Nzk4IDcuOTg3MzhIMTkuMzA4N0wxNy41ODkgMTAuOTgyMUwyMCAyMFoiIGZpbGw9IiMyQjJCMkYiLz4KPC9zdmc+Cg==';
class WC extends wallet_1.Wallet {
    constructor(network, data) {
        super(network, data);
        const bridge = 'https://bridge.walletconnect.org';
        this.connector = new client_1.default({
            bridge,
            qrcodeModal: algorand_walletconnect_qrcode_modal_1.default,
        });
    }
    async connect(cb) {
        // Check if connection is already established
        if (this.connector.connected)
            return true;
        this.connector.createSession();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.connector.on('connect', (error, payload) => {
            if (error) {
                throw error;
            }
            const { accounts } = payload.params[0];
            this.accounts = accounts;
            cb();
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.connector.on('session_update', (error, payload) => {
            if (error) {
                throw error;
            }
            const { accounts } = payload.params[0];
            this.accounts = accounts;
            cb();
        });
        this.connector.on('disconnect', (error) => {
            if (error)
                throw error;
        });
        return await this.waitForConnected();
    }
    async waitForConnected() {
        return new Promise((resolve) => {
            const reconn = setInterval(() => {
                if (this.connector.connected) {
                    clearInterval(reconn);
                    resolve(true);
                    return;
                }
                this.connector.connect();
            }, 100);
        });
    }
    static displayName() {
        return 'Wallet Connect';
    }
    displayName() {
        return WC.displayName();
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    static img(_inverted) {
        return logo;
    }
    img(inverted) {
        return WC.img(inverted);
    }
    isConnected() {
        return this.connector.connected;
    }
    disconnect() {
        this.accounts = [];
        this.defaultAccountIdx = 0;
        this.connector.killSession();
    }
    async sign(txns) {
        const defaultAddress = this.getDefaultAddress();
        const txnsToSign = txns.map((txn) => {
            const encodedTxn = Buffer.from(algosdk_1.default.encodeUnsignedTransaction(txn)).toString('base64');
            if (algosdk_1.default.encodeAddress(txn.from.publicKey) !== defaultAddress)
                return { txn: encodedTxn, signers: [] };
            return { txn: encodedTxn };
        });
        const request = (0, utils_1.formatJsonRpcRequest)('algo_signTxn', [txnsToSign]);
        const result = await this.connector.sendCustomRequest(request);
        return result.map((element, idx) => {
            const txn = txns[idx];
            if (txn === undefined)
                return { txID: '', blob: new Uint8Array() };
            return element
                ? {
                    txID: txn.txID(),
                    blob: new Uint8Array(Buffer.from(element, 'base64')),
                }
                : {
                    txID: txn.txID(),
                    blob: new Uint8Array(),
                };
        });
    }
}
exports.default = WC;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FsbGV0Y29ubmVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy93ZWIvd2FsbGV0cy93YWxsZXRjb25uZWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsc0RBQStDO0FBQy9DLHFDQUF5RDtBQUV6RCxtRUFBa0Q7QUFDbEQsOEdBQTJFO0FBQzNFLGlEQUE2RDtBQUU3RCxNQUFNLElBQUksR0FDUiw0WkFBNFosQ0FBQztBQUUvWixNQUFNLEVBQUcsU0FBUSxlQUFNO0lBR3JCLFlBQVksT0FBZSxFQUFFLElBQWdCO1FBQzNDLEtBQUssQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDckIsTUFBTSxNQUFNLEdBQUcsa0NBQWtDLENBQUM7UUFDbEQsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLGdCQUFhLENBQUM7WUFDakMsTUFBTTtZQUNOLFdBQVcsRUFBRSw2Q0FBd0I7U0FDdEMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVRLEtBQUssQ0FBQyxPQUFPLENBQUMsRUFBYztRQUNuQyw2Q0FBNkM7UUFDN0MsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVM7WUFBRSxPQUFPLElBQUksQ0FBQztRQUUxQyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBRS9CLDhEQUE4RDtRQUM5RCxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxLQUFtQixFQUFFLE9BQVksRUFBRSxFQUFFO1lBQ2pFLElBQUksS0FBSyxFQUFFO2dCQUNULE1BQU0sS0FBSyxDQUFDO2FBQ2I7WUFDRCxNQUFNLEVBQUUsUUFBUSxFQUFFLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN2QyxJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztZQUN6QixFQUFFLEVBQUUsQ0FBQztRQUNQLENBQUMsQ0FBQyxDQUFDO1FBRUgsOERBQThEO1FBQzlE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