# NFT Marketplace Example

This repository contains a simple NFT marketplace project using Hardhat.

## Deployment

Use the provided script to deploy all contracts and generate `frontend/addresses.json`:

```bash
npx hardhat run scripts/deployFullProject.js --network localhost
```

The script deploys `MyToken`, `MyNFT`, and `Marketplace`, mints a test NFT, and writes their addresses to `frontend/addresses.json`.

## Frontend

Open `frontend/index.html` in a browser with MetaMask connected to the same network. The app reads contract addresses from `addresses.json`.

## Tests

Run the standard Hardhat tests with:

```bash
npx hardhat test
```
