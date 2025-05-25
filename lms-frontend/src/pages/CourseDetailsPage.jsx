import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { courseService } from "../services/apiService";
import "../styles/CourseDetailsPage.css";

const CourseDetailsPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    // Check authentication status
    const userId = localStorage.getItem('userId');
    const userType = localStorage.getItem('userType');
    
    if (userId && userType) {
      setUserLoggedIn(true);
      setUserType(userType);
    }

    if (!courseId || isNaN(courseId)) {
      setError("Invalid course ID.");
      setLoading(false);
      return;
    }

    const fetchCourseDetails = async () => {
      setLoading(true);
      try {
        const courseData = await courseService.getById(courseId);
        setCourse(courseData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching course details:", err);
        setError("Course not found or an error occurred while fetching data.");
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  const handleEnrollClick = () => {
    // Check if user is logged in
    if (!userLoggedIn) {
      // Redirect to login page with return URL
      navigate('/login', { 
        state: { 
          redirectUrl: `/enroll/${courseId}`,
          message: 'Please log in to enroll in this course.'
        }
      });
      return;
    }
    
    // Check if user is a student
    if (userType !== 'Student') {
      alert('Only students can enroll in courses.');
      return;
    }
    
    // Navigate to enrollment page
    navigate(`/enroll/${courseId}`);
  };

  if (loading) {
    return <div className="loading-container">Loading course details...</div>;
  }

  if (error || !course) {
    return (
      <div className="course-not-found">
        <h2>Course Not Found</h2>
        <p>{error || "Sorry, we couldn't find the course you're looking for."}</p>
        <Link to="/courses" className="back-button">Back to Courses</Link>
      </div>
    );
  }

  return (
    <div className="course-details-container">
      <div className="course-details-header">
        <Link to="/courses" className="back-button">
          &larr; Back to Courses
        </Link>
        <div className="course-title-section">
          <div className="course-icon-large">{course.icon}</div>
          <h1>{course.title}</h1>
        </div>
        <p className="course-brief">{course.description}</p>
      </div>

      <div className="course-details-grid">
        <div className="course-description">
          <h2>Course Overview</h2>
          <p>{course.fullDescription}</p>

          <h2>Topics Covered</h2>
          <ul className="topics-list">
            {course.topics && course.topics.map((topic, index) => (
              <li key={index}>{topic}</li>
            ))}
          </ul>

          {/* Teacher Information Section */}
          {course.teacher && (
            <div className="teacher-section">
              <h2>About Your Instructor</h2>
              <div className="teacher-info">
                <div className="teacher-profile">
                  {course.teacher.tPhoto && (
                    <img 
                      src={course.teacher.tPhoto} 
                      alt={course.teacher.tName}
                      className="teacher-photo"
                    />
                  )}
                  <div className="teacher-details">
                    <h3>{course.teacher.tName}</h3>
                    <p className="teacher-email">{course.teacher.tEmail}</p>
                    {course.teacher.tDescription && (
                      <p className="teacher-description">{course.teacher.tDescription}</p>
                    )}
                    
                    {course.teacher.qualification && course.teacher.qualification.length > 0 && (
                      <div className="teacher-qualifications">
                        <h4>Qualifications:</h4>
                        <ul className="qualifications-list">
                          {course.teacher.qualification.map((qual, index) => (
                            <li key={index}>{qual}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="course-meta">
          <div className="meta-card">
            <h3>Course Details</h3>
            <div className="meta-item">
              <span className="meta-label">Duration:</span>
              <span className="meta-value">{course.duration}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Level:</span>
              <span className="meta-value">{course.level}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Prerequisites:</span>
              <span className="meta-value">{course.prerequisites}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Price:</span>
              <span className="meta-value">LKR {course.price?.toFixed(2)}</span>
            </div>
            <button 
              className="enroll-button"
              onClick={handleEnrollClick}
            >
              Enroll Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsPage;