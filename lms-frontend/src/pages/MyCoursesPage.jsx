import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { enrollmentService } from "../services/apiService";
import "../styles/MyCoursesPage.css";
import "../styles/CourseCard.css"; // Import CourseCard styling

// Course icons mapping based on subject/category
const courseIcons = {
  programming: "💻",
  design: "🎨",
  business: "📊",
  science: "🔬",
  mathematics: "🧮",
  language: "🗣️",
  arts: "🎭",
  wellness: "🧘",
  default: "📚"
};

// Get appropriate icon based on course category or title
const getCourseIcon = (courseName, category) => {
  if (category) {
    const categoryLower = category.toLowerCase();
    
    if (categoryLower.includes("program") || categoryLower.includes("computer") || 
        categoryLower.includes("software") || categoryLower.includes("IT")) {
      return courseIcons.programming;
    } else if (categoryLower.includes("design") || categoryLower.includes("art")) {
      return courseIcons.design;
    } else if (categoryLower.includes("business") || categoryLower.includes("finance") || 
               categoryLower.includes("manage") || categoryLower.includes("economics")) {
      return courseIcons.business;
    } else if (categoryLower.includes("science") || categoryLower.includes("biology") || 
               categoryLower.includes("chemistry") || categoryLower.includes("physics")) {
      return courseIcons.science;
    } else if (categoryLower.includes("math") || categoryLower.includes("statistics")) {
      return courseIcons.mathematics;
    } else if (categoryLower.includes("language") || categoryLower.includes("english") || 
               categoryLower.includes("communication")) {
      return courseIcons.language;
    } else if (categoryLower.includes("art") || categoryLower.includes("music") || 
               categoryLower.includes("drama")) {
      return courseIcons.arts;
    } else if (categoryLower.includes("wellness") || categoryLower.includes("health") || 
               categoryLower.includes("fitness")) {
      return courseIcons.wellness;
    }
  }
  
  // Fallback to checking by course name if no category match
  const name = courseName?.toLowerCase() || "";
  
  if (name.includes("program") || name.includes("web") || name.includes("code") || name.includes("java") || 
      name.includes("python") || name.includes("javascript") || name.includes("development")) {
    return courseIcons.programming;
  } else if (name.includes("design") || name.includes("ui") || name.includes("ux") || name.includes("graphic")) {
    return courseIcons.design;
  } else if (name.includes("business") || name.includes("marketing") || name.includes("finance") || 
             name.includes("management") || name.includes("economics")) {
    return courseIcons.business;
  } else if (name.includes("science") || name.includes("biology") || name.includes("chemistry") || 
             name.includes("physics")) {
    return courseIcons.science;
  } else if (name.includes("math") || name.includes("calculus") || name.includes("statistics") || 
             name.includes("algebra")) {
    return courseIcons.mathematics;
  } else if (name.includes("language") || name.includes("english") || name.includes("spanish") || 
             name.includes("french") || name.includes("communication")) {
    return courseIcons.language;
  } else if (name.includes("art") || name.includes("music") || name.includes("paint") || 
             name.includes("drama") || name.includes("creative")) {
    return courseIcons.arts;
  } else if (name.includes("wellness") || name.includes("health") || name.includes("fitness") || 
             name.includes("yoga") || name.includes("meditation")) {
    return courseIcons.wellness;
  } else {
    return courseIcons.default;
  }
};

export default function MyCoursesPage() {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const studentId = localStorage.getItem("studentId");
    const userType = localStorage.getItem("userType");

    if (!studentId || userType !== "Student") {
      navigate("/login", {
        state: {
          message: "Please log in as a student to view your courses",
        },
      });
      return;
    }

    fetchApprovedCourses(studentId);
  }, [navigate]);

  const fetchApprovedCourses = async (studentId) => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to use the specific approved courses endpoint first
      let approvedCourses;
      try {
        approvedCourses = await enrollmentService.getApprovedByStudent(studentId);
      } catch (err) {
        // Fallback: Get all enrollments and filter approved ones
        console.log("Approved endpoint not available, using fallback method");
        const allEnrollments = await enrollmentService.getByStudent(studentId);
        approvedCourses = allEnrollments.filter(
          enrollment => enrollment.status === 'APPROVED' || enrollment.status === 'Approved'
        );
      }
      
      // Process the data to enhance it with visual elements
      const enhancedCourses = approvedCourses.map(course => ({
        ...course,
        icon: getCourseIcon(course.courseTitle, course.category),
      }));
      
      setEnrolledCourses(enhancedCourses);
    } catch (err) {
      console.error("Error fetching enrolled courses:", err);
      setError("Failed to load your courses. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleStartLearning = (courseId) => {
    navigate(`/course/${courseId}/content`);
  };

  const handleRefresh = () => {
    const studentId = localStorage.getItem("studentId");
    if (studentId) {
      fetchApprovedCourses(studentId);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your courses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">{error}</div>
        <button onClick={handleRefresh} className="retry-button">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="my-courses-container">
      <div className="my-courses-header">
        <h1>My Courses</h1>
        <p>Access your enrolled courses and continue learning</p>
      </div>

      {enrolledCourses.length === 0 ? (
        <div className="no-courses">
          <div className="no-courses-icon">📚</div>
          <h2>No Approved Courses Yet</h2>
          <p>
            You don't have any approved courses yet. If you've recently enrolled,
            your enrollment may be pending administrative approval.
          </p>
          <div className="no-courses-actions">
            <Link to="/courses" className="browse-courses-button">
              Browse Available Courses
            </Link>
            <button onClick={handleRefresh} className="check-status-button">
              Check Enrollment Status
            </button>
          </div>
        </div>
      ) : (
        <div className="enrolled-courses-section">
          <div className="courses-summary">
            <h2>Enrolled Courses ({enrolledCourses.length})</h2>
          </div>
          
          <div className="enrolled-courses-grid">
            {enrolledCourses.map((enrollment) => (
              <div className="course-card" key={enrollment.courseId || enrollment.id}>
                <div className="course-header">
                  <div className="course-icon">{enrollment.icon}</div>
                  <div className="course-status">
                    <span className="status approved">{enrollment.status}</span>
                  </div>
                </div>
                
                <div className="course-info">
                  <h3 className="course-title">{enrollment.courseTitle}</h3>
                  
                  <div className="course-meta">
                    <span className="course-code">{enrollment.courseCode}</span>
                    {enrollment.creditHours && (
                      <span className="credit-hours">
                        {enrollment.creditHours} Credits
                      </span>
                    )}
                  </div>

                  {enrollment.instructor && (
                    <div className="course-instructor">
                      <strong>Instructor:</strong> {enrollment.instructor}
                    </div>
                  )}
                  
                  <div className="enrollment-info">
                    <span className="enrollment-date">
                      Enrolled: {new Date(enrollment.enrollDate).toLocaleDateString()}
                    </span>
                  </div>
                  
                  {enrollment.courseDescription && (
                    <div className="course-description">
                      {enrollment.courseDescription.length > 100 
                        ? `${enrollment.courseDescription.substring(0, 100)}...` 
                        : enrollment.courseDescription}
                    </div>
                  )}
                </div>
                
                <div className="course-actions">
                  <button 
                    className="start-learning-button"
                    onClick={() => handleStartLearning(enrollment.courseId)}
                  >
                    Start Learning
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}