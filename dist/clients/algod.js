"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sandboxAlgod = exports.getAlgodClient = exports.AlgodAPIs = void 0;
const algosdk_1 = __importDefault(require("algosdk"));
const config_1 = require("./config");
exports.AlgodAPIs = {
    [config_1.APIProvider.Sandbox]: {
        [config_1.Network.SandNet]: {
            host: 'http://localhost',
            port: '4001',
            token: 'a'.repeat(64),
        },
        [config_1.Network.BetaNet]: undefined,
        [config_1.Network.MainNet]: undefined,
        [config_1.Network.TestNet]: undefined,
    },
    [config_1.APIProvider.AlgoNode]: {
        [config_1.Network.SandNet]: undefined,
        [config_1.Network.BetaNet]: {
            host: 'https://betanet-api.algonode.cloud',
            port: '',
        },
        [config_1.Network.MainNet]: {
            host: 'https://mainnet-api.algonode.cloud',
            port: '',
        },
        [config_1.Network.TestNet]: {
            host: 'https://testnet-api.algonode.cloud',
            port: '',
        },
    },
    [config_1.APIProvider.AlgoExplorer]: {
        [config_1.Network.SandNet]: undefined,
        [config_1.Network.BetaNet]: {
            host: 'https://node.betanet.algoexplorerapi.io',
            port: '',
        },
        [config_1.Network.TestNet]: {
            host: 'https://node.testnet.algoexplorerapi.io',
            port: '',
        },
        [config_1.Network.MainNet]: {
            host: 'https://node.algoexplorerapi.io',
            port: '',
        },
    },
    [config_1.APIProvider.PureStake]: {
        [config_1.Network.SandNet]: undefined,
        [config_1.Network.BetaNet]: {
            host: 'https://betanet-algorand.api.purestake.io/ps1',
            port: '',
            tokenHeader: 'X-API-Key',
        },
        [config_1.Network.TestNet]: {
            host: 'https://testnet-algorand.api.purestake.io/ps1',
            port: '',
            tokenHeader: 'X-API-Key',
        },
        [config_1.Network.MainNet]: {
            host: 'https://mainnet-algorand.api.purestake.io/ps1',
            port: '',
            tokenHeader: 'X-API-Key',
        },
    },
};
function getAlgodClient(provider, network, token) {
    if (!(provider in exports.AlgodAPIs))
        throw new Error(`Unrecognized provider: ${provider}`);
    const providerConf = exports.AlgodAPIs[provider];
    if (!(network in providerConf))
        throw new Error(`Unrecognized network: ${network}`);
    const algodConf = providerConf[network];
    if (algodConf === undefined)
        throw new Error(`No config for the combination of  ${provider} and ${network}`);
    let apiToken = token ? token : algodConf.token ? algodConf.token : '';
    // If we have a header specified for the token, use it
    if (algodConf.tokenHeader !== undefined) {
        return new algosdk_1.default.Algodv2({ [algodConf.tokenHeader]: apiToken }, algodConf.host, algodConf.port);
    }
    return new algosdk_1.default.Algodv2(apiToken, algodConf.host, algodConf.port);
}
exports.getAlgodClient = getAlgodClient;
function sandboxAlgod() {
    return getAlgodClient(config_1.APIProvider.Sandbox, config_1.Network.SandNet);
}
exports.sandboxAlgod = sandboxAlgod;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWxnb2QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY2xpZW50cy9hbGdvZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxzREFBOEI7QUFDOUIscUNBQTZEO0FBSWhELFFBQUEsU0FBUyxHQUF1QztJQUMzRCxDQUFDLG9CQUFXLENBQUMsT0FBTyxDQUFDLEVBQUU7UUFDckIsQ0FBQyxnQkFBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ2pCLElBQUksRUFBRSxrQkFBa0I7WUFDeEIsSUFBSSxFQUFFLE1BQU07WUFDWixLQUFLLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUM7U0FDdEI7UUFDRCxDQUFDLGdCQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsU0FBUztRQUM1QixDQUFDLGdCQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsU0FBUztRQUM1QixDQUFDLGdCQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsU0FBUztLQUM3QjtJQUNELENBQUMsb0JBQVcsQ0FBQyxRQUFRLENBQUMsRUFBRTtRQUN0QixDQUFDLGdCQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsU0FBUztRQUM1QixDQUFDLGdCQUFPLENBQUMsT0FBTyxDQUFDLEVBQUU7WUFDakIsSUFBSSxFQUFFLG9DQUFvQztZQUMxQyxJQUFJLEVBQUUsRUFBRTtTQUNUO1FBQ0QsQ0FBQyxnQkFBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ2pCLElBQUksRUFBRSxvQ0FBb0M7WUFDMUMsSUFBSSxFQUFFLEVBQUU7U0FDVDtRQUNELENBQUMsZ0JBQU8sQ0FBQyxPQUFPLENBQUMsRUFBRTtZQUNqQixJQUFJLEVBQUUsb0NBQW9DO1lBQzFDLElBQUksRUFBRSxFQUFFO1NBQ1Q7S0FDRjtJQUNELENBQUMsb0JBQVcsQ0FBQyxZQUFZLENBQUMsRUFBRTtRQUMxQixDQUFDLGdCQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsU0FBUztRQUM1QixDQUFDLGdCQUFPLENB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