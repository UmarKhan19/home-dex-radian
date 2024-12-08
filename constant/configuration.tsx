import { Configuration, BLOCKCHAIN_NAME, CHAIN_TYPE } from "rubic-sdk"

export const configuration: Configuration = {
    rpcProviders: {
        [BLOCKCHAIN_NAME.ETHEREUM]: {
            rpcList: [
                "https://cloudflare-eth.com",
                "https://ethereum-rpc.publicnode.com",
            ]
        },
        [BLOCKCHAIN_NAME.POLYGON]: {
            rpcList: [
                "https://polygon-rpc.com",
                "https://polygon-bor-rpc.publicnode.com",
            ]
        },
        [BLOCKCHAIN_NAME.BINANCE_SMART_CHAIN]: {
            rpcList: [
                "https://rpc.ankr.com/bsc",
                "https://bsc-rpc.publicnode.com",
            ]
        }
    },
    providerAddress: {
        [CHAIN_TYPE.EVM]: {
            crossChain: "0x95dB7Abc07D6A55D77c30889f35DF200cf96Fe58",
            onChain: "0x9C48405d8E4d107C9DC033993d18D60F67380ca1"
        }
    }
}