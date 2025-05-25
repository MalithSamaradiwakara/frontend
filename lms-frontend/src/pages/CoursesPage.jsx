import React, { useState, useEffect } from "react";
import CourseCard from "../components/CourseCard";
import { courseService } from "../services/apiService";
import "../styles/CoursesPage.css";

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch courses from the API
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const coursesData = await courseService.getAll();
      // Filter only active courses for public display
      const activeCourses = coursesData.filter(course => course.isActive !== false);
      setCourses(activeCourses);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch courses. Please try again later.");
      setLoading(false);
    }
  };

  return (
    <div className="courses-container">
      <div className="courses-header">
        <div>
          <h2>Explore Our Courses</h2>
          <h1>Select Your <span className="highlight">Subject</span></h1>
        </div>
      </div>
      
      {loading ? (
        <div className="loading">Loading courses...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <div className="course-list">
          {courses.map((course) => (
            <CourseCard 
              key={course.id} 
              course={course}
            />
          ))}
        </div>
      )}
    </div>
  );
}