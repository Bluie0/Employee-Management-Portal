import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './Login.css';

const Login = ({ onSwitchToRegister }) => { // Accept the prop here
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    const result = await login(formData.email, formData.password);
    
    if (!result.success) {
      setErrors({ general: result.error });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="login-card">
          <div className="login-header">
            <div className="login-logo">
              <div className="logo-icon">🏢</div>
              <h1>EMS Portal</h1>
              <p>Employee Management System</p>
            </div>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <h2>Welcome Back!</h2>
            <p className="login-subtitle">Sign in to access your dashboard</p>

            {errors.general && (
              <div className="error-banner">
                {/* <span className="error-icon">⚠️</span> */}
                {errors.general}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">
                {/* <span className="label-icon">📧</span> */}
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
                placeholder="Enter your email"
                disabled={isLoading}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password">
                {/* <span className="label-icon">🔒</span> */}
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? 'error' : ''}
                placeholder="Enter your password"
                disabled={isLoading}
              />
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>

            <button 
              type="submit" 
              className="login-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  Signing in...
                </>
              ) : (
                <>
                  {/* <span className="btn-icon">🚀</span> */}
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="login-footer">
            <p>
              Don't have an account?{' '}
              <button 
                type="button" 
                className="link-button"
                onClick={onSwitchToRegister}
                disabled={isLoading}
              >
                Create Account
              </button>
            </p>
            <p style={{marginTop: '1rem', fontSize: '0.85rem'}}>
              Secure login powered by JWT authentication
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
