import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const MainLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="d-flex" style={{   overflow: 'hidden' }}>
      {/* Sidebar */}
      <Sidebar 
        isCollapsed={sidebarCollapsed}
        isMobileOpen={mobileMenuOpen}
        onToggle={toggleSidebar}
        onMobileClose={closeMobileMenu}
      />

      {/* Main Content */}
      <div className="d-flex flex-column flex-grow-1" style={{ minWidth: 0, overflow: 'hidden' , marginLeft: sidebarCollapsed ? '70px' : '250px', transition: 'margin-left 0.3s ease'}}>
        <Header onMobileMenuToggle={toggleMobileMenu} />
        
        <div className="flex-grow-1" style={{ 
          overflowY: 'auto', 
        //   padding: '20px 24px',
          background: 'transparent',
        }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;