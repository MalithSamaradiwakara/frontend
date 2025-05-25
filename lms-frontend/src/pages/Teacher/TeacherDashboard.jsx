import React, { useState, useEffect } from 'react';
import { authService, teacherService } from '../../services/apiService';
import defaultProfileImage from '../../pic/dummy.jpg';
import '../../styles/TeacherDashboard.css';

const TeacherDashboard = () => {
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeacherProfile = async () => {
      try {
        const loginId = localStorage.getItem('userId');
        if (!loginId) throw new Error('No user ID found');

        // First get teacher ID from login
        const loginData = await authService.getLoginById(loginId);
        const teacherId = loginData.teacherId;

        if (!teacherId) throw new Error('No teacher ID found');

        // Then get teacher details
        const teacherData = await teacherService.getById(teacherId);
        setTeacher(teacherData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching teacher profile:', err);
        setError(err.message || 'Failed to load teacher profile');
        setLoading(false);
      }
    };

    fetchTeacherProfile();
  }, []);

  if (loading) return <div className="teacher-dashboard-loading">Loading profile...</div>;
  if (error) return <div className="teacher-dashboard-error">{error}</div>;
  if (!teacher) return <div className="teacher-dashboard-error">No profile data found</div>;

  return (
    <div className="teacher-dashboard">
      <div className="teacher-profile-card">
        <div className="profile-header">
          <div className="profile-image">
            <img 
              src={teacher.tPhoto || defaultProfileImage} 
              alt={teacher.tName}
            />
          </div>
          <div className="profile-info">
            <h1>{teacher.tName}</h1>
            <p className="teacher-title">{teacher.tDescription || 'Teacher'}</p>
            <p className="teacher-email">{teacher.tEmail}</p>
          </div>
        </div>

        <div className="profile-details">
          <div className="detail-section">
            <h2>Qualifications</h2>
            <div className="detail-grid">
              {teacher.qualification && teacher.qualification.length > 0 ? (
                teacher.qualification.map((qual, index) => (
                  <div className="detail-item" key={index}>
                    <span>{qual}</span>
                  </div>
                ))
              ) : (
                <div className="detail-item">Not provided</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
