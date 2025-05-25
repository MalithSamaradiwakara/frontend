import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";
import CourseCard from "../components/CourseCard";
import { courseService } from "../services/apiService";

const HomePage = () => {
  const [showMoreTeachers, setShowMoreTeachers] = useState(false); // State to track if we show more teachers
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Toggle function for ' View All ' teachers
  const toggleTeacherVisibility = () => {
    setShowMoreTeachers(!showMoreTeachers);
  };

  // Fetch courses from the API
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const coursesData = await courseService.getAll();
        // Get only the first 6 courses for the homepage
        const limitedCourses = coursesData.slice(0, 6);
        setCourses(limitedCourses);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch courses. Please try again later.");
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Discover <span className="text-highlight">Your Path to Success</span> with Brightway
          </h1>
          <p className="hero-description">
            Tired of feeling overwhelmed with traditional learning? Starting with our interactive online courses, with our extensive 
            course library and engaging video lessons, you can learn at your own pace and convenience!
          </p>
          <button className="primary-button">Get Started</button>
        </div>
        <div className="hero-images">
          <img src="/images/Portrait of indian teacher smiling while teaching the kids in the school _ Premium AI-generated image.jpg" alt="Student 1" className="student-image" />
          <img src="/images/Premium Photo _ Portrait of a teacher at the blackboard in the classroom_.jpg" alt="Student 2" className="student-image" />
          <img src="/images/Учительница.jpg" alt="Student 3" className="student-image" />
        </div>
      </section>

      {/* Courses Section */}
      <section className="courses-section">
        <div className="section-header">
          <h2 className="section-title">
            Our <span className="text-highlight">Featured Courses</span>
          </h2>
          <Link to="/courses" className="view-all-link">View All Courses</Link>
        </div>
        
        {loading ? (
          <div className="loading">Loading courses...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <div className="courses-grid">
            {courses.length > 0 ? (
              courses.map((course) => (
                <CourseCard 
                  key={course.id} 
                  course={course}
                  onEdit={() => {}} // Empty function as we don't need edit on homepage
                  onDelete={() => {}} // Empty function as we don't need delete on homepage
                />
              ))
            ) : (
              // Fallback to static courses if API returns no courses
              <>
                <div className="course-card">
                  <h3 className="course-title">Mathematics Excellence</h3>
                  <p className="course-description">Master mathematics with our comprehensive, all-level curriculum</p>
                  <button className="small-button">Learn More</button>
                </div>
                
                <div className="course-card">
                  <h3 className="course-title">Science Discovery</h3>
                  <p className="course-description">Explore the wonders of science through interactive experiments and engaging lessons.</p>
                  <button className="small-button">Learn More</button>
                </div>
                <div className="course-card">
                  <h3 className="course-title">Language Arts</h3>
                  <p className="course-description">Develop strong communication skills through our language and literature courses.</p>
                  <button className="small-button">Learn More</button>
                </div>
                <div className="course-card">
                  <h3 className="course-title">Computer Science</h3>
                  <p className="course-description">Learn programming, web development, and other tech skills for the digital age.</p>
                  <button className="small-button">Learn More</button>
                </div>
                <div className="course-card">
                  <h3 className="course-title">Business Studies</h3>
                  <p className="course-description">Understand business principles and develop entrepreneurial mindset with our expert guidance.</p>
                  <button className="small-button">Learn More</button>
                </div>
                <div className="course-card">
                  <h3 className="course-title">Exam Preparation</h3>
                  <p className="course-description">Get ready for standardized tests with our proven strategies and practice materials.</p>
                  <button className="small-button">Learn More</button>
                </div>
              </>
            )}
          </div>
        )}
      </section>

      {/* Teachers Section */}
      <section className="teachers-section">
        <h2 className="section-title">
          Get to know our Brightway <span className="text-highlight">Teachers</span>
        </h2>
        <div className="teachers-container">
          {/* Display the first four teachers*/}
          <div className="teacher-card">
            <img src="/images/Portrait of indian teacher smiling while teaching the kids in the school _ Premium AI-generated image.jpg" alt="Teacher Name" className="teacher-image" />
            <h3 className="teacher-name">Dr. Michael Roberts</h3>
            <button className="small-button">View Profile</button>
          </div>
          <div className="teacher-card">
            <img src="/images/Premium Photo _ Portrait of a teacher at the blackboard in the classroom_.jpg" alt="Teacher Name" className="teacher-image" />
            <h3 className="teacher-name">Prof. Jennifer Lee</h3>
            <button className="small-button">View Profile</button>
          </div>
          <div className="teacher-card">
            <img src="/images/Учительница.jpg" alt="Teacher Name" className="teacher-image" />
            <h3 className="teacher-name">Dr. David Wilson</h3>
            <button className="small-button">View Profile</button>
          </div>
          <div className="teacher-card">
            <img src="/images/Teacher.jpg" alt="Teacher Name" className="teacher-image" />
            <h3 className="teacher-name">Prof. Sarah Johnson</h3>
            <button className="small-button">View Profile</button>
          </div>

          {/*'View All teachers*/}
          {showMoreTeachers && (
            <>
              <div className="teacher-card">
                <img src="/images/teacherpic.jpg" alt="Teacher Name" className="teacher-image" />
                <h3 className="teacher-name">Dr. Michael Roberts</h3>
                <button className="small-button">View Profile</button>
              </div>
              <div className="teacher-card">
                <img src="/images/Senior professor sitting on desk with book in classroom _ Free Photo.jpg" alt="Teacher Name" className="teacher-image" />
                <h3 className="teacher-name">Prof. Jennifer Lee</h3>
                <button className="small-button">View Profile</button>
              </div>
              <div className="teacher-card">
                <img src="/images/teacherpic.jpg" alt="Teacher Name" className="teacher-image" />
                <h3 className="teacher-name">Dr. David Wilson</h3>
                <button className="small-button">View Profile</button>
              </div>
              <div className="teacher-card">
                <img src="/images/Professor masculino fotorrealista na escola Inteligência Artificial Generativa _ imagem Premium gerada com IA.jpg" alt="Teacher Name" className="teacher-image" />
                <h3 className="teacher-name">Prof. Sarah Johnson</h3>
                <button className="small-button">View Profile</button>
              </div>
            </>
          )}
        </div>
        <button className="outline-button" onClick={toggleTeacherVisibility}>
          {showMoreTeachers ? "View Less" : "View All"}
        </button>
      </section>

      {/* Support Section */}
      <section className="support-section">
        <h2 className="section-title">Support You 24/7</h2>
        <div className="support-cards">
          <div className="support-card">
            <p className="support-text">Need help with enrollment? Our enrollment specialists are here to assist you.</p>
            <button className="support-button">Contact Enrollment</button>
          </div>
          <div className="support-card">
            <p className="support-text">Technical issues? Our IT support team is ready to solve your problems.</p>
            <button className="support-button">Technical Support</button>
          </div>
          <div className="support-card">
            <p className="support-text">Questions about coursework? Our academic advisors are standing by.</p>
            <button className="support-button">Academic Support</button>
          </div>
          <div className="support-card">
            <p className="support-text">Financial aid questions? Our finance team is ready to help.</p>
            <button className="support-button">Financial Support</button>
          </div>
          <div className="support-card">
            <p className="support-text">Career guidance needed? Our career counselors are at your service.</p>
            <button className="support-button">Career Support</button>
          </div>
        </div>
        <button className="primary-button small">Contact Us</button>
      </section>

      {/*Footer*/}
      <footer className="dark-footer">
        <div className="footer-content">
          <div className="footer-logo-section">
            <img src="images/Screenshot 2025-04-26 133628.png" alt="Brightway Logo" className="footer-logo" />
            <p className="footer-tagline">
              Discovering potential through education. Your journey to success starts with Brightway, 
              your premier education platform.
            </p>
            <div className="social-links">
              <a href="#" className="social-icon">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="social-icon">
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a href="#" className="social-icon">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>
          
          <div className="footer-contact-section">
            <h3 className="footer-heading">Reach Us</h3>
            <div className="contact-info">
              <p>
                <i className="fas fa-map-marker-alt"></i>
                No.241/1 G Warana Road, Thihariya
              </p>
              <p>
                <i className="fas fa-phone"></i>
                072 299 7772
              </p>
              <p>
                <i className="fas fa-phone"></i>
                077 343 7459
              </p>
              <p>
                <i className="fas fa-envelope"></i>
                brightway.education@example.com
              </p>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>Copyright © 2023 Brightway. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;