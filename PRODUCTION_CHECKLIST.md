# Production Deployment Checklist

Use this before deploying MTK to a production chain.

## Security

- [ ] Review all privileged actions and access controls.
- [ ] Re-check mint logic and total supply expectations.
- [ ] Run static analysis (e.g. Slither) and fix findings.
- [ ] Run independent audit or peer review.
- [ ] Ensure no private keys or secrets are in repo/history.

## Contract Readiness

- [ ] Freeze constructor parameters for production token name/symbol/supply.
- [ ] Confirm compiler version is pinned (`0.8.20`) and reproducible.
- [ ] Re-run test suite with high coverage (`forge test -vvv`).
- [ ] Add tests for edge cases (`approve`, `transferFrom`, zero address, allowances).
- [ ] Verify gas usage with `forge snapshot`.

## Deployment Ops

- [ ] Use dedicated deployment wallet (not daily wallet).
- [ ] Fund deployment wallet with exact gas budget + buffer.
- [ ] Use production RPC with fallback provider.
- [ ] Set environment variables for `RPC_URL` and `PRIVATE_KEY`.
- [ ] Dry-run script first (`forge script ...` without broadcast when possible).

## Post-Deployment

- [ ] Verify source on explorer (Sourcify/Etherscan).
- [ ] Publish token metadata (logo, socials, docs).
- [ ] Add token to wallets and tracking tools.
- [ ] Record contract address, deploy tx hash, block number.
- [ ] Announce and monitor first transfers/approvals.

## Frontend Readiness

- [ ] Confirm wallet network auto-switch/add works.
- [ ] Confirm connect/disconnect UX.
- [ ] Confirm transfer + approve + transferFrom flows.
- [ ] Confirm event feed is loading on production RPC.
- [ ] Add error fallbacks for RPC throttling/timeouts.
