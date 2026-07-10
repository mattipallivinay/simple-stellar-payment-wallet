# Simple Stellar Payment Wallet 🌟

A clean, production-quality Stellar Testnet wallet dApp — connect Freighter, view your XLM balance, and send payments, all with a modern responsive UI.

Built as a Stellar **White Belt Level 1** project.

![Testnet](https://img.shields.io/badge/network-Testnet-6366f1)
![License](https://img.shields.io/badge/license-MIT-green)

---

## ✨ Features

- 🔌 **Connect / Disconnect** Freighter Wallet, with auto-reconnect on page reload
- 🌐 Locked to **Stellar Testnet** — never touches Mainnet
- 💰 Live **XLM balance** fetching from Horizon, with manual refresh
- 🚰 One-click **Friendbot funding** for new/empty Testnet accounts
- 💸 **Send XLM** with full client-side validation (valid address, positive amount, no self-sends, balance checks)
- 🖊️ Transaction signing via Freighter, with staged status (building → signing → submitting)
- ✅ **Success/failure modal** with transaction hash, ledger number, copy-to-clipboard, and a block explorer link
- 🔔 Toast notifications for key actions
- 🌗 **Dark mode**, persisted across sessions
- 🛡️ Error boundary + friendly error messages throughout
- 📱 Fully responsive, mobile-friendly layout

## 📸 Screenshots

| Wallet Connected | Send Payment | Success Modal |
|---|---|---|
| `screenshots/wallet.png` | `screenshots/send.png` | `screenshots/success.png` |

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS |
| Blockchain | Stellar SDK (`@stellar/stellar-sdk`) |
| Wallet | Freighter API (`@stellar/freighter-api`) |
| Notifications | react-hot-toast |
| Icons | lucide-react |
| Deployment | Vercel / Netlify |

## 📂 Folder Structure

```
stellar-wallet/
├── src/
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── WalletCard.tsx
│   │   ├── BalanceCard.tsx
│   │   ├── PaymentForm.tsx
│   │   ├── TransactionModal.tsx
│   │   └── ErrorBoundary.tsx
│   ├── hooks/
│   │   ├── useWallet.ts
│   │   ├── useBalance.ts
│   │   ├── useSendPayment.ts
│   │   └── useDarkMode.ts
│   ├── services/
│   │   ├── wallet.ts      # Freighter API wrapper
│   │   └── stellar.ts     # Horizon / Stellar SDK wrapper
│   ├── utils/
│   │   ├── constants.ts
│   │   ├── validation.ts
│   │   └── format.ts
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .env.example
├── .gitignore
├── package.json
├── tailwind.config.js
├── vite.config.ts
├── tsconfig.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- npm
- [Freighter Wallet](https://www.freighter.app/) browser extension

### Installation

```bash
git clone https://github.com/mattipallivinay/stellar-payment-wallet.git
cd stellar-payment-wallet
npm install
```

### Environment Variables

Copy the example env file and adjust if needed (defaults already point to Testnet):

```bash
cp .env.example .env
```

| Variable | Description | Default |
|---|---|---|
| `VITE_STELLAR_HORIZON_URL` | Horizon API endpoint | `https://horizon-testnet.stellar.org` |
| `VITE_STELLAR_NETWORK_PASSPHRASE` | Network passphrase for signing | `Test SDF Network ; September 2015` |
| `VITE_STELLAR_NETWORK` | Network label shown in UI | `TESTNET` |

### Running Locally

```bash
npm run dev
```

Visit `http://localhost:5173`.

### Building for Production

```bash
npm run build
npm run preview   # preview the production build locally
```

## 🔗 Connecting Freighter

1. Install the [Freighter extension](https://www.freighter.app/) if you haven't already.
2. Open Freighter and switch its network to **Testnet** (Settings → Network → Testnet).
3. If you don't have a Testnet account yet, create one in Freighter, then use the app's **"Fund with Friendbot"** button to get free test XLM.
4. Click **Connect Wallet** in the app and approve the popup.

## ☁️ Deployment

### Vercel

```bash
npm i -g vercel
vercel
```
Or connect the GitHub repo directly at [vercel.com/new](https://vercel.com/new) — Vercel auto-detects Vite projects. Set the environment variables from `.env.example` in the project's dashboard settings.

### Netlify

```bash
npm i -g netlify-cli
npm run build
netlify deploy --prod --dir=dist
```
Or connect the repo at [app.netlify.com](https://app.netlify.com) with:
- **Build command:** `npm run build`
- **Publish directory:** `dist`

## 🗺️ Future Improvements

- Support for additional Stellar assets (custom tokens), not just XLM
- Transaction history view
- QR code scanning for recipient addresses
- Multi-wallet support (Albedo, xBull, Lobstr)
- Path payments / currency conversion
- Multi-signature account support

## 📄 License

Released under the [MIT License](./LICENSE).
