import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { config } from './config/wagmi';
import { store, persistor } from './store';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
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
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import '@rainbow-me/rainbowkit/styles.css';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider>
              <Router>
                <Routes>
                  {/* Public routes */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  
                  {/* Protected routes */}
                  <Route path="/" element={
                    <ProtectedRoute>
                      <Layout>
                        <TrustChainPage />
                      </Layout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <Layout>
                        <DashboardPage />
                      </Layout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/active-projects" element={
                    <ProtectedRoute>
                      <Layout>
                        <ActiveProjectsPage />
                      </Layout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/project/:projectId" element={
                    <ProtectedRoute>
                      <Layout>
                        <ProjectPage />
                      </Layout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/create-project" element={
                    <ProtectedRoute allowedRoles={['bond_issuer']}>
                      <Layout>
                        <CreateProjectPage />
                      </Layout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/bid/:projectId" element={
                    <ProtectedRoute allowedRoles={['bidder']}>
                      <Layout>
                        <BidPage />
                      </Layout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <Layout>
                        <ProfilePage />
                      </Layout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/contact" element={
                    <ProtectedRoute>
                      <Layout>
                        <ContactPage />
                      </Layout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/usecases" element={
                    <ProtectedRoute>
                      <Layout>
                        <UseCasesPage />
                      </Layout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/blockexplorer" element={
                    <ProtectedRoute>
                      <Layout>
                        <BlockExplorerPage />
                      </Layout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/debug" element={
                    <ProtectedRoute allowedRoles={['auditor', 'bond_issuer']}>
                      <Layout>
                        <DebugPage />
                      </Layout>
                    </ProtectedRoute>
                  } />
                </Routes>
                <Toaster position="top-right" />
              </Router>
            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;