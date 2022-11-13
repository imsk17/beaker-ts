"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationClient = exports.ABIResult = exports.decodeNamedTuple = void 0;
const algosdk_1 = __importStar(require("algosdk"));
const generate_1 = require("../generate");
const logic_error_1 = require("./logic_error");
const state_1 = require("./state");
function decodeNamedTuple(v, keys) {
    if (v === undefined)
        return {};
    if (!Array.isArray(v))
        throw Error('Expected array');
    if (v.length != keys.length)
        throw Error('Different key length than value length');
    return Object.fromEntries(keys.map((key, idx) => {
        return [key, v[idx]];
    }));
}
exports.decodeNamedTuple = decodeNamedTuple;
class ABIResult {
    constructor(result, value) {
        this.txID = result.txID;
        this.rawReturnValue = result.rawReturnValue;
        this.method = result.method;
        this.decodeError = result.decodeError;
        this.txInfo = result.txInfo;
        this.returnValue = result.returnValue;
        this.inners = [];
        if ((result === null || result === void 0 ? void 0 : result.txInfo) !== undefined && 'inner-txns' in result.txInfo) {
            // TODO: this only parses 1 level deep
            const outer = result.txInfo['txn']['txn'];
            // eslint-disable-next-line
            this.inners = result.txInfo['inner-txns'].map((itxn) => {
                const et = itxn['txn']['txn'];
                et.gen = outer.gen;
                et.gh = outer.gh;
                return {
                    createdAsset: itxn['asset-index'],
                    createdApp: itxn['application-index'],
                    txn: algosdk_1.default.Transaction.from_obj_for_encoding(itxn['txn']['txn']),
                };
            });
        }
        this.value = value;
    }
}
exports.ABIResult = ABIResult;
class ApplicationClient {
    constructor(opts) {
        this.client = opts.client;
        if (opts.appId !== undefined) {
            this.appId = opts.appId;
            this.appAddress = algosdk_1.default.getApplicationAddress(opts.appId);
        }
        else {
            this.appId = 0;
            this.appAddress = '';
        }
        this.sender = opts.sender;
        this.signer = opts.signer;
    }
    async compile(program) {
        const result = await this.client.compile(program).sourcemap(true).do();
        return [
            new Uint8Array(Buffer.from(result['result'], 'base64')),
            new algosdk_1.default.SourceMap(result['sourcemap']),
        ];
    }
    async ensurePrograms() {
        if (this.approvalProgram === undefined || this.clearProgram === undefined)
            throw Error('no approval or clear program defined');
        if (this.approvalProgramBinary === undefined) {
            const [appBin, appMap] = await this.compile(Buffer.from(this.approvalProgram, 'base64').toString());
            this.approvalProgramBinary = appBin;
            this.approvalProgramMap = appMap;
        }
        if (this.clearProgramBinary === undefined) {
            const [clearBin, clearMap] = await this.compile(Buffer.from(this.clearProgram, 'base64').toString());
            this.clearProgramBinary = clearBin;
            this.clearProgramMap = clearMap;
        }
    }
    async create(txParams) {
        await this.ensurePrograms();
        if (this.approvalProgramBinary === undefined ||
            this.clearProgramBinary === undefined)
            throw Error('no approval or clear program binaries defined');
        if (this.signer === undefined)
            throw Error('no signer defined');
        const sp = await this.getSuggestedParams(txParams);
        const atc = new algosdk_1.default.AtomicTransactionComposer();
        atc.addTransaction({
            txn: algosdk_1.default.makeApplicationCreateTxnFromObject(Object.assign(Object.assign(Object.assign({ from: this.getSender(), suggestedParams: sp, onComplete: algosdk_1.default.OnApplicationComplete.NoOpOC, approvalProgram: this.approvalProgramBinary, clearProgram: this.clearProgramBinary }, this.getGlobalSchema()), this.getLocalSchema()), txParams)),
            signer: this.signer,
        });
        try {
            const result = await atc.execute(this.client, 4);
            const txid = result.txIDs[0];
            if (txid === undefined)
                throw new Error('No transaction id returned from execute');
            const txinfo = await this.client.pendingTransactionInformation(txid).do();
            this.appId = txinfo['application-index'];
            this.appAddress = algosdk_1.default.getApplicationAddress(this.appId);
            return { appId: this.appId, appAddress: this.appAddress, txId: txid };
        }
        catch (e) {
            throw this.wrapLogicError(e);
        }
    }
    async delete(txParams) {
        if (this.signer === undefined)
            throw Error('no signer defined');
        const sp = await this.getSuggestedParams(txParams);
        const atc = new algosdk_1.default.AtomicTransactionComposer();
        atc.addTransaction({
            txn: algosdk_1.default.makeApplicationCallTxnFromObject(Object.assign({ from: this.getSender(), suggestedParams: sp, onComplete: algosdk_1.default.OnApplicationComplete.DeleteApplicationOC, appIndex: this.appId }, txParams)),
            signer: this.signer,
        });
        try {
            return atc.execute(this.client, 4);
        }
        catch (e) {
            throw this.wrapLogicError(e);
        }
    }
    async update(txParams) {
        await this.ensurePrograms();
        if (this.approvalProgramBinary === undefined ||
            this.clearProgramBinary === undefined)
            throw Error('no approval or clear program binaries defined');
        if (this.signer === undefined)
            throw Error('no signer defined');
        const sp = await this.getSuggestedParams(txParams);
        const atc = new algosdk_1.default.AtomicTransactionComposer();
        atc.addTransaction({
            txn: algosdk_1.default.makeApplicationUpdateTxnFromObject(Object.assign({ from: this.getSender(), suggestedParams: sp, approvalProgram: this.approvalProgramBinary, clearProgram: this.clearProgramBinary, appIndex: this.appId }, txParams)),
            signer: this.signer,
        });
        try {
            return await atc.execute(this.client, 4);
        }
        catch (e) {
            throw this.wrapLogicError(e);
        }
    }
    async optIn(txParams) {
        if (this.signer === undefined)
            throw Error('no signer defined');
        const sp = await this.getSuggestedParams(txParams);
        const atc = new algosdk_1.default.AtomicTransactionComposer();
        atc.addTransaction({
            txn: algosdk_1.default.makeApplicationOptInTxnFromObject(Object.assign({ from: this.getSender(), suggestedParams: sp, appIndex: this.appId }, txParams)),
            signer: this.signer,
        });
        try {
            return await atc.execute(this.client, 4);
        }
        catch (e) {
            throw this.wrapLogicError(e);
        }
    }
    async closeOut(txParams) {
        if (this.signer === undefined)
            throw Error('no signer defined');
        const sp = await this.getSuggestedParams(txParams);
        const atc = new algosdk_1.default.AtomicTransactionComposer();
        atc.addTransaction({
            txn: algosdk_1.default.makeApplicationCloseOutTxnFromObject(Object.assign({ from: this.getSender(), suggestedParams: sp, appIndex: this.appId }, txParams)),
            signer: this.signer,
        });
        try {
            return await atc.execute(this.client, 4);
        }
        catch (e) {
            throw this.wrapLogicError(e);
        }
    }
    async clearState(txParams) {
        if (this.signer === undefined)
            throw Error('no signer defined');
        const sp = await this.getSuggestedParams(txParams);
        const atc = new algosdk_1.default.AtomicTransactionComposer();
        atc.addTransaction({
            txn: algosdk_1.default.makeApplicationClearStateTxnFromObject({
                from: this.getSender(),
                suggestedParams: sp,
                appIndex: this.appId,
            }),
            signer: this.signer,
        });
        try {
            return await atc.execute(this.client, 4);
        }
        catch (e) {
            throw this.wrapLogicError(e);
        }
    }
    async execute(atc) {
        try {
            const result = await atc.execute(this.client, 4);
            return result.methodResults[0]
                ? result.methodResults[0]
                : {};
        }
        catch (e) {
            throw this.wrapLogicError(e);
        }
    }
    async addMethodCall(method, args, txParams, atc) {
        if (atc === undefined) {
            atc = new algosdk_1.default.AtomicTransactionComposer();
        }
        if (this.signer === undefined)
            throw new Error('no signer defined');
        const sp = await this.getSuggestedParams(txParams);
        const processedArgs = [];
        for (const expected_arg of method.args) {
            if (args === undefined)
                throw new Error(`No args passed, expected ${method.args}`);
            if (expected_arg.name === undefined || !(expected_arg.name in args)) {
                // Error! (or check hints)
                throw new Error(`Cant find required argument: ${expected_arg.name}`);
            }
            let arg = args[expected_arg.name];
            if (arg instanceof algosdk_1.default.Transaction) {
                arg = {
                    txn: arg,
                    signer: this.signer,
                };
            }
            else if (arg instanceof Uint8Array) {
                // TODO: other types?
                if (expected_arg.type instanceof algosdk_1.default.ABIAddressType ||
                    expected_arg.type == algosdk_1.ABIReferenceType.account) {
                    arg = algosdk_1.default.encodeAddress(arg);
                }
            }
            else if (arg instanceof Object &&
                !algosdk_1.default.isTransactionWithSigner(arg)) {
                arg = Object.values(arg);
            }
            processedArgs.push(arg);
        }
        atc.addMethodCall(Object.assign({ appID: this.appId, method: method, methodArgs: processedArgs, sender: this.getSender(), suggestedParams: sp, signer: this.signer }, txParams));
        return atc;
    }
    wrapLogicError(e) {
        if (this.approvalProgram === undefined ||
            this.approvalProgramMap == undefined)
            return e;
        const led = (0, logic_error_1.parseLogicError)(e.message);
        if (led.msg !== undefined)
            return new logic_error_1.LogicError(led, Buffer.from(this.approvalProgram, 'base64').toString().split('\n'), this.approvalProgramMap);
        else
            return e;
    }
    async resolve(source, data) {
        let val;
        switch (source) {
            case 'global-state':
                // Use the raw return value, so encode the key as hex since
                // that is what we get back from the call to getAppState
                const appState = await this.getApplicationState(true);
                const key = Buffer.from(data).toString('hex');
                val = appState[key];
                if (val === undefined)
                    throw new Error(`no global state value: ${data}`);
                return val;
            case 'local-state':
                // TODO: how do we pass in which account to resolve against ?
                // This assumes the current client sender
                const acctState = await this.getAccountState();
                val = acctState[data];
                if (val === undefined)
                    throw new Error(`no global state value: ${data}`);
                return val;
            case 'abi-method':
                // TODO: args?
                if (this.methods === undefined)
                    throw new Error('no methods defined, cannot resolve hint');
                const meth = algosdk_1.default.getMethodByName(this.methods, data);
                return this.execute(await this.addMethodCall(meth, undefined));
            default:
                return data;
        }
    }
    async getSuggestedParams(txParams, coverInners) {
        let params;
        if (txParams !== undefined && txParams.suggestedParams !== undefined) {
            params = txParams.suggestedParams;
        }
        else {
            params = await this.client.getTransactionParams().do();
        }
        if (coverInners !== undefined) {
            params.flatFee = true;
            params.fee = 1000 * coverInners;
        }
        return params;
    }
    async getApplicationState(raw) {
        const appInfo = await this.client.getApplicationByID(this.appId).do();
        if (!('params' in appInfo) || !('global-state' in appInfo['params']))
            throw new Error('No global state found');
        return (0, state_1.decodeState)(appInfo['params']['global-state'], raw);
    }
    async getAccountState(address, raw) {
        if (address === undefined)
            address = this.getSender();
        const acctInfo = await this.client
            .accountApplicationInformation(address, this.appId)
            .do();
        if (!('app-local-state' in acctInfo) ||
            !('key-value' in acctInfo['app-local-state']))
            return {};
        return (0, state_1.decodeState)(acctInfo['app-local-state']['key-value'], raw);
    }
    getSender() {
        return this.sender;
    }
    getLocalSchema() {
        if (this.acctSchema === undefined)
            throw new Error('No account schema defined');
        const s = (0, generate_1.getStateSchema)(this.acctSchema);
        return { numLocalInts: s.uints, numLocalByteSlices: s.bytes };
    }
    getGlobalSchema() {
        if (this.appSchema === undefined)
            throw new Error('No app schema defined');
        const s = (0, generate_1.getStateSchema)(this.appSchema);
        return { numGlobalInts: s.uints, numGlobalByteSlices: s.bytes };
    }
}
exports.ApplicationClient = ApplicationClient;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwbGljYXRpb25fY2xpZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2FwcGxpY2F0aW9uX2NsaWVudC9hcHBsaWNhdGlvbl9jbGllbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxtREFBK0U7QUFFL0UsMENBQXFEO0FBQ3JELCtDQUE0RDtBQUM1RCxtQ0FBc0U7QUFnQnRFLFNBQWdCLGdCQUFnQixDQUM5QixDQUErQixFQUMvQixJQUFjO0lBRWQsSUFBSSxDQUFDLEtBQUssU0FBUztRQUFFLE9BQU8sRUFBRSxDQUFDO0lBQy9CLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUFFLE1BQU0sS0FBSyxDQUFDLGdCQUFnQixDQUFDLENBQUM7SUFDckQsSUFBSSxDQUFDLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxNQUFNO1FBQ3pCLE1BQU0sS0FBSyxDQUFDLHdDQUF3QyxDQUFDLENBQUM7SUFFeEQsT0FBTyxNQUFNLENBQUMsV0FBVyxDQUN2QixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFO1FBQ3BCLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDdkIsQ0FBQyxDQUFDLENBQ0gsQ0FBQztBQUNKLENBQUM7QUFkRCw0Q0FjQztBQVFELE1BQWEsU0FBUztJQVdwQixZQUFZLE1BQXlCLEVBQUUsS0FBUztRQUM5QyxJQUFJLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDeEIsSUFBSSxDQUFDLGNBQWMsR0FBRyxNQUFNLENBQUMsY0FBYyxDQUFDO1FBQzVDLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUM1QixJQUFJLENBQUMsV0FBVyxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUM7UUFDdEMsSUFB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