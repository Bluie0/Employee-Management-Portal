import React, { useState, useEffect } from 'react';
import './EmployeeForm.css';

const EmployeeForm = ({ employee, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    employeeId: '',
    username: '',
    email: '',
    designation: '',
    phonenumber: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (employee) {
      setFormData({
        employeeId: employee.employeeId || '',
        username: employee.username || '',
        email: employee.email || '',
        designation: employee.designation || '',
        phonenumber: employee.phonenumber || ''
      });
    }
  }, [employee]);

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

    if (!formData.employeeId.trim()) {
      newErrors.employeeId = 'Employee ID is required';
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Name is required';
    } else if (formData.username.length < 2) {
      newErrors.username = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.designation.trim()) {
      newErrors.designation = 'Designation is required';
    }

    if (!formData.phonenumber.trim()) {
      newErrors.phonenumber = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phonenumber)) {
      newErrors.phonenumber = 'Phone number must be exactly 10 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  console.log('Form submitted with data:', formData); // Add this debug log
  
  if (validateForm()) {
    setIsSubmitting(true);
    try {
      console.log('Calling onSubmit with:', employee ? 'UPDATE' : 'ADD'); // Debug log
      
      if (employee) {
        await onSubmit(employee.employeeId, formData);
      } else {
        console.log('Adding new employee with data:', formData); // Debug log
        await onSubmit(formData);
      }
      
      console.log('onSubmit completed successfully'); // Debug log
    } catch (error) {
      console.error('Error in form submission:', error); // Add error logging
    } finally {
      setIsSubmitting(false);
    }
  } else {
    console.log('Form validation failed:', errors); // Debug validation
  }
};

  return (
    <div className="form-overlay" onClick={(e) => e.target.className === 'form-overlay' && onCancel()}>
      <div className="employee-form">
        <div className="form-header">
          <h2>
            <span className="form-icon">{employee ? '✏️' : '👥'}</span>
            {employee ? 'Edit Employee' : 'Add New Employee'}
          </h2>
          <button className="close-btn" onClick={onCancel}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="form-content">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="employeeId">
                {/* <span className="label-icon">🆔</span> */}
                Employee ID
              </label>
              <input
                type="text"
                id="employeeId"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                disabled={!!employee}
                className={errors.employeeId ? 'error' : ''}
                placeholder="Enter employee ID"
              />
              {errors.employeeId && <span className="error-text">{errors.employeeId}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="username">
                {/* <span className="label-icon">👤</span> */}
                Full Name
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={errors.username ? 'error' : ''}
                placeholder="Enter full name"
              />
              {errors.username && <span className="error-text">{errors.username}</span>}
            </div>
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
              placeholder="Enter email address"
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="designation">
                {/* <span className="label-icon">💼</span> */}
                Designation
              </label>
              <input
                type="text"
                id="designation"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                className={errors.designation ? 'error' : ''}
                placeholder="Enter job title"
              />
              {errors.designation && <span className="error-text">{errors.designation}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="phonenumber">
                {/* <span className="label-icon">📱</span> */}
                Phone Number
              </label>
              <input
                type="tel"
                id="phonenumber"
                name="phonenumber"
                value={formData.phonenumber}
                onChange={handleChange}
                className={errors.phonenumber ? 'error' : ''}
                placeholder="Enter 10-digit phone number"
              />
              {errors.phonenumber && <span className="error-text">{errors.phonenumber}</span>}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  {employee ? 'Updating...' : 'Adding...'}
                </>
              ) : (
                <>
                  <span className="btn-icon">{employee ? '💾' : '➕'}</span>
                  {employee ? 'Update Employee' : 'Add Employee'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;
