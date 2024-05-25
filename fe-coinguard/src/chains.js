const Ethereum = {
    hex: '0x1',
    name: 'Ethereum',
    rpcUrl: '',
    ticker: "ETH"
};

const MumbaiTestnet = {
    hex: '0x13881',
    name: 'Mumbai Testnet',
    rpcUrl: '',
    ticker: "MATIC"
};

const SepoliaTestnet = {
    hex: '0xaa36a7',
    name: 'Sepolia test network',
    rpcUrl: 'https://sepolia.infura.io/v3/4da7363666a14c46a3e69bbac0773c39',
    ticker: "ETH"
};

export const CHAINS_CONFIG = {
    "0x1": Ethereum,
    "0x13881": MumbaiTestnet,
    "0xaa36a7": SepoliaTestnet
};