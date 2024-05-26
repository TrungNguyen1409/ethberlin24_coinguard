# CoinguardWallet

<img width="329" alt="Screenshot 2024-05-25 at 14 59 13" src="https://github.com/TrungNguyen1409/ethberlin24_coinguard/assets/96893597/9ffda16b-9db1-4a6f-9d8a-ee9e92583998">
 

## Overview

Coinguard is an Ethereum self-custody wallet with an integrated incognito mode, designed to address the issue of transactions leaking the sender's wallet address. By enabling the incognito feature, users can make transactions that cannot be traced back to their wallet. This helps to ensure privacy and security by preventing recipients from seeing the sender's on-chain activity and net worth simply by copying and pasting their address into a blockchain explorer.

## Key Features

- **Incognito Mode**: Enable transactions that are not traceable to your wallet, enhancing privacy and security.
- **dApp Compatibility**: Coinguard's architecture supports the use of decentralized applications (dApps) while maintaining privacy.
- **Secure Transactions**: Unique security features ensure the confidentiality and integrity of transactions.

## Challenges

### Privacy Protection
Ensuring the public key of the user's wallet remains as hidden as possible was a significant challenge, requiring careful consideration of security measures.

### Integration with Tornado Cash Contracts
Deploying and interacting with Tornado Cash smart contracts on the Sepolia testnet posed challenges, as they were originally deployed on the discontinued Goerli testnet. This necessitated the rewriting and deployment of contracts, along with frontend integration efforts.

### Handling Transaction Notes
Catching and storing the notes obtained from the contracts, which allow retrieval of tokens from the pool, presented technical difficulties that had to be addressed.

## Technology Stack

- **Frontend**: JavaScript React for the browser extension.
- **Backend**: JavaScript Express.
- **Smart Contracts**: Utilized Tornado Cash contracts deployed on the Sepolia Testnet to maximize privacy and security features.

## Getting Started

1. Clone the repository.
2. Install dependencies using `npm install`.
3. Run the frontend and backend servers.
4. Enable incognito mode for enhanced privacy and security.

## Contributors

- Trung Nguyen
- Andrew TATE.eth
- Marvin Hahn

## License

This project is licensed under the [License Name] License - see the [LICENSE.md](LICENSE.md) file for details.
