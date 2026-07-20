import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ClipboardList, 
  Users, 
  Settings, 
  LogOut,
  ChevronDown,
  ChevronRight,
  BarChart3,
  X
} from 'lucide-react';
import Logo from "../assets/srm_logo.png";

const Sidebar = ({ isCollapsed, isMobileOpen, onToggle, onMobileClose }) => {
  const navigate = useNavigate();
  const [expandedMenus, setExpandedMenus] = useState(['survey']);

  const toggleMenu = (menu) => {
    setExpandedMenus(prev =>
      prev.includes(menu)
        ? prev.filter(m => m !== menu)
        : [...prev, menu]
    );
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  const navItems = [
    {
      id: 'dashboard',
      label: 'Survey List',
      icon: <LayoutDashboard size={20} />,
      path: '/dashboard',
      subItems: []
    },
    // {
    //   id: 'survey',
    //   label: 'Survey ',
    //   icon: <ClipboardList size={20} />,
    //   path: '/',
    //   subItems: [
    //     { label: 'All Surveys', path: '/' },
    //     { label: 'New Survey', path: '/survey' },
    //     { label: 'Review', path: '/review' },
    //     { label: 'Responses', path: '/responses' },
    //   ]
    // },
    // {
    //   id: 'patients',
    //   label: 'Patients',
    //   icon: <Users size={20} />,
    //   path: '/patients',
    //   subItems: [
    //     { label: 'All Patients', path: '/patients' },
    //     { label: 'Add Patient', path: '/patients/add' },
    //   ]
    // },
    // {
    //   id: 'reports',
    //   label: 'Reports',
    //   icon: <BarChart3 size={20} />,
    //   path: '/reports',
    //   subItems: [
    //     { label: 'Analytics', path: '/reports/analytics' },
    //     { label: 'Statistics', path: '/reports/statistics' },
    //   ]
    // },
    // {
    //   id: 'settings',
    //   label: 'Settings',
    //   icon: <Settings size={20} />,
    //   path: '/settings',
    //   subItems: [
    //     { label: 'Profile', path: '/settings/profile' },
    //     { label: 'Preferences', path: '/settings/preferences' },
    //   ]
    // }
  ];

  const isActive = (path) => window.location.pathname === path;

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="d-md-none position-fixed top-0 start-0 w-100 h-100"
          style={{ 
            zIndex: 1040, 
            background: 'rgba(0,0,0,0.5)'
          }}
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`
          ${isMobileOpen ? 'd-flex' : 'd-none d-md-flex'}
          flex-column bg-white border-end border-light shadow-sm
          position-fixed position-md-sticky top-0 start-0
        `}
        style={{
          width: isCollapsed ? '70px' : '250px',
          height: '100vh',
          zIndex: 1050,
          transition: 'width 0.3s ease',
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        {/* Sidebar Header */}
        <div className="d-flex align-items-center justify-content-between px-3 py-3 border-bottom border-light flex-shrink-0">
          <div className="d-flex align-items-center gap-2">
            <img src={Logo} alt="Logo" className="h-8" style={{ height: '32px', width: 'auto' }} />
            {!isCollapsed && (
              <span className="fw-bold" style={{ fontSize: '0.9rem', color: '#00084D' }}>
                SRM Admin
              </span>
            )}
          </div>
          <button
            onClick={onToggle}
            className="btn btn-sm btn-outline-secondary d-md-none"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-grow-1 overflow-auto py-2">
          {navItems.map((item) => {
            const hasSubItems = item.subItems && item.subItems.length > 0;
            const isExpanded = expandedMenus.includes(item.id);
            const isItemActive = isActive(item.path) || (hasSubItems && item.subItems.some(sub => isActive(sub.path)));

            return (
              <div key={item.id}>
                <div
                  onClick={() => {
                    if (hasSubItems) {
                      toggleMenu(item.id);
                    } else {
                      navigate(item.path);
                      if (window.innerWidth < 768) onMobileClose();
                    }
                  }}
                  className={`
                    d-flex align-items-center justify-content-between px-3 py-2
                    ${isItemActive ? 'border-start border-primary' : ''}
                    ${isCollapsed ? 'justify-content-center' : ''}
                  `}
                  style={{
                    borderLeft: isItemActive ? '3px solid #00084D' : '3px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    background: isItemActive ? 'rgba(0,8,77,0.05)' : 'transparent',
                  }}
                  onMouseEnter={(e) => {
                    if (!isItemActive) e.currentTarget.style.background = '#f8f9fa';
                  }}
                  onMouseLeave={(e) => {
                    if (!isItemActive) e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <div className="d-flex align-items-center gap-2">
                    <span className={isItemActive ? 'text-primary' : 'text-secondary'}>
                      {item.icon}
                    </span>
                    {!isCollapsed && (
                      <span className={`small ${isItemActive ? 'fw-semibold text-primary' : 'text-dark'}`}>
                        {item.label}
                      </span>
                    )}
                  </div>
                  {!isCollapsed && hasSubItems && (
                    <span className="text-secondary">
                      {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </span>
                  )}
                </div>

                {/* Sub-menu */}
                {!isCollapsed && hasSubItems && isExpanded && (
                  <div className="ps-4 pe-2 py-1 border-start border-2 border-light ms-3">
                    {item.subItems.map((subItem) => (
                      <NavLink
                        key={subItem.path}
                        to={subItem.path}
                        onClick={() => {
                          if (window.innerWidth < 768) onMobileClose();
                        }}
                        className={({ isActive: isSubActive }) => 
                          `d-block px-3 py-2 rounded text-decoration-none small ${
                            isSubActive 
                              ? 'bg-primary bg-opacity-10 text-primary fw-semibold' 
                              : 'text-secondary'
                          }`
                        }
                        style={{ transition: 'all 0.2s ease' }}
                      >
                        {subItem.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Logout */}
        <div className="border-top border-light p-2 flex-shrink-0">
          <div
            onClick={handleLogout}
            className={`
              d-flex align-items-center gap-2 px-3 py-2 rounded
              ${isCollapsed ? 'justify-content-center' : ''}
            `}
            style={{ 
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              color: '#666',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#ffebee';
              e.currentTarget.style.color = '#c62828';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#666';
            }}
          >
            <LogOut size={20} />
            {!isCollapsed && <span className="small fw-medium">Logout</span>}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;