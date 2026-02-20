# Smart contract rule for other projects

Use this so the **Smart Contract Development Protocol** applies in any project that has Solidity.

## Option 1: User Rule (all projects, no copy-paste)

1. Open **Cursor Settings** → **Rules** → **User Rules**.
2. Add a new rule or append to existing text.
3. Paste the contents of `USER-RULE-smart-contracts.txt` from this folder.

The rule will apply globally whenever you work on smart contracts in any project.

## Option 2: Project rule (per repo)

Copy the rule file into the project’s Cursor rules:

- **From:** `rules-templates/solidity-smart-contract-protocol.mdc`
- **To:** `<your-project>/.cursor/rules/solidity-smart-contract-protocol.mdc`

Create `.cursor/rules/` if it doesn’t exist. The rule will apply when you work with `**/*.sol` in that project.

## Option 3: Remote rule (GitHub)

1. Put this folder (or repo) on GitHub.
2. In any project: **Cursor Settings** → **Rules** → **+ Add Rule** → **Remote Rule (GitHub)**.
3. Enter the repo URL. Cursor will sync the rule; updates in the repo apply to the project.
