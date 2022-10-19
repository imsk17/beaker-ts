import algosdk from "algosdk";
import * as bkr from "../../src/";
export class ExpensiveApp extends bkr.ApplicationClient {
    desc: string = "";
    override appSchema: bkr.Schema = { declared: { opup_app_id: { type: bkr.AVMType.uint64, key: "ouaid", desc: "", static: false } }, reserved: {} };
    override acctSchema: bkr.Schema = { declared: {}, reserved: {} };
    override approvalProgram: string = "I3ByYWdtYSB2ZXJzaW9uIDcKaW50Y2Jsb2NrIDAgMSA2CmJ5dGVjYmxvY2sgMHg2Zjc1NjE2OTY0IDB4MTUxZjdjNzUgMHg0YzZiZWE3Mgp0eG4gTnVtQXBwQXJncwppbnRjXzAgLy8gMAo9PQpibnogbWFpbl9sNgp0eG5hIEFwcGxpY2F0aW9uQXJncyAwCnB1c2hieXRlcyAweDYyMjhjNjgyIC8vICJoYXNoX2l0KHN0cmluZyx1aW50NjQsYXBwbGljYXRpb24pYnl0ZVszMl0iCj09CmJueiBtYWluX2w1CnR4bmEgQXBwbGljYXRpb25BcmdzIDAKcHVzaGJ5dGVzIDB4MTAxY2VhMDAgLy8gIm9wdXBfYm9vdHN0cmFwKHBheSl1aW50NjQiCj09CmJueiBtYWluX2w0CmVycgptYWluX2w0Ogp0eG4gT25Db21wbGV0aW9uCmludGNfMCAvLyBOb09wCj09CnR4biBBcHBsaWNhdGlvbklECmludGNfMCAvLyAwCiE9CiYmCmFzc2VydAp0eG4gR3JvdXBJbmRleAppbnRjXzEgLy8gMQotCnN0b3JlIDkKbG9hZCA5Cmd0eG5zIFR5cGVFbnVtCmludGNfMSAvLyBwYXkKPT0KYXNzZXJ0CmxvYWQgOQpjYWxsc3ViIG9wdXBib290c3RyYXBfNApzdG9yZSAxMApieXRlY18xIC8vIDB4MTUxZjdjNzUKbG9hZCAxMAppdG9iCmNvbmNhdApsb2cKaW50Y18xIC8vIDEKcmV0dXJuCm1haW5fbDU6CnR4biBPbkNvbXBsZXRpb24KaW50Y18wIC8vIE5vT3AKPT0KdHhuIEFwcGxpY2F0aW9uSUQKaW50Y18wIC8vIDAKIT0KJiYKYXNzZXJ0CnR4bmEgQXBwbGljYXRpb25BcmdzIDEKc3RvcmUgMAp0eG5hIEFwcGxpY2F0aW9uQXJncyAyCmJ0b2kKc3RvcmUgMQp0eG5hIEFwcGxpY2F0aW9uQXJncyAzCmludGNfMCAvLyAwCmdldGJ5dGUKc3RvcmUgMgpsb2FkIDAKbG9hZCAxCmxvYWQgMgpjYWxsc3ViIGhhc2hpdF8zCnN0b3JlIDMKYnl0ZWNfMSAvLyAweDE1MWY3Yzc1CmxvYWQgMwpjb25jYXQKbG9nCmludGNfMSAvLyAxCnJldHVybgptYWluX2w2Ogp0eG4gT25Db21wbGV0aW9uCmludGNfMCAvLyBOb09wCj09CmJueiBtYWluX2w4CmVycgptYWluX2w4Ogp0eG4gQXBwbGljYXRpb25JRAppbnRjXzAgLy8gMAo9PQphc3NlcnQKY2FsbHN1YiBjcmVhdGVfMAppbnRjXzEgLy8gMQpyZXR1cm4KCi8vIGNyZWF0ZQpjcmVhdGVfMDoKaW50Y18xIC8vIDEKcmV0dXJuCgovLyBjYWxsX29wdXAKY2FsbG9wdXBfMToKc3RvcmUgMTEKbG9hZCAxMQppbnRjXzEgLy8gMQo9PQpibnogY2FsbG9wdXBfMV9sNAppbnRjXzAgLy8gMApzdG9yZSAxMgpjYWxsb3B1cF8xX2wyOgpsb2FkIDEyCmxvYWQgMTEKPApieiBjYWxsb3B1cF8xX2w1Cml0eG5fYmVnaW4KaW50Y18yIC8vIGFwcGwKaXR4bl9maWVsZCBUeXBlRW51bQpieXRlY18wIC8vICJvdWFpZCIKYXBwX2dsb2JhbF9nZXQKaXR4bl9maWVsZCBBcHBsaWNhdGlvbklECmJ5dGVjXzIgLy8gIm9wdXAoKXZvaWQiCml0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCmludGNfMCAvLyAwCml0eG5fZmllbGQgRmVlCml0eG5fc3VibWl0CmxvYWQgMTIKaW50Y18xIC8vIDEKKwpzdG9yZSAxMgpiIGNhbGxvcHVwXzFfbDIKY2FsbG9wdXBfMV9sNDoKaXR4bl9iZWdpbgppbnRjXzIgLy8gYXBwbAppdHhuX2ZpZWxkIFR5cGVFbnVtCmJ5dGVjXzAgLy8gIm91YWlkIgphcHBfZ2xvYmFsX2dldAppdHhuX2ZpZWxkIEFwcGxpY2F0aW9uSUQKYnl0ZWNfMiAvLyAib3B1cCgpdm9pZCIKaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKaW50Y18wIC8vIDAKaXR4bl9maWVsZCBGZWUKaXR4bl9zdWJtaXQKY2FsbG9wdXBfMV9sNToKcmV0c3ViCgovLyBjcmVhdGVfb3B1cApjcmVhdGVvcHVwXzI6Cml0eG5fYmVnaW4KaW50Y18yIC8vIGFwcGwKaXR4bl9maWVsZCBUeXBlRW51bQpwdXNoYnl0ZXMgMHgwNzIwMDIwMDAxMzExYjIyMTI0MDAwMWQzNjFhMDA4MDA0NGM2YmVhNzIxMjQwMDAwMTAwMzExOTIyMTIzMTE4MjIxMzEwNDQ4ODAwMWEyMzQzMzExOTIyMTI0MDAwMDEwMDMxMTgyMjEyNDQ4ODAwMDIyMzQzMjM0MzMyMDkxMjg5MzEwMDg4ZmZmNzQ0MjM0MyAvLyAweDA3MjAwMjAwMDEzMTFiMjIxMjQwMDAxZDM2MWEwMDgwMDQ0YzZiZWE3MjEyNDAwMDAxMDAzMTE5MjIxMjMxMTgyMjEzMTA0NDg4MDAxYTIzNDMzMTE5MjIxMjQwMDAwMTAwMzExODIyMTI0NDg4MDAwMjIzNDMyMzQzMzIwOTEyODkzMTAwODhmZmY3NDQyMzQzCml0eG5fZmllbGQgQXBwcm92YWxQcm9ncmFtCnB1c2hieXRlcyAweDA3ODEwMDQzIC8vIDB4MDc4MTAwNDMKaXR4bl9maWVsZCBDbGVhclN0YXRlUHJvZ3JhbQppbnRjXzAgLy8gMAppdHhuX2ZpZWxkIEZlZQppdHhuX3N1Ym1pdAppbnRjXzAgLy8gMApieXRlY18wIC8vICJvdWFpZCIKYXBwX2dsb2JhbF9nZXRfZXgKc3RvcmUgMTQKc3RvcmUgMTMKbG9hZCAxNAohCmFzc2VydApieXRlY18wIC8vICJvdWFpZCIKaXR4biBDcmVhdGVkQXBwbGljYXRpb25JRAphcHBfZ2xvYmFsX3B1dApyZXRzdWIKCi8vIGhhc2hfaXQKaGFzaGl0XzM6CnN0b3JlIDYKc3RvcmUgNQpzdG9yZSA0CmxvYWQgNgp0eG5hcyBBcHBsaWNhdGlvbnMKYnl0ZWNfMCAvLyAib3VhaWQiCmFwcF9nbG9iYWxfZ2V0Cj09CmFzc2VydApwdXNoaW50IDI1NSAvLyAyNTUKY2FsbHN1YiBjYWxsb3B1cF8xCmxvYWQgNApleHRyYWN0IDIgMApzdG9yZSA3CmludGNfMCAvLyAwCnN0b3JlIDgKaGFzaGl0XzNfbDE6CmxvYWQgOApsb2FkIDUKPApieiBoYXNoaXRfM19sMwpsb2FkIDcKc2hhMjU2CnN0b3JlIDcKbG9hZCA4CmludGNfMSAvLyAxCisKc3RvcmUgOApiIGhhc2hpdF8zX2wxCmhhc2hpdF8zX2wzOgpsb2FkIDcKcmV0c3ViCgovLyBvcHVwX2Jvb3RzdHJhcApvcHVwYm9vdHN0cmFwXzQ6Cmd0eG5zIEFtb3VudApwdXNoaW50IDEwMDAwMCAvLyAxMDAwMDAKPj0KYXNzZXJ0CmNhbGxzdWIgY3JlYXRlb3B1cF8yCmJ5dGVjXzAgLy8gIm91YWlkIgphcHBfZ2xvYmFsX2dldApyZXRzdWI=";
    override clearProgram: string = "I3ByYWdtYSB2ZXJzaW9uIDcKcHVzaGludCAwIC8vIDAKcmV0dXJu";
    override methods: algosdk.ABIMethod[] = [
        new algosdk.ABIMethod({ name: "hash_it", desc: "", args: [{ type: "string", name: "input", desc: "" }, { type: "uint64", name: "iters", desc: "" }, { type: "application", name: "opup_app", desc: "" }], returns: { type: "byte[32]", desc: "" } }),
        new algosdk.ABIMethod({ name: "opup_bootstrap", desc: "", args: [{ type: "pay", name: "ptxn", desc: "" }], returns: { type: "uint64", desc: "" } })
    ];
    async hash_it(args: {
        input: string;
        iters: bigint;
        opup_app?: bigint;
    }, txnParams?: bkr.TransactionOverrides): Promise<bkr.ABIResult<Uint8Array>> {
        const result = await this.execute(await this.compose.hash_it({ input: args.input, iters: args.iters, opup_app: args.opup_app === undefined ? await this.resolve("global-state", "ouaid") as bigint : args.opup_app }, txnParams));
        return new bkr.ABIResult<Uint8Array>(result, result.returnValue as Uint8Array);
    }
    async opup_bootstrap(args: {
        ptxn: algosdk.TransactionWithSigner | algosdk.Transaction;
    }, txnParams?: bkr.TransactionOverrides): Promise<bkr.ABIResult<bigint>> {
        const result = await this.execute(await this.compose.opup_bootstrap({ ptxn: args.ptxn }, txnParams));
        return new bkr.ABIResult<bigint>(result, result.returnValue as bigint);
    }
    compose = {
        hash_it: async (args: {
            input: string;
            iters: bigint;
            opup_app?: bigint;
        }, txnParams?: bkr.TransactionOverrides, atc?: algosdk.AtomicTransactionComposer): Promise<algosdk.AtomicTransactionComposer> => {
            return this.addMethodCall(algosdk.getMethodByName(this.methods, "hash_it"), { input: args.input, iters: args.iters, opup_app: args.opup_app === undefined ? await this.resolve("global-state", "ouaid") : args.opup_app }, txnParams, atc);
        },
        opup_bootstrap: async (args: {
            ptxn: algosdk.TransactionWithSigner | algosdk.Transaction;
        }, txnParams?: bkr.TransactionOverrides, atc?: algosdk.AtomicTransactionComposer): Promise<algosdk.AtomicTransactionComposer> => {
            return this.addMethodCall(algosdk.getMethodByName(this.methods, "opup_bootstrap"), { ptxn: args.ptxn }, txnParams, atc);
        }
    };
}
