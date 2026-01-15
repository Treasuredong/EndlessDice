import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';

interface LoginForm {
  username: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const toggleLanguage = () => {
    const currentLanguage = i18n.language;
    const newLanguage = currentLanguage === 'en' ? 'zh' : 'en';
    i18n.changeLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    try {
      setLoading(true);
      setError(null);
      await login(data.username, data.password);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || t('loginFailed'));
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h2>{t('login')}</h2>
          <button 
            onClick={toggleLanguage} 
            className="language-button"
          >
            {i18n.language === 'en' ? '中文' : 'English'}
          </button>
        </div>
        <p className="auth-switch">{t('haveAccount')} <Link to="/register">{t('register')}</Link></p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <div className="form-group">
            <label htmlFor="username" className="form-label">{t('username')}</label>
            <input
              id="username"
              type="text"
              className={`form-input ${errors.username ? 'error' : ''}`}
              {...register('username', {
                required: t('usernameRequired'),
                minLength: { value: 3, message: t('usernameLength') },
                maxLength: { value: 20, message: t('usernameLength') }
              })}
              placeholder={t('username')}
            />
            {errors.username && <span className="error-text">{errors.username.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">{t('password')}</label>
            <input
              id="password"
              type="password"
              className={`form-input ${errors.password ? 'error' : ''}`}
              {...register('password', {
                required: t('passwordRequired'),
                minLength: { value: 6, message: t('passwordLength') }
              })}
              placeholder={t('password')}
            />
            {errors.password && <span className="error-text">{errors.password.message}</span>}
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="auth-btn" 
              disabled={loading}
            >
              {loading ? t('loading') : t('loginButton')}
            </button>
          </div>
        </form>

        <div className="auth-footer">
          <a href="#" className="forgot-password">{t('forgotPassword')}</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
