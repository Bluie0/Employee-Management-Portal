import React, { useState } from 'react';
import './Register.css';

const Register = ({ onBackToLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const API_BASE_URL = 'http://localhost:3000/api';

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

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

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

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Added this line for proper authentication
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('Account created successfully! You can now login.');
        setFormData({
          username: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          onBackToLogin();
        }, 2000);
      } else {
        setErrors({ general: data.error || 'Registration failed' });
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ general: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-background">
        <div className="register-card">
          <div className="register-header">
            <div className="register-logo">
              <div className="logo-icon">🏢</div>
              <h1>EMS Portal</h1>
              <p>Employee Management System</p>
            </div>
          </div>

          <form className="register-form" onSubmit={handleSubmit}>
            <div className="form-header">
              <h2 >Create Account</h2>
              <p className="register-subtitle">Join our Employee Management System</p> 
            </div>

            {successMessage && (
              <div className="success-banner">
                {/* <span className="success-icon">✅</span> */}
                {successMessage}
              </div>
            )}

            {errors.general && (
              <div className="error-banner">
                {/* <span className="error-icon">⚠️</span> */}
                {errors.general}
              </div>
            )}

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="username">
                  {/* <span className="label-icon">👤</span> */}
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={errors.username ? 'error' : ''}
                  placeholder="Enter username"
                  disabled={isLoading}
                />
                {errors.username && <span className="error-text">{errors.username}</span>}
              </div>

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
                  placeholder="Enter email"
                  disabled={isLoading}
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>
            </div>

            <div className="form-row">
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
                  placeholder="Enter password"
                  disabled={isLoading}
                />
                {errors.password && <span className="error-text">{errors.password}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">
                  {/* <span className="label-icon">🔐</span> */}
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={errors.confirmPassword ? 'error' : ''}
                  placeholder="Confirm password"
                  disabled={isLoading}
                />
                {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
              </div>
            </div>

            <button 
              type="submit" 
              className="register-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  Creating Account...
                </>
              ) : (
                <>
                  {/* <span className="btn-icon">🎯</span> */}
                  Create Account
                </>
              )}
            </button>

            <div className="form-footer">
              <p>
                Already have an account?{' '}
                <button 
                  type="button" 
                  className="link-button"
                  onClick={onBackToLogin}
                  disabled={isLoading}
                >
                  Sign In
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
