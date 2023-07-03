import { Chain } from "wagmi";

export const FantomFork: Chain = {
    id: 250,
    name: 'Fantom Opera',
    network: 'Fantom Fork',
    nativeCurrency: {
        decimals: 18,
        name: 'FTM',
        symbol: 'FTM',
    },
    rpcUrls:
    {
        public: { http: ['https://rpc.ankr.com/fantom/'] },
        default: {
            http: ['https://rpc.ankr.com/fantom/']
        },
    },
    blockExplorers: {
        etherscan: { name: 'Fantom', url: 'https://ftmscan.com/' },
        default: { name: 'Fantom', url: ' https://ftmscan.com/' },
    },
}

export const BuildBear: Chain = {
    id: 9305,
    name: 'Fantom Testnet',
    network: 'Fantom Fork',
    nativeCurrency: {
        decimals: 18,
        name: 'BB ETH',
        symbol: 'BB ETH',
    },
    rpcUrls:
    {
        public: { http: ['https://rpc.buildbear.io/occupational-tion-medon-4988a12b'] },
        default: {
            http: ['https://rpc.buildbear.io/occupational-tion-medon-4988a12b']
        },
    },
    blockExplorers: {
        etherscan: { name: 'Fantom', url: 'https://explorer.buildbear.io/occupational-tion-medon-4988a12b' },
        default: { name: 'Fantom', url: 'https://explorer.buildbear.io/occupational-tion-medon-4988a12b' },
    },
}

export const privatenet: Chain = {
    id: 366,
    name: 'Theta',
    network: 'theta',
    nativeCurrency: {
        decimals: 18,
        name: 'TFUEL',
        symbol: 'TFUEL',
    },
    rpcUrls:
    {
        public: { http: ['http://127.0.0.1:18888/rpc'] },
        default: {
            http: ['http://127.0.0.1:18888/rpc']
        },
    },
    blockExplorers: {
        etherscan: { name: 'ThetaTesnet', url: ' https://testnet-explorer.thetatoken.org/' },
        default: { name: 'ThetaTesnet', url: ' https://testnet-explorer.thetatoken.org/' },
    },
}