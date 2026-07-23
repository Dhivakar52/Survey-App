import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const MainLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Check if route is a builder route (full width, no sidebar)
  const isBuilderRoute = location.pathname.includes('/create') || 
                         location.pathname.includes('/create-survey') ||
                         location.pathname.includes('/edit-survey') ||
                         location.pathname.includes('/survey-builder');

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
      // Auto collapse sidebar on small screens
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true);
      } else {
        setSidebarCollapsed(false);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
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

  // Calculate margin based on sidebar state
  const getMarginLeft = () => {
    if (window.innerWidth < 768) {
      return 0;
    }
    if (isBuilderRoute) {
      return 0; // No margin for builder routes
    }
    return sidebarCollapsed ? '70px' : '250px';
  };

  return (
    <div className="d-flex" style={{ height: '100vh', overflow: 'hidden' }}>
      {/* Sidebar - Hide on builder routes */}
      {!isBuilderRoute && (
        <Sidebar 
          isCollapsed={sidebarCollapsed}
          isMobileOpen={mobileMenuOpen}
          onToggle={toggleSidebar}
          onMobileClose={closeMobileMenu}
        />
      )}

      {/* Main Content */}
      <div 
        className="d-flex flex-column flex-grow-1" 
        style={{ 
          minWidth: 0, 
          overflow: 'hidden',
          marginLeft: getMarginLeft(),
          transition: 'margin-left 0.3s ease',
        }}
      >
        <Header onMobileMenuToggle={toggleMobileMenu} />
        
        <div 
          className="flex-grow-1" 
          style={{ 
            overflowY: 'auto', 
            padding: isBuilderRoute ? '0' : '20px 24px',
            background: '#f5f7fa',
          }}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;