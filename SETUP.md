# Smart Contract Project Setup

This project uses **Foundry** and **OpenZeppelin**. Run these commands from the project root (with [Foundry](https://book.getfoundry.sh/getting-started/installation) installed):

```bash
# Install Forge standard library and OpenZeppelin contracts
forge install foundry-rs/forge-std --no-commit
forge install OpenZeppelin/openzeppelin-contracts --no-commit

# Build
forge build

# Test
forge test
```

## Folder structure

- `src/` – Solidity contracts (e.g. `MyToken.sol`)
- `test/` – Foundry tests (e.g. `MyToken.t.sol`)
- `script/` – Deployment scripts (e.g. `Deploy.s.sol`)
- `lib/` – Installed dependencies (forge-std, openzeppelin-contracts)

## Commands

| Command        | Description              |
|----------------|--------------------------|
| `forge build`  | Compile contracts        |
| `forge test`   | Run tests                |
| `forge script script/Deploy.s.sol` | Run deploy script |
