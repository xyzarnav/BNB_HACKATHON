import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { config } from './config/wagmi';
import TrustChainPage from './pages/TrustChainPage';
import DashboardPage from './pages/DashboardPage';
import ProjectPage from './pages/ProjectPage';
import CreateProjectPage from './pages/CreateProjectPage';
import BidPage from './pages/BidPage';
import ProfilePage from './pages/ProfilePage';
import ContactPage from './pages/ContactPage';
import UseCasesPage from './pages/UseCasesPage';
import BlockExplorerPage from './pages/BlockExplorerPage';
import DebugPage from './pages/DebugPage';
import '@rainbow-me/rainbowkit/styles.css';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <Router>
            <div className="App">
              <Routes>
                <Route path="/" element={<TrustChainPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/project/:projectId" element={<ProjectPage />} />
                <Route path="/create-project" element={<CreateProjectPage />} />
                <Route path="/bid/:projectId" element={<BidPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/usecases" element={<UseCasesPage />} />
                <Route path="/blockexplorer" element={<BlockExplorerPage />} />
                <Route path="/debug" element={<DebugPage />} />
              </Routes>
            </div>
            <Toaster position="top-right" />
          </Router>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
