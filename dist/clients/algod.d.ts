import algosdk from 'algosdk';
import { Network, APIProvider, AlgodConfig } from './config';
declare type NetworkConfig = Record<Network, AlgodConfig | undefined>;
export declare const AlgodAPIs: Record<APIProvider, NetworkConfig>;
export declare function getAlgodClient(provider: APIProvider, network: Network, token?: string): algosdk.Algodv2;
export declare function sandboxAlgod(): algosdk.Algodv2;
export {};
//# sourceMappingURL=algod.d.ts.map