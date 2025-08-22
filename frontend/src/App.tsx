import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { config } from './config/wagmi';
import Layout from './components/Layout';
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
import ActiveProjectsPage from './pages/ActiveProjectsPage';
import '@rainbow-me/rainbowkit/styles.css';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<TrustChainPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/active-projects" element={<ActiveProjectsPage />} />
                <Route path="/project/:projectId" element={<ProjectPage />} />
                <Route path="/create-project" element={<CreateProjectPage />} />
                <Route path="/bid/:projectId" element={<BidPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/usecases" element={<UseCasesPage />} />
                <Route path="/blockexplorer" element={<BlockExplorerPage />} />
                <Route path="/debug" element={<DebugPage />} />
              </Routes>
              <Toaster position="top-right" />
            </Layout>
          </Router>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;