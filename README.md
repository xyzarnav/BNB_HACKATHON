# TrustChain DApp - Anti-Corruption Blockchain Platform

A decentralized application built with React + Vite + Hardhat for anti-corruption initiatives using blockchain technology.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18.17.0 or higher)
- npm or yarn

### Installation

1. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

2. **Setup the project (compiles contracts and deploys):**
   ```bash
   npm run setup
   ```

3. **Start development environment:**
   ```bash
   npm run dev
   ```

This will:
- Start a local Hardhat node
- Deploy contracts to local network
- Start the React frontend on http://localhost:5173

## 📁 Project Structure

```
bnb/
├── hardhat/                 # Smart contract development
│   ├── contracts/          # Solidity contracts
│   ├── scripts/            # Deployment scripts
│   ├── hardhat.config.ts   # Hardhat configuration
│   └── package.json
├── frontend/               # React + Vite application
│   ├── src/
│   │   ├── contracts/      # Auto-generated contract addresses
│   │   ├── hooks/          # Custom contract hooks
│   │   ├── config/         # Wagmi configuration
│   │   ├── components/     # React components
│   │   └── App.tsx         # Main application
│   └── package.json
└── package.json            # Root package.json with scripts
```

## 🛠️ Available Scripts

### Root Level Commands
- `npm run dev` - Start full development environment
- `npm run chain` - Start local Hardhat node
- `npm run deploy` - Deploy contracts to local network
- `npm run deploy:sepolia` - Deploy contracts to Sepolia testnet
- `npm run compile` - Compile smart contracts
- `npm run frontend:dev` - Start React development server
- `npm run frontend:build` - Build React app for production
- `npm run install:all` - Install all dependencies
- `npm run setup` - Complete project setup

### Hardhat Commands
- `cd hardhat && npm run compile` - Compile contracts
- `cd hardhat && npm run test` - Run contract tests
- `cd hardhat && npm run node` - Start local blockchain

### Frontend Commands
- `cd frontend && npm run dev` - Start development server
- `cd frontend && npm run build` - Build for production
- `cd frontend && npm run preview` - Preview production build

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `hardhat/` directory:

```env
# Alchemy API Key (get from https://dashboard.alchemyapi.io)
ALCHEMY_API_KEY=your_alchemy_api_key

# Private key for deployment (optional - uses default for local)
PRIVATE_KEY=your_private_key

# Etherscan API Key for contract verification
ETHERSCAN_MAINNET_API_KEY=your_etherscan_api_key

# BSCScan API Key for BNB Chain contract verification
BSCSCAN_API_KEY=your_bscscan_api_key
```

### WalletConnect Project ID

1. Go to [WalletConnect Cloud](https://cloud.walletconnect.com)
2. Create a new project
3. Copy the Project ID
4. Update `frontend/src/config/wagmi.ts` with your Project ID

## 📱 Features

- **Smart Contract Integration**: Direct interaction with TrustChain contract
- **Wallet Connection**: Connect with MetaMask, WalletConnect, and other wallets
- **Multi-Network Support**: Local development, Sepolia testnet, and mainnet
- **Real-time Updates**: Contract state updates automatically
- **Modern UI**: Beautiful, responsive interface

## 🔄 Workflow

1. **Development**: Edit contracts in `hardhat/contracts/`
2. **Compile**: `npm run compile` to compile contracts
3. **Deploy**: `npm run deploy` to deploy and update frontend
4. **Frontend**: Contract addresses automatically update in frontend
5. **Test**: Use the UI to interact with your contracts

## 🌐 Networks

- **Localhost**: `http://127.0.0.1:8545` (for development)
- **BNB Chain Testnet**: BNB Smart Chain testnet (for testing)
- **Mainnet**: Ethereum mainnet (for production)

## 🚀 Deployment

### To Testnet (Sepolia)
```bash
npm run deploy:sepolia
```

### To Production
1. Update `hardhat.config.ts` with your production settings
2. Run deployment with appropriate network
3. Build frontend: `npm run frontend:build`
4. Deploy frontend to your hosting service

## 📚 Contract Functions

The TrustChain contract includes:
- `createProject()` - Create a new anti-corruption project
- `getProjectCount()` - Get total number of projects
- `projects(uint256)` - Get project details by ID
- And more...

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

If you encounter any issues:
1. Check the console for error messages
2. Ensure all dependencies are installed
3. Verify your environment variables
4. Check network connectivity

---

**Built with ❤️ using React + Vite + Hardhat**

