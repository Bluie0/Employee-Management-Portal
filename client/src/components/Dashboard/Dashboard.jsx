import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../Header/Header';
import EmployeeList from '../EmployeeList/EmployeeList';
import EmployeeForm from '../EmployeeForm/EmployeeForm';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import './Dashboard.css';

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const { token } = useAuth();
  const API_BASE_URL = 'http://localhost:3000/api';

  // Use useCallback to memoize fetchEmployees function
  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/getAll`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      const data = await response.json();
      if (response.ok) {
        setEmployees(Array.isArray(data) ? data : []);
      } else {
        console.error('Failed to fetch employees:', data);
        setEmployees([]);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  }, [token, API_BASE_URL]);

  // Add new employee
// In your Dashboard component
const addEmployee = async (employeeData) => {
  try {
    console.log('Dashboard: Adding employee with data:', employeeData); // Debug log
    
    const response = await fetch(`${API_BASE_URL}/addEmp`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(employeeData),
    });
    
    console.log('Response status:', response.status); // Debug log
    const data = await response.json();
    console.log('Response data:', data); // Debug log
    
    if (response.ok) {
      fetchEmployees(); // Refresh the list
      setShowForm(false);
      showNotification('Employee added successfully!', 'success');
    } else {
      console.error('Server error response:', data);
      showNotification(data.error || data.message || 'Failed to add employee', 'error');
    }
  } catch (error) {
    console.error('Network error adding employee:', error);
    showNotification('Network error: Could not add employee', 'error');
  }
};


  // Update employee
  const updateEmployee = async (employeeId, employeeData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/emp/${employeeId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(employeeData),
      });
      
      const data = await response.json();
      if (response.ok) {
        fetchEmployees();
        setEditingEmployee(null);
        setShowForm(false);
        showNotification('Employee updated successfully!', 'success');
      } else {
        showNotification(data.error || 'Failed to update employee', 'error');
      }
    } catch (error) {
      console.error('Error updating employee:', error);
      showNotification('Error updating employee', 'error');
    }
  };

  // Delete employee
  const deleteEmployee = async (employeeId) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/deleteEmp/${employeeId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include',
        });
        
        const data = await response.json();
        if (response.ok) {
          fetchEmployees();
          showNotification('Employee deleted successfully!', 'success');
        } else {
          showNotification(data.error || 'Failed to delete employee', 'error');
        }
      } catch (error) {
        console.error('Error deleting employee:', error);
        showNotification('Error deleting employee', 'error');
      }
    }
  };

  const showNotification = (message, type) => {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 3000);
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setEditingEmployee(null);
    setShowForm(false);
  };

  // Now fetchEmployees is included in the dependency array
  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  return (
    <div className="dashboard">
      <Header />
      <main className="main-content">
        <div className="hero-section">
          <div className="container">
            <div className="hero-content">
              <h1>Employee Management System</h1>
              <p>Manage your team efficiently with our modern and intuitive platform</p>
              <button 
                className="cta-button"
                onClick={() => setShowForm(true)}
              >
                <span className="button-icon"></span>
                Add New Employee
              </button>
            </div>
            <div className="hero-stats">
              <div className="stat-card">
                <div className="stat-number">{employees.length}</div>
                <div className="stat-label">Total Employees</div>
              </div>
            </div>
          </div>
        </div>

        <div className="container">
          {showForm && (
            <EmployeeForm
              employee={editingEmployee}
              onSubmit={editingEmployee ? updateEmployee : addEmployee}
              onCancel={handleCancelForm}
            />
          )}

          {loading ? (
            <LoadingSpinner />
          ) : (
            <EmployeeList
              employees={employees}
              onEdit={handleEdit}
              onDelete={deleteEmployee}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
