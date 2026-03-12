import React, { useState, useEffect } from 'react';
import axiosInstance from '../services/axiosInstance';
import './ExpenseList.css';

const CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Healthcare',
  'Housing',
  'Education',
  'Travel',
  'Utilities',
  'Other',
];

function ExpenseList() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  // form states
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [comments, setComments] = useState('');
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  // delete confirm
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    loadExpenses();
  }, []);

  async function loadExpenses() {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/expenses/all');
      setExpenses(res.data);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  }

  function openAddForm() {
    setEditingExpense(null);
    setCategory('');
    setAmount('');
    setComments('');
    setFormError('');
    setShowForm(true);
  }

  function openEditForm(expense) {
    setEditingExpense(expense);
    setCategory(expense.category);
    setAmount(expense.amount);
    setComments(expense.comments || '');
    setFormError('');
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingExpense(null);
    setFormError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError('');

    if (!category) {
      setFormError('Please select a category');
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      setFormError('Please enter a valid amount');
      return;
    }

    const data = {
      category: category,
      amount: parseFloat(amount),
      comments: comments,
    };

    setFormLoading(true);
    try {
      if (editingExpense) {
        await axiosInstance.put(`/expenses/update/${editingExpense.id}`, data);
      } else {
        await axiosInstance.post('/expenses/add', data);
      }
      closeForm();
      loadExpenses();
    } catch (err) {
      setFormError('Something went wrong. Please try again.');
    }
    setFormLoading(false);
  }

  async function handleDelete(id) {
    try {
      await axiosInstance.delete(`/expenses/delete/${id}`);
      setDeleteId(null);
      loadExpenses();
    } catch (err) {
      console.log('Delete failed', err);
    }
  }

  function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  function formatDateTime(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  return (
    <div className="expense-list-container">
      <div className="page-top-row">
        <h1 className="page-heading">My Expenses</h1>
        <button className="add-btn" onClick={openAddForm}>
          + Add Expense
        </button>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', color: '#94a3b8', padding: '40px' }}>Loading...</p>
      ) : expenses.length === 0 ? (
        <div className="empty-box">
          <p>No expenses found. Click "Add Expense" to get started.</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="main-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Comments</th>
                <th>Created At</th>
                <th>Updated At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((exp, index) => (
                <tr key={exp.id}>
                  <td style={{ color: '#94a3b8', fontSize: '13px' }}>{index + 1}</td>
                  <td>
                    <span className="cat-chip">{exp.category}</span>
                  </td>
                  <td>
                    <strong style={{ color: '#059669' }}>
                      ₹{parseFloat(exp.amount).toFixed(2)}
                    </strong>
                  </td>
                  <td style={{ color: '#64748b', maxWidth: '180px' }}>
                    {exp.comments ? exp.comments : <span style={{ color: '#cbd5e1' }}>-</span>}
                  </td>
                  <td style={{ color: '#64748b', fontSize: '13px', whiteSpace: 'nowrap' }}>
                    {formatDate(exp.createdAt)}
                  </td>
                  <td style={{ color: '#64748b', fontSize: '13px', whiteSpace: 'nowrap' }}>
                    {formatDateTime(exp.updatedAt)}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        className="edit-btn"
                        onClick={() => openEditForm(exp)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => setDeleteId(exp.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Modal */}
      {showForm && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <h3 className="modal-title">
              {editingExpense ? 'Edit Expense' : 'Add New Expense'}
            </h3>

            {formError && <div className="form-err">{formError}</div>}

            <form onSubmit={handleSubmit}>
              <div className="field-group">
                <label className="field-label">Category *</label>
                <select
                  className="field-input"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">-- Select Category --</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field-group">
                <label className="field-label">Amount (₹) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="field-input"
                  placeholder="e.g. 250.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              <div className="field-group">
                <label className="field-label">Comments (optional)</label>
                <textarea
                  className="field-input"
                  rows="3"
                  placeholder="Add a note..."
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={closeForm}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="save-btn"
                  disabled={formLoading}
                >
                  {formLoading ? 'Saving...' : editingExpense ? 'Update' : 'Add Expense'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div className="modal-backdrop">
          <div className="modal-box" style={{ maxWidth: '380px' }}>
            <h3 className="modal-title">Confirm Delete</h3>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>
              Are you sure you want to delete this expense? This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setDeleteId(null)}>
                Cancel
              </button>
              <button
                className="save-btn"
                style={{ backgroundColor: '#ef4444' }}
                onClick={() => handleDelete(deleteId)}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ExpenseList;
