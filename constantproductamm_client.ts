import algosdk, {TransactionWithSigner, ABIMethod, ABIMethodParams, getMethodByName} from "algosdk";
import GenericApplicationClient from "./src/generic_client";
class ConstantProductAMM extends GenericApplicationClient {
    desc: string = "";
    methods: ABIMethod[] = [
        new ABIMethod({
            name: "bootstrap",
            desc: "",
            args: [
                { type: "pay", name: "seed", desc: "" },
                { type: "asset", name: "a_asset", desc: "" },
                { type: "asset", name: "b_asset", desc: "" }
            ],
            returns: { type: "uint64", desc: "" }
        }),
        new ABIMethod({
            name: "set_governor",
            desc: "",
            args: [
                { type: "account", name: "new_governor", desc: "" }
            ],
            returns: { type: "void", desc: "" }
        }),
        new ABIMethod({
            name: "mint",
            desc: "",
            args: [
                { type: "axfer", name: "a_xfer", desc: "" },
                { type: "axfer", name: "b_xfer", desc: "" },
                { type: "asset", name: "pool_asset", desc: "" },
                { type: "asset", name: "a_asset", desc: "" },
                { type: "asset", name: "b_asset", desc: "" }
            ],
            returns: { type: "void", desc: "" }
        }),
        new ABIMethod({
            name: "swap",
            desc: "",
            args: [
                { type: "axfer", name: "swap_xfer", desc: "" },
                { type: "asset", name: "a_asset", desc: "" },
                { type: "asset", name: "b_asset", desc: "" }
            ],
            returns: { type: "void", desc: "" }
        }),
        new ABIMethod({
            name: "burn",
            desc: "",
            args: [
                { type: "axfer", name: "pool_xfer", desc: "" },
                { type: "asset", name: "pool_asset", desc: "" },
                { type: "asset", name: "a_asset", desc: "" },
                { type: "asset", name: "b_asset", desc: "" }
            ],
            returns: { type: "void", desc: "" }
        })
    ];
    bootstrap(seed: TransactionWithSigner, a_asset: number, b_asset: number) {
        return this.call(getMethodByName(this.methods, "bootstrap"), { seed: seed, a_asset: a_asset, b_asset: b_asset });
    }
    set_governor(new_governor: string) {
        return this.call(getMethodByName(this.methods, "set_governor"), { new_governor: new_governor });
    }
    mint(a_xfer: TransactionWithSigner, b_xfer: TransactionWithSigner, pool_asset: number, a_asset: number, b_asset: number) {
        return this.call(getMethodByName(this.methods, "mint"), { a_xfer: a_xfer, b_xfer: b_xfer, pool_asset: pool_asset, a_asset: a_asset, b_asset: b_asset });
    }
    swap(swap_xfer: TransactionWithSigner, a_asset: number, b_asset: number) {
        return this.call(getMethodByName(this.methods, "swap"), { swap_xfer: swap_xfer, a_asset: a_asset, b_asset: b_asset });
    }
    burn(pool_xfer: TransactionWithSigner, pool_asset: number, a_asset: number, b_asset: number) {
        return this.call(getMethodByName(this.methods, "burn"), { pool_xfer: pool_xfer, pool_asset: pool_asset, a_asset: a_asset, b_asset: b_asset });
    }
}
