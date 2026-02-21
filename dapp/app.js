import { ethers } from "https://cdn.jsdelivr.net/npm/ethers@6.13.4/+esm";

const CONTRACT_ADDRESS = "0x5D999ea3B5Ee6248eE80eB2Ae2b671bEbA8C561b";
const SEPOLIA_CHAIN_ID = 11155111;

const ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function totalSupply() view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
];

const connectBtn = document.getElementById("connectBtn");
const refreshBtn = document.getElementById("refreshBtn");
const transferBtn = document.getElementById("transferBtn");
const walletEl = document.getElementById("wallet");
const networkEl = document.getElementById("network");
const myBalanceEl = document.getElementById("myBalance");
const totalSupplyEl = document.getElementById("totalSupply");
const tokenSymbolEl = document.getElementById("tokenSymbol");
const tokenSymbolEl2 = document.getElementById("tokenSymbol2");
const recipientInput = document.getElementById("recipientInput");
const amountInput = document.getElementById("amountInput");
const logEl = document.getElementById("log");
const contractAddressEl = document.getElementById("contractAddress");
const explorerLinkEl = document.getElementById("explorerLink");

contractAddressEl.textContent = CONTRACT_ADDRESS;
explorerLinkEl.href = `https://sepolia.etherscan.io/address/${CONTRACT_ADDRESS}`;

let provider;
let signer;
let contract;
let account;
let decimals = 18;
let symbol = "MTK";

function log(message) {
  const timestamp = new Date().toLocaleTimeString();
  logEl.textContent = `[${timestamp}] ${message}\n` + logEl.textContent;
}

function shortAddress(addr) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

async function ensureMetaMask() {
  if (!window.ethereum) {
    throw new Error("MetaMask not found. Please install MetaMask.");
  }
}

async function ensureSepolia() {
  const network = await provider.getNetwork();
  networkEl.textContent = `${network.name} (${network.chainId.toString()})`;
  if (Number(network.chainId) !== SEPOLIA_CHAIN_ID) {
    throw new Error("Please switch MetaMask to Sepolia network.");
  }
}

async function connectWallet() {
  try {
    await ensureMetaMask();

    provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = await provider.getSigner();
    account = await signer.getAddress();

    await ensureSepolia();

    contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
    decimals = Number(await contract.decimals());
    symbol = await contract.symbol();
    tokenSymbolEl.textContent = symbol;
    tokenSymbolEl2.textContent = symbol;

    walletEl.textContent = `${shortAddress(account)} (${account})`;

    await refreshInfo();
    log("Wallet connected successfully.");
  } catch (error) {
    log(`Connect failed: ${error.message}`);
  }
}

async function refreshInfo() {
  if (!contract || !account) {
    log("Connect wallet first.");
    return;
  }
  try {
    await ensureSepolia();

    const [balanceRaw, totalSupplyRaw] = await Promise.all([
      contract.balanceOf(account),
      contract.totalSupply(),
    ]);

    myBalanceEl.textContent = ethers.formatUnits(balanceRaw, decimals);
    totalSupplyEl.textContent = ethers.formatUnits(totalSupplyRaw, decimals);

    log(`Balances refreshed (${symbol}).`);
  } catch (error) {
    log(`Refresh failed: ${error.message}`);
  }
}

async function transferTokens() {
  if (!contract) {
    log("Connect wallet first.");
    return;
  }
  try {
    await ensureSepolia();

    const to = recipientInput.value.trim();
    const amount = amountInput.value.trim();

    if (!ethers.isAddress(to)) {
      throw new Error("Recipient address is invalid.");
    }
    if (!amount || Number(amount) <= 0) {
      throw new Error("Amount must be greater than 0.");
    }

    const parsedAmount = ethers.parseUnits(amount, decimals);

    log(`Sending ${amount} ${symbol} to ${shortAddress(to)}...`);
    const tx = await contract.transfer(to, parsedAmount);
    log(`Tx submitted: ${tx.hash}`);

    await tx.wait();
    log("Transfer confirmed.");

    await refreshInfo();
  } catch (error) {
    log(`Transfer failed: ${error.message}`);
  }
}

connectBtn.addEventListener("click", connectWallet);
refreshBtn.addEventListener("click", refreshInfo);
transferBtn.addEventListener("click", transferTokens);

if (window.ethereum) {
  window.ethereum.on("accountsChanged", () => {
    log("Account changed. Reconnect wallet.");
    walletEl.textContent = "Not connected";
    myBalanceEl.textContent = "-";
  });
  window.ethereum.on("chainChanged", () => {
    log("Network changed. Reconnect wallet.");
    networkEl.textContent = "Unknown";
  });
}
