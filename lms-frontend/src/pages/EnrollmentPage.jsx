import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { courseService, enrollmentService } from '../services/apiService';
import '../styles/EnrollmentPage.css';

const API_BASE_URL = "http://localhost:8080/api";

const EnrollmentPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentSlip, setPaymentSlip] = useState(null);
  const [paymentRef, setPaymentRef] = useState('');
  const [enrolling, setEnrolling] = useState(false);
  const [message, setMessage] = useState('');

  // Check if user is logged in
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const userType = localStorage.getItem('userType');
    
    if (!userId || userType !== 'Student') {
      // Redirect to login page if not logged in or not a student
      navigate('/login', { 
        state: { 
          redirectUrl: `/enroll/${courseId}`,
          message: 'Please log in as a student to enroll in this course.'
        }
      });
    } else {
      // Fetch course details
      fetchCourseDetails();
    }
  }, [courseId, navigate]);

  const fetchCourseDetails = async () => {
    if (!courseId || isNaN(courseId)) {
      setError("Invalid course ID.");
      setLoading(false);
      return;
    }

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type (accepts images and PDFs)
      const fileType = file.type;
      if (fileType.startsWith('image/') || fileType === 'application/pdf') {
        setPaymentSlip(file);
        setMessage('');
      } else {
        setMessage('Please upload a valid image or PDF file.');
        e.target.value = '';
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!paymentSlip) {
      setMessage('Please upload your payment slip');
      return;
    }
    
    if (!paymentRef.trim()) {
      setMessage('Please enter payment reference number');
      return;
    }
    
    setEnrolling(true);
    setMessage('');
    
    try {
      const studentId = localStorage.getItem('studentId');
      console.log("Logged-in Student ID:", studentId);

      const formData = new FormData();
      formData.append('file', paymentSlip);
      formData.append('studentId', studentId);
      formData.append('courseId', courseId);
      
      // Upload payment slip using enrollmentService
      const uploadResponse = await enrollmentService.uploadPaymentSlip(formData);
      
      // Create enrollment record using enrollmentService
      const enrollResponse = await enrollmentService.create({
        studentId: studentId,
        courseId: courseId,
        paymentRef: paymentRef,
        date: new Date().toISOString().split('T')[0],
        paymentSlipPath: uploadResponse.filePath
      });
      
      setMessage('Enrollment successful! You will be redirected to your dashboard.');
      
      // Redirect to student dashboard after successful enrollment
      setTimeout(() => {
        navigate('/student/dashboard');
      }, 3000);
      
    } catch (error) {
      console.error('Enrollment failed:', error);
      setMessage(error.response?.data?.message || 'Enrollment failed. Please try again.');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return <div className="loading-container">Loading enrollment details...</div>;
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
    <div className="enrollment-container">
      <div className="enrollment-header">
        <Link to={`/courses/${courseId}`} className="back-button">
          &larr; Back to Course Details
        </Link>
        <h1>Course Enrollment</h1>
      </div>

      <div className="enrollment-content">
        <div className="cart-summary">
          <h2>Your Cart (1)</h2>
          <p className="cart-description">Courses in your cart will be displayed here.</p>
          
          <div className="cart-item">
            <div className="cart-item-details">
              <h3>{course.title}</h3>
              <p>{course.level} | {course.duration}</p>
              <div className="payment-cycle">Monthly</div>
            </div>
            <div className="cart-item-price">
              <p className="price-date">2025 May</p>
              <p className="price-amount">LKR {course.price?.toFixed(2)}</p>
              <button className="remove-btn" title="Remove from cart">
                <i className="fa fa-trash"></i>
              </button>
            </div>
          </div>
          
          <div className="cart-summary-box">
            <h3>Cart Summary</h3>
            <div className="summary-item">
              <span>{course.title}</span>
              <span className="price">LKR {course.price?.toFixed(2)}</span>
            </div>
            <div className="summary-total">
              <span>Total</span>
              <span className="price">LKR {course.price?.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        <div className="payment-details">
          <h2>Payment Details</h2>
          
          <form onSubmit={handleSubmit} className="payment-form">
            <div className="payment-instructions">
              <h3>Bank Transfer Instructions</h3>
              <p>Please transfer the exact amount of <strong>LKR {course.price?.toFixed(2)}</strong> to:</p>
              <ul>
                <li><strong>Bank:</strong> Bank of Ceylon</li>
                <li><strong>Account Name:</strong> Brightway Education Center</li>
                <li><strong>Account Number:</strong> 0012345678</li>
                <li><strong>Branch:</strong> Main Branch</li>
                <li><strong>Reference:</strong> Your Full Name</li>
              </ul>
            </div>
            
            <div className="form-group">
              <label htmlFor="paymentRef">Payment Reference Number</label>
              <input
                type="text"
                id="paymentRef"
                value={paymentRef}
                onChange={(e) => setPaymentRef(e.target.value)}
                placeholder="Enter your payment reference number"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="paymentSlip">Upload Payment Slip</label>
              <div className="file-upload-wrapper">
                <input
                  type="file"
                  id="paymentSlip"
                  onChange={handleFileChange}
                  accept="image/*,application/pdf"
                  required
                />
                <div className="file-upload-info">
                  {paymentSlip ? (
                    <span className="file-name">{paymentSlip.name}</span>
                  ) : (
                    <span className="file-placeholder">No file selected</span>
                  )}
                </div>
              </div>
              <small className="file-instructions">Upload a clear image or PDF of your payment slip/receipt</small>
            </div>
            
            {message && <div className={`message ${message.includes('successful') ? 'success' : 'error'}`}>{message}</div>}
            
            <button 
              type="submit" 
              className="checkout-button"
              disabled={enrolling}
            >
              {enrolling ? 'Processing...' : 'Complete Enrollment'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EnrollmentPage;