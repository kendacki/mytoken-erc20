# Push this project to GitHub

You need **Git** installed. If you don’t have it: [git-scm.com/download/win](https://git-scm.com/download/win). Then restart your terminal.

Follow these steps to put the code on your GitHub.

## 1. Create a new repository on GitHub

1. Open [GitHub](https://github.com/new).
2. Choose a **Repository name** (e.g. `mytoken` or `erc20-foundry`).
3. Set visibility to **Public** (or Private).
4. **Do not** add a README, .gitignore, or license (this repo already has them).
5. Click **Create repository**.

## 2. Push from your machine

In PowerShell (or your terminal), from the **project folder** (`c:\Users\hp\Desktop\.cursorrules`):

```powershell
# If git isn’t initialized yet
git init

# Add all files (respects .gitignore)
git add .

# First commit
git commit -m "Initial commit: MyToken ERC-20 with Foundry"

# Rename branch to main if needed
git branch -M main

# Add your GitHub repo as remote (replace YOUR_USERNAME and YOUR_REPO with your repo)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Push
git push -u origin main
```

If you use SSH:

```powershell
git remote add origin git@github.com:YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

## 3. After cloning elsewhere

Anyone (or you on another machine) can get the project and run:

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO
forge install foundry-rs/forge-std
forge install OpenZeppelin/openzeppelin-contracts
forge build
forge test
```

## Note

- **Git** must be installed for `forge install` and for the steps above.
- The **lib/** folder is in `.gitignore`; dependencies are installed with `forge install` after clone.
