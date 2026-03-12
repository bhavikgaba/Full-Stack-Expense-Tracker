import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../services/axiosInstance';
import './Dashboard.css';

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchExpenses();
  }, []);

  async function fetchExpenses() {
    try {
      const response = await axiosInstance.get('/expenses/all');
      setExpenses(response.data);
    } catch (error) {
      console.log('Error fetching expenses:', error);
    } finally {
      setLoading(false);
    }
  }

  // calculate total amount
  function getTotalAmount() {
    let total = 0;
    for (let i = 0; i < expenses.length; i++) {
      total += parseFloat(expenses[i].amount);
    }
    return total.toFixed(2);
  }

  // get expenses added this month
  function getThisMonthExpenses() {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    let monthTotal = 0;
    expenses.forEach((exp) => {
      const expDate = new Date(exp.createdAt);
      if (expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear) {
        monthTotal += parseFloat(exp.amount);
      }
    });
    return monthTotal.toFixed(2);
  }

  // find highest category
  function getTopCategory() {
    if (expenses.length === 0) return 'N/A';
    const categoryTotals = {};
    expenses.forEach((exp) => {
      if (categoryTotals[exp.category]) {
        categoryTotals[exp.category] += parseFloat(exp.amount);
      } else {
        categoryTotals[exp.category] = parseFloat(exp.amount);
      }
    });
    let maxCategory = '';
    let maxAmount = 0;
    Object.keys(categoryTotals).forEach((key) => {
      if (categoryTotals[key] > maxAmount) {
        maxAmount = categoryTotals[key];
        maxCategory = key;
      }
    });
    return maxCategory;
  }

  if (loading) {
    return <div className="loading-div">Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <h1 className="page-heading">Dashboard</h1>

      {/* summary cards */}
      <div className="cards-row">
        <div className="summary-card blue-card">
          <p className="card-label">Total Expenses</p>
          <p className="card-value">₹{getTotalAmount()}</p>
        </div>
        <div className="summary-card green-card">
          <p className="card-label">This Month</p>
          <p className="card-value">₹{getThisMonthExpenses()}</p>
        </div>
        <div className="summary-card purple-card">
          <p className="card-label">Total Records</p>
          <p className="card-value">{expenses.length}</p>
        </div>
        <div className="summary-card orange-card">
          <p className="card-label">Top Category</p>
          <p className="card-value" style={{ fontSize: '18px' }}>{getTopCategory()}</p>
        </div>
      </div>

      {/* recent expenses table */}
      <div className="section-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 className="section-title">Recent Expenses</h2>
          <button
            className="view-all-btn"
            onClick={() => navigate('/expenses')}
          >
            View All
          </button>
        </div>

        {expenses.length === 0 ? (
          <p style={{ color: '#94a3b8', textAlign: 'center', padding: '30px 0' }}>
            No expenses added yet. Go to Expenses to add one!
          </p>
        ) : (
          <table className="expense-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Amount</th>
                <th>Comments</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {expenses.slice(0, 5).map((exp) => (
                <tr key={exp.id}>
                  <td>
                    <span className="category-badge">{exp.category}</span>
                  </td>
                  <td style={{ fontWeight: '600', color: '#059669' }}>
                    ₹{parseFloat(exp.amount).toFixed(2)}
                  </td>
                  <td style={{ color: '#64748b' }}>{exp.comments || '-'}</td>
                  <td style={{ color: '#64748b' }}>
                    {new Date(exp.createdAt).toLocaleDateString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
