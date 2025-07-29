import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  return (
    <header className="header">
      <div className="container">
        <div className="nav">
          <div className="logo">
            <div className="logo-icon">🏢</div>
            <div className="logo-text">
              <h2>EMS Portal</h2>
              <span className="logo-tagline">Employee Management</span>
            </div>
          </div>
          
          <nav className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
            <a href="#dashboard" className="nav-link">
              <span className="nav-icon">📊</span>
              Dashboard
            </a>
            <a href="#employees" className="nav-link">
              <span className="nav-icon">👥</span>
              Employees
            </a>
            <a href="#reports" className="nav-link">
              <span className="nav-icon">📈</span>
              Reports
            </a>
          </nav>
          
          <div className="header-actions">
            {/* <button className="notification-btn">
              <span className="notification-icon">🔔</span>
              <span className="notification-badge">2</span>
            </button> */}
            
            <div className="user-profile" onClick={() => setShowUserMenu(!showUserMenu)}>
              <div className="user-avatar">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
              <div className="user-info">
                <span className="user-name">{user?.username}</span>
                <span className="user-role">{user?.role}</span>
              </div>
              <span className="dropdown-arrow">▼</span>
              
              {showUserMenu && (
                <div className="user-dropdown">
                  {/* <div className="dropdown-item">
                    <span className="dropdown-icon">👤</span>
                    Profile
                  </div>
                  <div className="dropdown-item">
                    <span className="dropdown-icon">⚙️</span>
                    Settings
                  </div> */}
                  {/* <div className="dropdown-divider"></div> */}
                  <div className="dropdown-item logout" onClick={handleLogout}>
                    <span className="dropdown-icon">🚪</span> 
                    Logout
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="hamburger" onClick={toggleMenu}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
