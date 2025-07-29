import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = () => {
  return (
    <div className="loading-container">
      <div className="loading-spinner">
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
      </div>
      <h3>Loading employees...</h3>
      <p>Please wait while we fetch the employee data</p>
    </div>
  );
};

export default LoadingSpinner;
