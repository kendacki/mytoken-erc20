import { ethers } from "https://cdn.jsdelivr.net/npm/ethers@6.13.4/+esm";

const CONTRACT_ADDRESS = "0x5D999ea3B5Ee6248eE80eB2Ae2b671bEbA8C561b";
const SEPOLIA_CHAIN_ID = 11155111;
const SEPOLIA_CHAIN_ID_HEX = "0xaa36a7";
const SEPOLIA_NETWORK_PARAMS = {
  chainId: SEPOLIA_CHAIN_ID_HEX,
  chainName: "Sepolia",
  nativeCurrency: {
    name: "Sepolia ETH",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: ["https://rpc.sepolia.org"],
  blockExplorerUrls: ["https://sepolia.etherscan.io"],
};

const ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function totalSupply() view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)",
];

const connectBtn = document.getElementById("connectBtn");
const disconnectBtn = document.getElementById("disconnectBtn");
const refreshBtn = document.getElementById("refreshBtn");
const transferBtn = document.getElementById("transferBtn");
const approveBtn = document.getElementById("approveBtn");
const checkAllowanceBtn = document.getElementById("checkAllowanceBtn");
const refreshEventsBtn = document.getElementById("refreshEventsBtn");
const connectionPillEl = document.getElementById("connectionPill");
const walletEl = document.getElementById("wallet");
const networkEl = document.getElementById("network");
const myBalanceEl = document.getElementById("myBalance");
const totalSupplyEl = document.getElementById("totalSupply");
const tokenSymbolEl = document.getElementById("tokenSymbol");
const tokenSymbolEl2 = document.getElementById("tokenSymbol2");
const tokenSymbolEl3 = document.getElementById("tokenSymbol3");
const recipientInput = document.getElementById("recipientInput");
const amountInput = document.getElementById("amountInput");
const spenderInput = document.getElementById("spenderInput");
const approveAmountInput = document.getElementById("approveAmountInput");
const allowanceValueEl = document.getElementById("allowanceValue");
const eventsListEl = document.getElementById("eventsList");
const logEl = document.getElementById("log");
const contractAddressEl = document.getElementById("contractAddress");
const explorerLinkEl = document.getElementById("explorerLink");
const MANUAL_DISCONNECT_KEY = "mtk_manual_disconnect";

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

function formatAddr(addr) {
  return `${shortAddress(addr)} (${addr})`;
}

function setConnectionState(connected) {
  if (connected) {
    connectionPillEl.textContent = "Connected";
    connectionPillEl.classList.add("connected");
    connectionPillEl.classList.remove("disconnected");
    connectBtn.textContent = "Wallet Connected";
    disconnectBtn.disabled = false;
  } else {
    connectionPillEl.textContent = "Not connected";
    connectionPillEl.classList.add("disconnected");
    connectionPillEl.classList.remove("connected");
    connectBtn.textContent = "Connect MetaMask";
    disconnectBtn.disabled = true;
  }
}

function clearSessionState() {
  provider = undefined;
  signer = undefined;
  contract = undefined;
  account = undefined;
  walletEl.textContent = "Not connected";
  networkEl.textContent = "Unknown";
  myBalanceEl.textContent = "-";
  totalSupplyEl.textContent = "-";
  allowanceValueEl.textContent = "-";
  eventsListEl.innerHTML = "<li>No events loaded yet.</li>";
}

async function ensureMetaMask() {
  if (!window.ethereum) {
    throw new Error("MetaMask not found. Please install MetaMask.");
  }
}

async function switchOrAddSepolia() {
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: SEPOLIA_CHAIN_ID_HEX }],
    });
  } catch (error) {
    if (error.code === 4902) {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [SEPOLIA_NETWORK_PARAMS],
      });
    } else {
      throw error;
    }
  }
}

async function ensureSepolia() {
  const network = await provider.getNetwork();
  networkEl.textContent = `${network.name} (${network.chainId.toString()})`;
  if (Number(network.chainId) !== SEPOLIA_CHAIN_ID) {
    await switchOrAddSepolia();
    const updatedNetwork = await provider.getNetwork();
    networkEl.textContent = `${updatedNetwork.name} (${updatedNetwork.chainId.toString()})`;
    if (Number(updatedNetwork.chainId) !== SEPOLIA_CHAIN_ID) {
      throw new Error("Please switch MetaMask to Sepolia network.");
    }
  }
}

async function connectWallet() {
  try {
    await initWalletSession(true);
    localStorage.removeItem(MANUAL_DISCONNECT_KEY);
    log("Wallet connected successfully.");
  } catch (error) {
    setConnectionState(false);
    log(`Connect failed: ${error.message}`);
  }
}

function disconnectWallet() {
  clearSessionState();
  setConnectionState(false);
  localStorage.setItem(MANUAL_DISCONNECT_KEY, "1");
  log("Wallet disconnected for this app session.");
}

async function initWalletSession(requestAccountAccess) {
  await ensureMetaMask();

  provider = new ethers.BrowserProvider(window.ethereum);
  if (requestAccountAccess) {
    await switchOrAddSepolia();
    await provider.send("eth_requestAccounts", []);
  } else {
    const existingAccounts = await provider.send("eth_accounts", []);
    if (!existingAccounts.length) {
      setConnectionState(false);
      return false;
    }
  }

  await ensureSepolia();
  signer = await provider.getSigner();
  account = await signer.getAddress();

  contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
  decimals = Number(await contract.decimals());
  symbol = await contract.symbol();
  tokenSymbolEl.textContent = symbol;
  tokenSymbolEl2.textContent = symbol;
  tokenSymbolEl3.textContent = symbol;

  walletEl.textContent = `${shortAddress(account)} (${account})`;
  setConnectionState(true);
  await refreshInfo();
  await loadRecentEvents();
  return true;
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
    await loadRecentEvents();
  } catch (error) {
    log(`Transfer failed: ${error.message}`);
  }
}

async function approveTokens() {
  if (!contract) {
    log("Connect wallet first.");
    return;
  }
  try {
    await ensureSepolia();
    const spender = spenderInput.value.trim();
    const amount = approveAmountInput.value.trim();

    if (!ethers.isAddress(spender)) {
      throw new Error("Spender address is invalid.");
    }
    if (!amount || Number(amount) < 0) {
      throw new Error("Amount must be 0 or greater.");
    }

    const parsedAmount = ethers.parseUnits(amount, decimals);
    log(`Approving ${amount} ${symbol} for ${shortAddress(spender)}...`);
    const tx = await contract.approve(spender, parsedAmount);
    log(`Approval tx submitted: ${tx.hash}`);
    await tx.wait();
    log("Approval confirmed.");
    await checkAllowance();
    await loadRecentEvents();
  } catch (error) {
    log(`Approve failed: ${error.message}`);
  }
}

async function checkAllowance() {
  if (!contract || !account) {
    log("Connect wallet first.");
    return;
  }
  try {
    const spender = spenderInput.value.trim();
    if (!ethers.isAddress(spender)) {
      throw new Error("Enter a valid spender address first.");
    }
    const allowanceRaw = await contract.allowance(account, spender);
    allowanceValueEl.textContent = ethers.formatUnits(allowanceRaw, decimals);
    log(`Allowance loaded for spender ${shortAddress(spender)}.`);
  } catch (error) {
    log(`Allowance check failed: ${error.message}`);
  }
}

async function loadRecentEvents() {
  if (!contract || !provider) {
    return;
  }
  try {
    const latestBlock = await provider.getBlockNumber();
    const fromBlock = Math.max(latestBlock - 5000, 0);
    const transferEvents = await contract.queryFilter(contract.filters.Transfer(), fromBlock, latestBlock);
    const approvalEvents = await contract.queryFilter(contract.filters.Approval(), fromBlock, latestBlock);
    const merged = [...transferEvents, ...approvalEvents]
      .sort((a, b) => (b.blockNumber - a.blockNumber) || (b.logIndex - a.logIndex))
      .slice(0, 8);

    if (!merged.length) {
      eventsListEl.innerHTML = "<li>No recent Transfer/Approval events found.</li>";
      return;
    }

    eventsListEl.innerHTML = merged
      .map((evt) => {
        if (evt.fragment?.name === "Transfer") {
          const value = ethers.formatUnits(evt.args.value, decimals);
          return `<li><strong>Transfer</strong>: ${value} ${symbol} from ${formatAddr(evt.args.from)} to ${formatAddr(evt.args.to)} <span class="muted">(block ${evt.blockNumber})</span></li>`;
        }
        const value = ethers.formatUnits(evt.args.value, decimals);
        return `<li><strong>Approval</strong>: ${value} ${symbol} owner ${formatAddr(evt.args.owner)} -> spender ${formatAddr(evt.args.spender)} <span class="muted">(block ${evt.blockNumber})</span></li>`;
      })
      .join("");
  } catch (error) {
    eventsListEl.innerHTML = "<li>Could not load events right now.</li>";
    log(`Events load failed: ${error.message}`);
  }
}

connectBtn.addEventListener("click", connectWallet);
disconnectBtn.addEventListener("click", disconnectWallet);
refreshBtn.addEventListener("click", refreshInfo);
transferBtn.addEventListener("click", transferTokens);
approveBtn.addEventListener("click", approveTokens);
checkAllowanceBtn.addEventListener("click", checkAllowance);
refreshEventsBtn.addEventListener("click", loadRecentEvents);

if (window.ethereum) {
  window.ethereum.on("accountsChanged", () => {
    log("Account changed. Reconnect wallet.");
    walletEl.textContent = "Not connected";
    myBalanceEl.textContent = "-";
    setConnectionState(false);
  });
  window.ethereum.on("chainChanged", () => {
    log("Network changed. Reconnect wallet.");
    networkEl.textContent = "Unknown";
    setConnectionState(false);
  });
}

if (window.ethereum) {
  const manuallyDisconnected = localStorage.getItem(MANUAL_DISCONNECT_KEY) === "1";
  if (!manuallyDisconnected) {
    initWalletSession(false)
    .then((connected) => {
      if (connected) {
        log("Auto-reconnected wallet session.");
      }
    })
    .catch(() => {
      setConnectionState(false);
    });
  } else {
    setConnectionState(false);
  }
}
