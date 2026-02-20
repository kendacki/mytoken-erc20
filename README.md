# MyToken — ERC-20 Smart Contract

A minimal ERC-20 token built with [Foundry](https://book.getfoundry.sh/) and [OpenZeppelin](https://openzeppelin.com/contracts/). The deployer receives the full initial supply.

## Overview

- **Contract:** `MyToken` (ERC-20)
- **Initial supply:** 1,000,000 × 10¹⁸ (1M tokens, 18 decimals)
- **Recipient of initial supply:** Deployer (owner)
- **Solidity:** ^0.8.20

## Prerequisites

- [Foundry](https://book.getfoundry.sh/getting-started/installation) (forge, anvil, cast)
- [Git](https://git-scm.com/download/win) (for cloning and `forge install`)

## Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO
```

### 2. Install dependencies

```bash
forge install foundry-rs/forge-std
forge install OpenZeppelin/openzeppelin-contracts
```

### 3. Build

```bash
forge build
```

### 4. Run tests

```bash
forge test
```

## Project structure

```
├── src/
│   └── MyToken.sol      # ERC-20 token contract
├── test/
│   └── MyToken.t.sol     # Tests (owner gets initial supply)
├── script/
│   └── Deploy.s.sol      # Deployment script
├── foundry.toml          # Foundry config
├── remappings.txt        # Import remappings
└── README.md
```

## Commands

| Command | Description |
|--------|-------------|
| `forge build` | Compile contracts |
| `forge test` | Run tests |
| `forge test -vv` | Run tests with verbose output |
| `forge script script/Deploy.s.sol` | Simulate deployment |
| `forge script script/Deploy.s.sol --rpc-url <RPC_URL> --broadcast` | Deploy to a network |

## Deploy locally (Anvil)

1. Start a local node:

   ```bash
   anvil
   ```

2. In another terminal, deploy (using Anvil’s default account #0):

   ```bash
   forge script script/Deploy.s.sol --rpc-url http://127.0.0.1:8545 --broadcast --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
   ```

3. Optional: check deployer balance (Anvil account 0):

   ```bash
   cast call <MYTOKEN_ADDRESS> "balanceOf(address)(uint256)" 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
   ```

## Deploy to a live network

Use your RPC URL and a funded private key (e.g. from a env var, never commit keys):

```bash
forge script script/Deploy.s.sol --rpc-url $RPC_URL --broadcast --private-key $PRIVATE_KEY
```

## License

MIT
