import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAuth } from "../../hooks/useAuth";

const NewNavbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProjectsDropdownOpen, setIsProjectsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  
  const navbarRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Login/logout logic
  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // GSAP Animations
  useEffect(() => {
    if (navbarRef.current) {
      gsap.fromTo(navbarRef.current, 
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
      );
    }
  }, []);

  useEffect(() => {
    if (dropdownRef.current) {
      if (isProjectsDropdownOpen) {
        gsap.fromTo(dropdownRef.current,
          { opacity: 0, y: -20, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: "back.out(1.7)" }
        );
      } else {
        gsap.to(dropdownRef.current, {
          opacity: 0, y: -20, scale: 0.95, duration: 0.2, ease: "power2.in"
        });
      }
    }
  }, [isProjectsDropdownOpen]);

  useEffect(() => {
    if (mobileMenuRef.current) {
      if (isMobileMenuOpen) {
        gsap.fromTo(mobileMenuRef.current,
          { opacity: 0, x: -300 },
          { opacity: 1, x: 0, duration: 0.4, ease: "power3.out" }
        );
      } else {
        gsap.to(mobileMenuRef.current, {
          opacity: 0, x: -300, duration: 0.3, ease: "power2.in"
        });
      }
    }
  }, [isMobileMenuOpen]);

  const navigation = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Use Cases", href: "/usecases" },
    { name: "Block Explorer", href: "/blockexplorer" },
    { name: "Profile", href: "/profile" },
    { name: "Contact", href: "/contact" },
  ];

  const projectsMenuItems = [
    { name: "All Projects", href: "/projects", icon: "📋" },
    { name: "My Projects", href: "/dashboard/my-projects", icon: "📁" },
    { name: "Create Project", href: "/dashboard/create-project", icon: "➕" },
  ];

  return (
    <nav
      ref={navbarRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-black/80 backdrop-blur-xl border-b border-cyan-500/20 shadow-2xl shadow-cyan-500/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-8xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-cyan-500/50 transition-all duration-300 group-hover:scale-110">
                <span className="text-white font-bold text-lg neon-text">T</span>
              </div>
              <span className="text-2xl font-bold gradient-text neon-text group-hover:neon-text-blue transition-all duration-300">
                TrustChain
              </span>
            </Link>
          </div>

          {/* Desktop Navigation - More Spread Out */}
          <div className="hidden lg:flex items-center space-x-12">
            {navigation.map((item, index) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-gray-300 hover:text-cyan-400 font-medium transition-all duration-300 hover:neon-text-cyan-400 relative group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
            
            {/* Projects Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProjectsDropdownOpen(!isProjectsDropdownOpen)}
                className="text-gray-300 hover:text-cyan-400 font-medium transition-all duration-300 hover:neon-text-cyan-400 flex items-center space-x-1 group"
              >
                <span>Projects</span>
                <svg 
                  className={`w-4 h-4 transition-transform duration-300 ${isProjectsDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Dropdown Menu */}
              {isProjectsDropdownOpen && (
                <div
                  ref={dropdownRef}
                  className="absolute top-full left-0 mt-2 w-64 bg-black/90 backdrop-blur-xl border border-cyan-500/20 rounded-xl shadow-2xl shadow-cyan-500/20 overflow-hidden"
                >
                  <div className="p-2">
                    {projectsMenuItems.map((item, index) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-cyan-500/10 hover:to-purple-500/10 rounded-lg transition-all duration-300 group"
                        onClick={() => setIsProjectsDropdownOpen(false)}
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <span className="text-lg">{item.icon}</span>
                        <span className="font-medium group-hover:neon-text-cyan-400 transition-all duration-300">
                          {item.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            {!isAuthenticated ? (
              <button
                onClick={handleLogin}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-xl font-medium hover:from-cyan-400 hover:to-purple-500 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/25 hover:scale-105 neon-border-cyan-400"
              >
                Login
              </button>
            ) : (
              <div className="flex items-center space-x-3">
                <ConnectButton />
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg font-medium hover:bg-gray-700 hover:text-white transition-all duration-300 hover:neon-text-gray-300"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button & wallet */}
          <div className="lg:hidden flex items-center space-x-3">
            <div className="h-10 flex items-center space-x-2">
              {!isAuthenticated ? (
                <button
                  onClick={handleLogin}
                  className="px-3 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-lg font-medium text-sm hover:from-cyan-400 hover:to-purple-500 transition-all duration-300 whitespace-nowrap"
                >
                  Login
                </button>
              ) : (
                <>
                  <ConnectButton />
                  <button
                    onClick={handleLogout}
                    className="px-2 py-1 bg-gray-800 text-gray-300 rounded text-xs hover:bg-gray-700 hover:text-white transition-all duration-300"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
            
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-gray-300 hover:text-cyan-400 hover:bg-gray-800 transition-all duration-300"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div
            ref={mobileMenuRef}
            className="lg:hidden bg-black/95 backdrop-blur-xl border-t border-cyan-500/20 py-6 mt-0"
          >
            <div className="space-y-2 px-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="block px-4 py-3 text-gray-300 hover:text-cyan-400 hover:bg-gradient-to-r hover:from-cyan-500/10 hover:to-purple-500/10 rounded-lg transition-all duration-300 hover:neon-text-cyan-400"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile Projects Menu */}
              <div className="border-t border-cyan-500/20 pt-4 mt-4">
                <div className="px-4 py-2 text-cyan-400 font-medium text-sm">Projects</div>
                {projectsMenuItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="block px-4 py-3 text-gray-300 hover:text-cyan-400 hover:bg-gradient-to-r hover:from-cyan-500/10 hover:to-purple-500/10 rounded-lg transition-all duration-300 flex items-center space-x-3"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                ))}
              </div>

              {/* Mobile Auth Section */}
              <div className="border-t border-cyan-500/20 pt-4 mt-4">
                {!isAuthenticated ? (
                  <button
                    onClick={handleLogin}
                    className="block w-full px-4 py-3 text-center text-gray-300 hover:text-cyan-400 hover:bg-gradient-to-r hover:from-cyan-500/10 hover:to-purple-500/10 rounded-lg transition-all duration-300 hover:neon-text-cyan-400"
                  >
                    Login to Dashboard
                  </button>
                ) : (
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-3 text-center text-gray-300 hover:text-red-400 hover:bg-gradient-to-r hover:from-red-500/10 hover:to-red-500/10 rounded-lg transition-all duration-300"
                  >
                    Logout
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NewNavbar;