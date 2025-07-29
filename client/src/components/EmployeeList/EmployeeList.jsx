import React, { useState } from 'react';
import './EmployeeList.css';

const EmployeeList = ({ employees, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('username');
  const [filterBy, setFilterBy] = useState('all');

  // Filter employees based on search term and filter
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.designation.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterBy === 'all') return matchesSearch;
    return matchesSearch && employee.designation.toLowerCase().includes(filterBy.toLowerCase());
  });

  // Sort employees
  const sortedEmployees = [...filteredEmployees].sort((a, b) => {
    if (sortBy === 'username') return a.username.localeCompare(b.username);
    if (sortBy === 'designation') return a.designation.localeCompare(b.designation);
    if (sortBy === 'employeeId') return a.employeeId.localeCompare(b.employeeId);
    return 0;
  });

  // Get unique designations for filter
  const designations = [...new Set(employees.map(emp => emp.designation))];

  if (employees.length === 0) {
    return (
      <div className="no-employees">
        <div className="no-employees-icon">👥</div>
        <h3>No employees found</h3>
        <p>Start building your team by adding your first employee.</p>
      </div>
    );
  }

  return (
    <div className="employee-list">
      <div className="list-header">
        <div className="list-title">
          <h2>Employee Directory</h2>
          <span className="employee-count">{sortedEmployees.length} employees</span>
        </div>
        
        <div className="list-controls">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select 
            className="filter-select"
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
          >
            <option value="all">All Positions</option>
            {designations.map(designation => (
              <option key={designation} value={designation}>{designation}</option>
            ))}
          </select>
          
          <select 
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="username">Sort by Name</option>
            <option value="designation">Sort by Position</option>
            <option value="employeeId">Sort by ID</option>
          </select>
        </div>
      </div>

      <div className="employee-grid">
        {sortedEmployees.map((employee) => (
          <div key={employee.id} className="employee-card">
            <div className="employee-header">
              <div className="employee-avatar">
                {employee.username.charAt(0).toUpperCase()}
              </div>
              <div className="employee-basic">
                <h3 className="employee-name">{employee.username}</h3>
                <span className="employee-id">ID: {employee.employeeId}</span>
              </div>
            </div>
            
            <div className="employee-details">
              <div className="detail-item">
                {/* <span className="detail-icon">💼</span> */}
                <span className="detail-label">Position:</span>
                <span className="detail-value">{employee.designation}</span>
              </div>
              
              <div className="detail-item">
                {/* <span className="detail-icon">📧</span> */}
                <span className="detail-label">Email:</span>
                <span className="detail-value">{employee.email}</span>
              </div>
              
              <div className="detail-item">
                {/* <span className="detail-icon">📱</span> */}
                <span className="detail-label">Phone:</span>
                <span className="detail-value">{employee.phonenumber}</span>
              </div>
            </div>
            
            <div className="employee-actions">
              <button
                className="action-btn edit-btn"
                onClick={() => onEdit(employee)}
              >
                <span className="btn-icon"></span>
                Edit
              </button>
              <button
                className="action-btn delete-btn"
                onClick={() => onDelete(employee.employeeId)}
              >
                <span className="btn-icon"></span>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeList;
