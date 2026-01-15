import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleLanguage = () => {
    const currentLanguage = i18n.language;
    const newLanguage = currentLanguage === 'en' ? 'zh' : 'en';
    i18n.changeLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <Link to="/" className="logo">
            {/* Logo removed as requested */}
          </Link>
        </div>

        <div className="header-center">
          {/* Balance display removed as requested */}
        </div>

        <div className="header-right">
          <div className="user-menu">
            {user && (
              <div className="user-info">
                <span className="username">{user.username}</span>
                <button 
                  onClick={handleLogout} 
                  className="logout-button"
                >
                  {t('logout')}
                </button>
              </div>
            )}
          </div>

          <div className="language-selector">
            <button 
              onClick={toggleLanguage} 
              className="language-button"
            >
              {i18n.language === 'en' ? '中文' : 'English'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
