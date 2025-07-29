import React, { useState } from 'react';
import Login from '../Login/Login';
import Register from '../Register/Register';

const Auth = () => {
  const [showRegister, setShowRegister] = useState(false);

  const switchToRegister = () => {
    setShowRegister(true);
  };

  const switchToLogin = () => {
    setShowRegister(false);
  };

  return (
    <>
      {showRegister ? (
        <Register onBackToLogin={switchToLogin} />
      ) : (
        <Login onSwitchToRegister={switchToRegister} />
      )}
    </>
  );
};

export default Auth;
