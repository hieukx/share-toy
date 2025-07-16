import React, { useState, useRef, useEffect } from "react";
import { Link } from 'react-router-dom';

function Header({ isLoggedIn, user, onLogin, onLogout, onRegister, searchTerm, setSearchTerm, onSearch }) {
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef();

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    if (!showProfile) return;
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showProfile]);

  const toggleProfile = () => {
    setShowProfile(!showProfile);
  };

  const handleLogout = () => {
    setShowProfile(false);
    onLogout();
  };

  const handleSearchInput = (e) => {
    setSearchTerm(e.target.value);
  };
  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (onSearch) onSearch();
    }
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          {/* Logo */}
          <Link to="/" className="header-logo">
            <span className="logo-text">SHARETOYS</span>
          </Link>

          {/* Search Bar */}
          <div className="header-search">
            <div className="search-container">
              <input
                type="text"
                placeholder="Tìm kiếm đồ chơi..."
                className="search-input"
                value={searchTerm}
                onChange={handleSearchInput}
                onKeyDown={handleSearchKeyDown}
              />
              <button className="search-button" onClick={onSearch}>
                <span className="search-icon">🔍</span>
              </button>
            </div>
          </div>

          {/* Navigation */}
          <div className="header-nav">
            {isLoggedIn ? (
              <div className="profile-container" ref={profileRef}>
                <button 
                  onClick={toggleProfile} 
                  className="profile-button"
                  aria-label="User profile menu"
                >
                  <div className="profile-avatar">
                    <span className="avatar-icon">👤</span>
                  </div>
                  <span className="profile-name">{user?.fullname}</span>
                  <span className={`dropdown-icon ${showProfile ? 'rotated' : ''}`}>
                    ▼
                  </span>
                </button>
                
                {showProfile && (
                  <div className="profile-dropdown fade-in">
                    <div className="profile-header">
                      <div className="profile-avatar-large">
                        <span className="avatar-icon">👤</span>
                      </div>
                      <div className="profile-info">
                        <div className="profile-fullname">{user?.fullname}</div>
                        <div className="profile-username">@{user?.username}</div>
                      </div>
                    </div>
                    
                    <div className="profile-details">
                      {user?.phone && (
                        <div className="profile-item">
                          <span className="profile-label">📞</span>
                          <span>{user.phone}</span>
                        </div>
                      )}
                      {user?.address && (
                        <div className="profile-item">
                          <span className="profile-label">📍</span>
                          <span>{user.address}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="profile-actions">
                      <Link to="/profile" className="profile-action">
                        <span className="action-icon">👤</span>
                        Thông tin cá nhân
                      </Link>
                      <Link to="/borrowed" className="profile-action">
                        <span className="action-icon">📦</span>
                        Đồ chơi đã mượn
                      </Link>
                      <Link to="/shared" className="profile-action">
                        <span className="action-icon">🎁</span>
                        Đồ chơi đã chia sẻ
                      </Link>
                      <button onClick={handleLogout} className="profile-logout">
                        <span className="action-icon">🚪</span>
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-buttons">
                <button onClick={onLogin} className="btn btn-primary btn-sm">
                  Đăng nhập
                </button>
                <button onClick={onRegister} className="btn btn-primary btn-sm">
                  Đăng ký
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .header {
          background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
          color: var(--white);
          position: sticky;
          top: 0;
          z-index: 1000;
          box-shadow: var(--shadow-lg);
        }

        .header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--spacing-4) 0;
          position: relative;
        }

        .header-logo {
          display: flex;
          align-items: center;
          gap: var(--spacing-3);
          text-decoration: none;
          color: var(--white);
          font-weight: 700;
          font-size: var(--font-size-xl);
          letter-spacing: 1px;
          transition: transform var(--transition-fast);
        }

        .header-logo:hover {
          transform: scale(1.05);
        }

        .logo-icon {
          font-size: var(--font-size-2xl);
        }

        .logo-text {
          font-weight: 800;
        }

        .header-search {
          flex: 1;
          max-width: 400px;
          margin: 0 var(--spacing-8);
        }

        .search-container {
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-input {
          width: 100%;
          padding: var(--spacing-3) var(--spacing-4);
          padding-right: 48px;
          border: none;
          border-radius: var(--radius-xl);
          background: rgba(255, 255, 255, 0.95);
          color: var(--gray-900);
          font-size: var(--font-size-sm);
          transition: all var(--transition-fast);
        }

        .search-input:focus {
          background: var(--white);
          box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
        }

        .search-button {
          position: absolute;
          right: var(--spacing-2);
          background: none;
          border: none;
          color: var(--gray-600);
          cursor: pointer;
          padding: var(--spacing-2);
          border-radius: var(--radius-md);
          transition: all var(--transition-fast);
        }

        .search-button:hover {
          background: var(--gray-100);
          color: var(--gray-900);
        }

        .search-icon {
          font-size: var(--font-size-sm);
        }

        .header-nav {
          display: flex;
          align-items: center;
          gap: var(--spacing-4);
        }

        .auth-buttons {
          display: flex;
          gap: var(--spacing-3);
        }

        .profile-container {
          position: relative;
        }

        .profile-button {
          display: flex;
          align-items: center;
          gap: var(--spacing-3);
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: var(--radius-lg);
          padding: var(--spacing-2) var(--spacing-4);
          color: var(--white);
          cursor: pointer;
          transition: all var(--transition-fast);
          backdrop-filter: blur(10px);
        }

        .profile-button:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-1px);
        }

        .profile-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: var(--font-size-lg);
        }

        .profile-name {
          font-weight: 500;
          font-size: var(--font-size-sm);
        }

        .dropdown-icon {
          font-size: var(--font-size-xs);
          transition: transform var(--transition-fast);
        }

        .dropdown-icon.rotated {
          transform: rotate(180deg);
        }

        .profile-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          background: var(--white);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-xl);
          min-width: 320px;
          margin-top: var(--spacing-2);
          overflow: hidden;
          border: 1px solid var(--gray-200);
        }

        .profile-header {
          display: flex;
          align-items: center;
          gap: var(--spacing-4);
          padding: var(--spacing-6);
          background: var(--gray-50);
          border-bottom: 1px solid var(--gray-200);
        }

        .profile-avatar-large {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: var(--primary-color);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: var(--font-size-xl);
          color: var(--white);
        }

        .profile-info {
          flex: 1;
        }

        .profile-fullname {
          font-weight: 600;
          color: var(--gray-900);
          font-size: var(--font-size-base);
        }

        .profile-username {
          color: var(--gray-600);
          font-size: var(--font-size-sm);
        }

        .profile-details {
          padding: var(--spacing-4) var(--spacing-6);
          border-bottom: 1px solid var(--gray-200);
        }

        .profile-item {
          display: flex;
          align-items: center;
          gap: var(--spacing-3);
          margin-bottom: var(--spacing-3);
          font-size: var(--font-size-sm);
          color: var(--gray-700);
        }

        .profile-item:last-child {
          margin-bottom: 0;
        }

        .profile-label {
          font-size: var(--font-size-base);
        }

        .profile-actions {
          padding: var(--spacing-2) 0;
        }

        .profile-action {
          display: flex;
          align-items: center;
          gap: var(--spacing-3);
          padding: var(--spacing-3) var(--spacing-6);
          color: var(--gray-700);
          text-decoration: none;
          font-size: var(--font-size-sm);
          transition: background var(--transition-fast);
        }

        .profile-action:hover {
          background: var(--gray-50);
          color: var(--gray-900);
        }

        .action-icon {
          font-size: var(--font-size-base);
        }

        .profile-logout {
          display: flex;
          align-items: center;
          gap: var(--spacing-3);
          width: 100%;
          padding: var(--spacing-3) var(--spacing-6);
          background: none;
          border: none;
          color: var(--error);
          cursor: pointer;
          font-size: var(--font-size-sm);
          font-weight: 500;
          text-align: left;
          transition: background var(--transition-fast);
        }

        .profile-logout:hover {
          background: var(--error);
          color: var(--white);
        }
      `}</style>
    </header>
  );
}

export default Header; 