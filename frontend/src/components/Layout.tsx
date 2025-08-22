import React from 'react';
import NewNavbar from './Trustchaincomponents/NewNavbar';
import Footer from './Trustchaincomponents/Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <NewNavbar />
      <main className="flex-grow pt-20 bg-gradient-to-b from-black via-gray-900 to-black">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
