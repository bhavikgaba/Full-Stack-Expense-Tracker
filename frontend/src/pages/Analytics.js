import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import axiosInstance from '../services/axiosInstance';
import './Analytics.css';

// register chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

// colors for different categories in pie chart
const PIE_COLORS = [
  '#6366f1',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#3b82f6',
  '#8b5cf6',
  '#06b6d4',
  '#ec4899',
  '#84cc16',
  '#f97316',
];

function Analytics() {
  const [categoryData, setCategoryData] = useState({});
  const [loading, setLoading] = useState(true);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    loadCategoryData();
  }, []);

  async function loadCategoryData() {
    try {
      const response = await axiosInstance.get('/expenses/category-summary');
      setCategoryData(response.data);

      // calculate total
      let total = 0;
      Object.values(response.data).forEach((val) => {
        total += parseFloat(val);
      });
      setTotalAmount(total);
    } catch (error) {
      console.log('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  }

  const categories = Object.keys(categoryData);
  const amounts = Object.values(categoryData).map((v) => parseFloat(v));

  const chartData = {
    labels: categories,
    datasets: [
      {
        data: amounts,
        backgroundColor: PIE_COLORS.slice(0, categories.length),
        borderColor: '#ffffff',
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          font: {
            size: 13,
            family: 'Inter',
          },
          padding: 16,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const value = context.raw;
            const percentage = ((value / totalAmount) * 100).toFixed(1);
            return ` ₹${value.toFixed(2)} (${percentage}%)`;
          },
        },
      },
    },
  };

  if (loading) {
    return <div className="loading-div">Loading analytics...</div>;
  }

  return (
    <div className="analytics-container">
      <h1 className="page-heading">Analytics</h1>
      <p style={{ color: '#64748b', marginBottom: '28px', fontSize: '14px' }}>
        Category-wise breakdown of your total expenses
      </p>

      {categories.length === 0 ? (
        <div className="no-data-box">
          <p>No expense data available yet. Add some expenses to see the chart.</p>
        </div>
      ) : (
        <div className="analytics-layout">
          {/* pie chart */}
          <div className="chart-card">
            <h2 className="section-heading">Expense Distribution</h2>
            <div style={{ height: '380px' }}>
              <Pie data={chartData} options={chartOptions} />
            </div>
          </div>

          {/* breakdown table */}
          <div className="breakdown-card">
            <h2 className="section-heading">Category Breakdown</h2>
            <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '16px' }}>
              Total: <strong style={{ color: '#1e293b' }}>₹{totalAmount.toFixed(2)}</strong>
            </p>
            <table className="breakdown-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>% Share</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat, index) => {
                  const amt = parseFloat(categoryData[cat]);
                  const percentage = ((amt / totalAmount) * 100).toFixed(1);
                  return (
                    <tr key={cat}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span
                            style={{
                              width: '12px',
                              height: '12px',
                              borderRadius: '3px',
                              backgroundColor: PIE_COLORS[index % PIE_COLORS.length],
                              display: 'inline-block',
                              flexShrink: 0,
                            }}
                          />
                          {cat}
                        </div>
                      </td>
                      <td style={{ fontWeight: '600', color: '#059669' }}>
                        ₹{amt.toFixed(2)}
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div
                            style={{
                              height: '6px',
                              width: '80px',
                              backgroundColor: '#f1f5f9',
                              borderRadius: '10px',
                              overflow: 'hidden',
                            }}
                          >
                            <div
                              style={{
                                height: '100%',
                                width: `${percentage}%`,
                                backgroundColor: PIE_COLORS[index % PIE_COLORS.length],
                                borderRadius: '10px',
                              }}
                            />
                          </div>
                          <span style={{ fontSize: '13px', color: '#64748b' }}>{percentage}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default Analytics;
