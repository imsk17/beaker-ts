import GenericApplicationClient from "./src/generic_client";
class ConstantProductAMM extends GenericApplicationClient {
    bootstrap(seed: string, a_asset: number, b_asset: number) {
        return this.call(seed, a_asset, b_asset);
    }
    set_governor(new_governor: string) {
        return this.call(new_governor);
    }
    mint(a_xfer: string, b_xfer: string, pool_asset: number, a_asset: number, b_asset: number) {
        return this.call(a_xfer, b_xfer, pool_asset, a_asset, b_asset);
    }
    swap(swap_xfer: string, a_asset: number, b_asset: number) {
        return this.call(swap_xfer, a_asset, b_asset);
    }
    burn(pool_xfer: string, pool_asset: number, a_asset: number, b_asset: number) {
        return this.call(pool_xfer, pool_asset, a_asset, b_asset);
    }
}
