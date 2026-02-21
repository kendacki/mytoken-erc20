# Contract Verification

## Status

- Contract: `0x5D999ea3B5Ee6248eE80eB2Ae2b671bEbA8C561b`
- Network: Sepolia (`11155111`)
- Sourcify: Verified (`exact_match`)

Verification job:
- `https://sourcify.dev/server/v2/verify/de7fa5ba-b161-41e5-a663-318eae64a2a0`

## Re-run Verification (Foundry)

From project root:

```bash
cast abi-encode "constructor(string,string)" "My Token" "MTK"
```

Then:

```bash
forge verify-contract \
  --chain-id 11155111 \
  --verifier sourcify \
  --constructor-args <ENCODED_ARGS_HEX_WITHOUT_0x> \
  0x5D999ea3B5Ee6248eE80eB2Ae2b671bEbA8C561b \
  src/MyToken.sol:MyToken
```

## Optional Etherscan Verify

If you want direct Etherscan API verification too:

```bash
forge verify-contract \
  --chain-id 11155111 \
  --etherscan-api-key <ETHERSCAN_API_KEY> \
  --constructor-args <ENCODED_ARGS_HEX_WITHOUT_0x> \
  0x5D999ea3B5Ee6248eE80eB2Ae2b671bEbA8C561b \
  src/MyToken.sol:MyToken
```
