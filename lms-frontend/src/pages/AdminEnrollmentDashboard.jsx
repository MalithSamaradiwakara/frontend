import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { enrollmentService } from '../services/apiService';
import { API_BASE_URL } from '../services/api';
import "../styles/AdminEnrollmentDashboard.css";

const AdminEnrollmentDashboard = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [pendingEnrollments, setPendingEnrollments] = useState([]);
  const [stats, setStats] = useState({
    totalEnrollments: 0,
    pendingCount: 0,
    approvedCount: 0,
    rejectedCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetchEnrollmentData();
    fetchEnrollmentStats();
  }, []);

  const fetchEnrollmentData = async () => {
    try {
      const [allEnrollments, pendingEnrollments] = await Promise.all([
        enrollmentService.getAll(),
        enrollmentService.getPending()
      ]);
      console.log('All Enrollments:', allEnrollments);
      console.log('Pending Enrollments:', pendingEnrollments);
      setEnrollments(allEnrollments);
      setPendingEnrollments(pendingEnrollments);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching enrollment data:", err);
      setError("Failed to load enrollment data. Please try again later.");
      setLoading(false);
    }
  };

  const fetchEnrollmentStats = async () => {
    try {
      const statsData = await enrollmentService.getStats();
      setStats(statsData);
    } catch (err) {
      console.error("Error fetching enrollment statistics:", err);
    }
  };

  const handleStatusChange = async (studentId, courseId, newStatus) => {
    try {
      if (!studentId || !courseId) {
        console.error('Invalid studentId or courseId:', { studentId, courseId });
        setError('Invalid enrollment data. Please try again.');
        return;
      }

      if (newStatus === "Approved") {
        await enrollmentService.approve(studentId, courseId);
      } else if (newStatus === "Rejected") {
        await enrollmentService.reject(studentId, courseId);
      }
      fetchEnrollmentData();
      fetchEnrollmentStats();
    } catch (err) {
      console.error(`Error updating enrollment:`, err);
      setError(`Failed to ${newStatus.toLowerCase()} enrollment. Please try again.`);
    }
  };

  const getFilteredEnrollments = () => {
    if (activeTab === "pending") return pendingEnrollments;
    if (activeTab === "approved") return enrollments.filter(e => e.status === "Approved");
    if (activeTab === "rejected") return enrollments.filter(e => e.status === "Rejected");
    return enrollments;
  };

  const downloadPaymentSlip = (filepath) => {
    const url = enrollmentService.getPaymentSlipUrl(filepath);
    window.open(url, '_blank');
  };

  if (loading) return <div className="admin-loading">Loading enrollment data...</div>;
  if (error) return <div className="admin-error">{error}</div>;

  return (
    <div className="admin-enrollment-dashboard">
      <h1>Enrollment Management</h1>

      <div className="enrollment-stats">
        <div className="stat-card">
          <span className="stat-value">{stats.totalEnrollments}</span>
          <span className="stat-label">Total Enrollments</span>
        </div>
        <div className="stat-card pending">
          <span className="stat-value">{stats.pendingCount}</span>
          <span className="stat-label">Pending</span>
        </div>
        <div className="stat-card approved">
          <span className="stat-value">{stats.approvedCount}</span>
          <span className="stat-label">Approved</span>
        </div>
        <div className="stat-card rejected">
          <span className="stat-value">{stats.rejectedCount}</span>
          <span className="stat-label">Rejected</span>
        </div>
      </div>

      <div className="enrollment-tabs">
        <button className={activeTab === "all" ? "active" : ""} onClick={() => setActiveTab("all")}>All</button>
        <button className={activeTab === "pending" ? "active" : ""} onClick={() => setActiveTab("pending")}>Pending ({stats.pendingCount})</button>
        <button className={activeTab === "approved" ? "active" : ""} onClick={() => setActiveTab("approved")}>Approved</button>
        <button className={activeTab === "rejected" ? "active" : ""} onClick={() => setActiveTab("rejected")}>Rejected</button>
      </div>

      <div className="enrollment-table-container">
        <table className="enrollment-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Course</th>
              <th>Date</th>
              <th>Ref</th>
              <th>Slip</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {getFilteredEnrollments().length === 0 ? (
              <tr>
                <td colSpan="7" className="no-enrollments">No enrollments in this category</td>
              </tr>
            ) : (
              getFilteredEnrollments().map((e, index) => {
                console.log('Enrollment object:', e);
                const studentId = e.student?.id || e.studentId;
                const courseId = e.course?.id || e.courseId;
                const status = e.status?.toLowerCase() ?? 'unknown';
                console.log('Extracted IDs:', { studentId, courseId, status });

                return (
                  <tr key={`${studentId}-${courseId}-${index}`}>
                    <td>
                      <Link to={`/admin/students/view/${studentId}`} className="student-link">
                        {e.studentName || e.student?.name || 'N/A'}
                      </Link>
                      <div className="student-email">{e.studentEmail || e.student?.email || 'N/A'}</div>
                    </td>
                    <td>
                      <div>{e.courseName || e.course?.title || 'N/A'}</div>
                    </td>
                    <td>{e.enrollDate ? new Date(e.enrollDate).toLocaleDateString() : 'N/A'}</td>
                    <td>{e.paymentRefNum || 'N/A'}</td>
                    <td>
                      {e.paymentSlipPath ? (
                        <button onClick={() => downloadPaymentSlip(e.paymentSlipPath)} className="view-slip-btn">View</button>
                      ) : "No slip"}
                    </td>
                    <td>
                      <span className={`status-badge ${status}`}>{e.status}</span>
                    </td>
                    <td>
                      {status === "pending" && (
                        <>
                          <button className="approve-btn" onClick={() => handleStatusChange(studentId, courseId, "Approved")}>Approve</button>
                          <button className="reject-btn" onClick={() => handleStatusChange(studentId, courseId, "Rejected")}>Reject</button>
                        </>
                      )}
                      {status === "approved" && (
                        <button className="reject-btn" onClick={() => handleStatusChange(studentId, courseId, "Rejected")}>Cancel</button>
                      )}
                      {status === "rejected" && (
                        <button className="approve-btn" onClick={() => handleStatusChange(studentId, courseId, "Approved")}>Approve</button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminEnrollmentDashboard;
