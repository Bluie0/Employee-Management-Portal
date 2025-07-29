import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Auth from './components/Auth/Auth'; // Import the new Auth component
import Dashboard from './components/Dashboard/Dashboard';
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner';
import './App.css';

const AppContent = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return isAuthenticated ? <Dashboard /> : <Auth />;
};

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <AppContent />
      </div>
    </AuthProvider>
  );
}

export default App;
