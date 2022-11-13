"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sandboxIndexer = exports.getIndexerClient = exports.IndexerAPIs = void 0;
const algosdk_1 = __importDefault(require("algosdk"));
const config_1 = require("./config");
exports.IndexerAPIs = {
    [config_1.APIProvider.Sandbox]: {
        [config_1.Network.SandNet]: {
            host: 'http://localhost',
            port: '8980',
            token: 'a'.repeat(64),
        },
        [config_1.Network.BetaNet]: undefined,
        [config_1.Network.MainNet]: undefined,
        [config_1.Network.TestNet]: undefined,
    },
    [config_1.APIProvider.AlgoNode]: {
        [config_1.Network.SandNet]: undefined,
        [config_1.Network.BetaNet]: {
            host: 'https://betanet-idx.algonode.cloud',
            port: '',
        },
        [config_1.Network.MainNet]: {
            host: 'https://mainnet-idx.algonode.cloud',
            port: '',
        },
        [config_1.Network.TestNet]: {
            host: 'https://testnet-idx.algonode.cloud',
            port: '',
        },
    },
    [config_1.APIProvider.AlgoExplorer]: {
        [config_1.Network.SandNet]: undefined,
        [config_1.Network.BetaNet]: {
            host: 'https://algoindexer.betanet.algoexplorerapi.io/',
            port: '',
        },
        [config_1.Network.TestNet]: {
            host: 'https://algoindexer.testnet.algoexplorerapi.io/',
            port: '',
        },
        [config_1.Network.MainNet]: {
            host: 'https://algoindexer.algoexplorerapi.io/',
            port: '',
        },
    },
    [config_1.APIProvider.PureStake]: {
        [config_1.Network.SandNet]: undefined,
        [config_1.Network.BetaNet]: {
            host: 'https://betanet-algorand.api.purestake.io/idx2',
            port: '',
            tokenHeader: 'X-API-Key',
        },
        [config_1.Network.TestNet]: {
            host: 'https://testnet-algorand.api.purestake.io/idx2',
            port: '',
            tokenHeader: 'X-API-Key',
        },
        [config_1.Network.MainNet]: {
            host: 'https://mainnet-algorand.api.purestake.io/idx2',
            port: '',
            tokenHeader: 'X-API-Key',
        },
    },
};
function getIndexerClient(provider, network, token) {
    if (!(provider in exports.IndexerAPIs))
        throw new Error(`Unrecognized provider: ${provider}`);
    const providerConf = exports.IndexerAPIs[provider];
    if (!(network in providerConf))
        throw new Error(`Unrecognized network: ${network}`);
    const indexerConf = providerConf[network];
    if (indexerConf === undefined)
        throw new Error(`No config for the combination of  ${provider} and ${network}`);
    let apiToken = token ? token : indexerConf.token ? indexerConf.token : '';
    // If we have a header specified for the token, use it
    if (indexerConf.tokenHeader !== undefined) {
        return new algosdk_1.default.Indexer({ [indexerConf.tokenHeader]: apiToken }, indexerConf.host, indexerConf.port);
    }
    return new algosdk_1.default.Indexer(apiToken, indexerConf.host, indexerConf.port);
}
exports.getIndexerClient = getIndexerClient;
function sandboxIndexer() {
    return getIndexerClient(config_1.APIProvider.Sandbox, config_1.Network.SandNet);
}
exports.sandboxIndexer = sandboxIndexer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXhlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGllbnRzL2luZGV4ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsc0RBQThCO0FBQzlCLHFDQUErRDtBQUlsRCxRQUFBLFdBQVcsR0FBdUM7SUFDN0QsQ0FBQyxvQkFBVyxDQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQ3JCLENBQUMsZ0JBQU8sQ0FBQyxPQUFPLENBQUMsRUFBRTtZQUNqQixJQUFJLEVBQUUsa0JBQWtCO1lBQ3hCLElBQUksRUFBRSxNQUFNO1lBQ1osS0FBSyxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDO1NBQ3RCO1FBQ0QsQ0FBQyxnQkFBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFLFNBQVM7UUFDNUIsQ0FBQyxnQkFBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFLFNBQVM7UUFDNUIsQ0FBQyxnQkFBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFLFNBQVM7S0FDN0I7SUFDRCxDQUFDLG9CQUFXLENBQUMsUUFBUSxDQUFDLEVBQUU7UUFDdEIsQ0FBQyxnQkFBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFLFNBQVM7UUFDNUIsQ0FBQyxnQkFBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ2pCLElBQUksRUFBRSxvQ0FBb0M7WUFDMUMsSUFBSSxFQUFFLEVBQUU7U0FDVDtRQUNELENBQUMsZ0JBQU8sQ0FBQyxPQUFPLENBQUMsRUFBRTtZQUNqQixJQUFJLEVBQUUsb0NBQW9DO1lBQzFDLElBQUksRUFBRSxFQUFFO1NBQ1Q7UUFDRCxDQUFDLGdCQUFPLENBQUMsT0FBTyxDQUFDLEVBQUU7WUFDakIsSUFBSSxFQUFFLG9DQUFvQztZQUMxQyxJQUFJLEVBQUUsRUFBRTtTQUNUO0tBQ0Y7SUFDRCxDQUFDLG9CQUFXLENBQUMsWUFBWSxDQUFDLEVBQUU7UUFDMUIsQ0FBQyxnQkFBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFLFNBQVM7UUFDNUIsQ0FBQyxnQkFB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