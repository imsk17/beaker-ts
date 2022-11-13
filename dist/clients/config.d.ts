export interface AlgodConfig {
    host: string;
    port: string;
    token?: string;
    tokenHeader?: string;
}
export interface IndexerConfig {
    host: string;
    port: string;
    token?: string;
    tokenHeader?: string;
}
export declare enum APIProvider {
    AlgoNode = "algonode",
    AlgoExplorer = "algoexplorer",
    PureStake = "purestake",
    Sandbox = "sandbox"
}
export declare enum Network {
    BetaNet = "BetaNet",
    TestNet = "TestNet",
    MainNet = "MainNet",
    SandNet = "SandNet"
}
//# sourceMappingURL=config.d.ts.map