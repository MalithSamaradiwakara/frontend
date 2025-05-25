import React from 'react';
import "../styles/AdminPage.css";

const AdminPage = () => {
  // Sample statistics data - in a real app, this would come from your API
  const stats = {
    totalCourses: 24,
    activeCourses: 18,
    totalStudents: 352,
    totalEnrollments: 587,
    totalRevenue: 1250500,
    recentPayments: [
      { id: 1, student: "John Doe", course: "Advanced JavaScript", amount: 15000, date: "2023-04-28" },
      { id: 2, student: "Jane Smith", course: "Data Science Basics", amount: 12500, date: "2023-04-27" },
      { id: 3, student: "Mike Johnson", course: "UI/UX Design", amount: 18000, date: "2023-04-25" },
    ]
  };

  return (
    <div className="admin-page">
      <h1 className="admin-page-title">Admin Dashboard</h1>
      
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalCourses}</div>
            <div className="stat-label">Total Courses</div>
          </div>
        </div>
        
        <div className="admin-stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-value">{stats.activeCourses}</div>
            <div className="stat-label">Active Courses</div>
          </div>
        </div>
        
        <div className="admin-stat-card">
          <div className="stat-icon">👨‍🎓</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalStudents}</div>
            <div className="stat-label">Total Students</div>
          </div>
        </div>
        
        <div className="admin-stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalEnrollments}</div>
            <div className="stat-label">Total Enrollments</div>
          </div>
        </div>
      </div>
      
      <div className="admin-dashboard-sections">
        <div className="admin-section revenue-section">
          <h2>Total Revenue</h2>
          <div className="revenue-amount">LKR {stats.totalRevenue.toLocaleString()}</div>
        </div>
        
        <div className="admin-section recent-payments">
          <h2>Recent Payments</h2>
          <table className="payments-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Course</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentPayments.map(payment => (
                <tr key={payment.id}>
                  <td>{payment.student}</td>
                  <td>{payment.course}</td>
                  <td>LKR {payment.amount.toLocaleString()}</td>
                  <td>{new Date(payment.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="admin-quick-actions">
        <h2>Quick Actions</h2>
        <div className="quick-actions-grid">
          <a href="/admin/courses" className="quick-action-card">
            <div className="quick-action-icon">📚</div>
            <div className="quick-action-title">Manage Courses</div>
          </a>
          <a href="/admin/students" className="quick-action-card">
            <div className="quick-action-icon">👨‍🎓</div>
            <div className="quick-action-title">Manage Students</div>
          </a>
          <a href="/admin/tutors" className="quick-action-card">
            <div className="quick-action-icon">👨‍🏫</div>
            <div className="quick-action-title">Manage Tutors</div>
          </a>
          <a href="/admin/reports" className="quick-action-card">
            <div className="quick-action-icon">📈</div>
            <div className="quick-action-title">View Reports</div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;