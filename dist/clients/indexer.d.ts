import algosdk from 'algosdk';
import { Network, APIProvider, IndexerConfig } from './config';
declare type NetworkConfig = Record<Network, IndexerConfig | undefined>;
export declare const IndexerAPIs: Record<APIProvider, NetworkConfig>;
export declare function getIndexerClient(provider: APIProvider, network: Network, token?: string): algosdk.Indexer;
export declare function sandboxIndexer(): algosdk.Indexer;
export {};
//# sourceMappingURL=indexer.d.ts.map