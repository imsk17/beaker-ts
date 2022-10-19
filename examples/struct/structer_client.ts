import algosdk from "algosdk";
import * as bkr from "../../src/";
export class Order {
    item: string = "";
    quantity: bigint = BigInt(0);
    static codec: algosdk.ABIType = algosdk.ABIType.from("(string,uint16)");
    static fields: string[] = ["item", "quantity"];
    static decodeResult(val: algosdk.ABIValue | undefined): Order {
        return bkr.decodeNamedTuple(val, Order.fields) as Order;
    }
    static decodeBytes(val: Uint8Array): Order {
        return bkr.decodeNamedTuple(Order.codec.decode(val), Order.fields) as Order;
    }
}
export class Structer extends bkr.ApplicationClient {
    desc: string = "";
    override appSchema: bkr.Schema = { declared: {}, reserved: {} };
    override acctSchema: bkr.Schema = { declared: {}, reserved: { orders: { type: bkr.AVMType.bytes, desc: "", max_keys: 16 } } };
    override approvalProgram: string = "I3ByYWdtYSB2ZXJzaW9uIDcKaW50Y2Jsb2NrIDAgMQpieXRlY2Jsb2NrIDB4MDAgMHgxNTFmN2M3NQp0eG4gTnVtQXBwQXJncwppbnRjXzAgLy8gMAo9PQpibnogbWFpbl9sOAp0eG5hIEFwcGxpY2F0aW9uQXJncyAwCnB1c2hieXRlcyAweGY0YjA1N2Q5IC8vICJpbmNyZWFzZV9xdWFudGl0eSh1aW50OCkoc3RyaW5nLHVpbnQxNikiCj09CmJueiBtYWluX2w3CnR4bmEgQXBwbGljYXRpb25BcmdzIDAKcHVzaGJ5dGVzIDB4YTRlOGQ3OTUgLy8gInBsYWNlX29yZGVyKHVpbnQ4LChzdHJpbmcsdWludDE2KSl2b2lkIgo9PQpibnogbWFpbl9sNgp0eG5hIEFwcGxpY2F0aW9uQXJncyAwCnB1c2hieXRlcyAweDNmY2EzYTQ5IC8vICJyZWFkX2l0ZW0odWludDgpKHN0cmluZyx1aW50MTYpIgo9PQpibnogbWFpbl9sNQplcnIKbWFpbl9sNToKdHhuIE9uQ29tcGxldGlvbgppbnRjXzAgLy8gTm9PcAo9PQp0eG4gQXBwbGljYXRpb25JRAppbnRjXzAgLy8gMAohPQomJgphc3NlcnQKdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQppbnRjXzAgLy8gMApnZXRieXRlCmNhbGxzdWIgcmVhZGl0ZW1fNApzdG9yZSA3CmJ5dGVjXzEgLy8gMHgxNTFmN2M3NQpsb2FkIDcKY29uY2F0CmxvZwppbnRjXzEgLy8gMQpyZXR1cm4KbWFpbl9sNjoKdHhuIE9uQ29tcGxldGlvbgppbnRjXzAgLy8gTm9PcAo9PQp0eG4gQXBwbGljYXRpb25JRAppbnRjXzAgLy8gMAohPQomJgphc3NlcnQKdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQppbnRjXzAgLy8gMApnZXRieXRlCnN0b3JlIDUKdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMgpzdG9yZSA2CmxvYWQgNQpsb2FkIDYKY2FsbHN1YiBwbGFjZW9yZGVyXzMKaW50Y18xIC8vIDEKcmV0dXJuCm1haW5fbDc6CnR4biBPbkNvbXBsZXRpb24KaW50Y18wIC8vIE5vT3AKPT0KdHhuIEFwcGxpY2F0aW9uSUQKaW50Y18wIC8vIDAKIT0KJiYKYXNzZXJ0CnR4bmEgQXBwbGljYXRpb25BcmdzIDEKaW50Y18wIC8vIDAKZ2V0Ynl0ZQpjYWxsc3ViIGluY3JlYXNlcXVhbnRpdHlfMgpzdG9yZSAwCmJ5dGVjXzEgLy8gMHgxNTFmN2M3NQpsb2FkIDAKY29uY2F0CmxvZwppbnRjXzEgLy8gMQpyZXR1cm4KbWFpbl9sODoKdHhuIE9uQ29tcGxldGlvbgppbnRjXzAgLy8gTm9PcAo9PQpibnogbWFpbl9sMTIKdHhuIE9uQ29tcGxldGlvbgppbnRjXzEgLy8gT3B0SW4KPT0KYm56IG1haW5fbDExCmVycgptYWluX2wxMToKdHhuIEFwcGxpY2F0aW9uSUQKaW50Y18wIC8vIDAKIT0KYXNzZXJ0CmNhbGxzdWIgb3B0aW5fMQppbnRjXzEgLy8gMQpyZXR1cm4KbWFpbl9sMTI6CnR4biBBcHBsaWNhdGlvbklECmludGNfMCAvLyAwCj09CmFzc2VydApjYWxsc3ViIGNyZWF0ZV8wCmludGNfMSAvLyAxCnJldHVybgoKLy8gY3JlYXRlCmNyZWF0ZV8wOgppbnRjXzEgLy8gMQpyZXR1cm4KCi8vIG9wdF9pbgpvcHRpbl8xOgpyZXRzdWIKCi8vIGluY3JlYXNlX3F1YW50aXR5CmluY3JlYXNlcXVhbnRpdHlfMjoKc3RvcmUgMQp0eG4gU2VuZGVyCmJ5dGVjXzAgLy8gMHgwMAppbnRjXzAgLy8gMApsb2FkIDEKc2V0Ynl0ZQphcHBfbG9jYWxfZ2V0CnN0b3JlIDIKbG9hZCAyCnB1c2hpbnQgMiAvLyAyCmV4dHJhY3RfdWludDE2CnN0b3JlIDMKbG9hZCAzCmludGNfMSAvLyAxCisKc3RvcmUgMwpsb2FkIDMKcHVzaGludCA2NTUzNiAvLyA2NTUzNgo8CmFzc2VydApsb2FkIDIKbG9hZCAyCmludGNfMCAvLyAwCmV4dHJhY3RfdWludDE2CmRpZyAxCmxlbgpzdWJzdHJpbmczCnN0b3JlIDQKcHVzaGludCA0IC8vIDQKaXRvYgpleHRyYWN0IDYgMApsb2FkIDMKaXRvYgpleHRyYWN0IDYgMApjb25jYXQKbG9hZCA0CmNvbmNhdApzdG9yZSAyCnR4biBTZW5kZXIKYnl0ZWNfMCAvLyAweDAwCmludGNfMCAvLyAwCmxvYWQgMQpzZXRieXRlCmxvYWQgMgphcHBfbG9jYWxfcHV0CmxvYWQgMgpyZXRzdWIKCi8vIHBsYWNlX29yZGVyCnBsYWNlb3JkZXJfMzoKc3RvcmUgMTAKc3RvcmUgOQp0eG4gU2VuZGVyCmJ5dGVjXzAgLy8gMHgwMAppbnRjXzAgLy8gMApsb2FkIDkKc2V0Ynl0ZQpsb2FkIDEwCmFwcF9sb2NhbF9wdXQKcmV0c3ViCgovLyByZWFkX2l0ZW0KcmVhZGl0ZW1fNDoKc3RvcmUgOAp0eG4gU2VuZGVyCmJ5dGVjXzAgLy8gMHgwMAppbnRjXzAgLy8gMApsb2FkIDgKc2V0Ynl0ZQphcHBfbG9jYWxfZ2V0CnJldHN1Yg==";
    override clearProgram: string = "I3ByYWdtYSB2ZXJzaW9uIDcKcHVzaGludCAwIC8vIDAKcmV0dXJu";
    override methods: algosdk.ABIMethod[] = [
        new algosdk.ABIMethod({ name: "increase_quantity", desc: "", args: [{ type: "uint8", name: "order_number", desc: "" }], returns: { type: "(string,uint16)", desc: "" } }),
        new algosdk.ABIMethod({ name: "place_order", desc: "", args: [{ type: "uint8", name: "order_number", desc: "" }, { type: "(string,uint16)", name: "order", desc: "" }], returns: { type: "void", desc: "" } }),
        new algosdk.ABIMethod({ name: "read_item", desc: "", args: [{ type: "uint8", name: "order_number", desc: "" }], returns: { type: "(string,uint16)", desc: "" } })
    ];
    async increase_quantity(args: {
        order_number: bigint;
    }, txnParams?: bkr.TransactionOverrides): Promise<bkr.ABIResult<Order>> {
        const result = await this.execute(await this.compose.increase_quantity({ order_number: args.order_number }, txnParams));
        return new bkr.ABIResult<Order>(result, Order.decodeResult(result.returnValue));
    }
    async place_order(args: {
        order_number: bigint;
        order: Order;
    }, txnParams?: bkr.TransactionOverrides): Promise<bkr.ABIResult<void>> {
        const result = await this.execute(await this.compose.place_order({ order_number: args.order_number, order: args.order }, txnParams));
        return new bkr.ABIResult<void>(result);
    }
    async read_item(args: {
        order_number: bigint;
    }, txnParams?: bkr.TransactionOverrides): Promise<bkr.ABIResult<Order>> {
        const result = await this.execute(await this.compose.read_item({ order_number: args.order_number }, txnParams));
        return new bkr.ABIResult<Order>(result, Order.decodeResult(result.returnValue));
    }
    compose = {
        increase_quantity: async (args: {
            order_number: bigint;
        }, txnParams?: bkr.TransactionOverrides, atc?: algosdk.AtomicTransactionComposer): Promise<algosdk.AtomicTransactionComposer> => {
            return this.addMethodCall(algosdk.getMethodByName(this.methods, "increase_quantity"), { order_number: args.order_number }, txnParams, atc);
        },
        place_order: async (args: {
            order_number: bigint;
            order: Order;
        }, txnParams?: bkr.TransactionOverrides, atc?: algosdk.AtomicTransactionComposer): Promise<algosdk.AtomicTransactionComposer> => {
            return this.addMethodCall(algosdk.getMethodByName(this.methods, "place_order"), { order_number: args.order_number, order: args.order }, txnParams, atc);
        },
        read_item: async (args: {
            order_number: bigint;
        }, txnParams?: bkr.TransactionOverrides, atc?: algosdk.AtomicTransactionComposer): Promise<algosdk.AtomicTransactionComposer> => {
            return this.addMethodCall(algosdk.getMethodByName(this.methods, "read_item"), { order_number: args.order_number }, txnParams, atc);
        }
    };
}
