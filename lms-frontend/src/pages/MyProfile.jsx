import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService, studentService } from '../services/apiService';
import defaultProfileImage from '../pic/dummy.jpg';

const MyProfile = () => {
    const [student, setStudent] = useState({}); // State to store student details
    const [loading, setLoading] = useState(true); // Loading state
    const navigate = useNavigate(); // For navigation

    useEffect(() => {
        const loginId = localStorage.getItem('userId');
        
        if (!loginId) {
            navigate('/login');
            return;
        }

        const fetchStudentProfile = async () => {
            try {
                // First fetch login data to get student ID
                const loginData = await authService.getLoginById(loginId);
                const studentId = loginData.studentId;
                
                // Then fetch student details using the student ID
                const studentData = await studentService.getProfile(studentId);
                setStudent(studentData);
                setLoading(false);
            } catch (error) {
                console.error("Error loading profile:", error);
                alert(error.response?.data || "Failed to load profile. Please try again.");
                setLoading(false);
            }
        };

        fetchStudentProfile();
    }, [navigate]);

    if (loading) {
        return <div className="text-center mt-5">Loading...</div>; // Show loading indicator
    }

    const getProfilePhoto = (photoUrl) => {
        if (photoUrl) {
            return photoUrl;
        } else {
            return defaultProfileImage;
        }
    };

    return (
        <>
            {/* Banner */}
            <div className="container-fluid bg-primary text-white py-4 shadow-sm">
                <div className="container">
                    <h2 className="fw-bold mb-0">Welcome back, {student.name}</h2>
                    <p className="mb-0">Here's your profile overview and quick access to your courses and assignments.</p>
                </div>
            </div>

            {/* Profile Section */}
            <div className="container mt-4">
                <div className="row">
                    {/* Left Side - Profile Photo */}
                    <div className="col-md-4">
                        <div className="card shadow-sm border-0 rounded-4">
                            <div className="card-body text-center p-4">
                                <img 
                                    src={getProfilePhoto(student.photo)} 
                                    alt="Profile" 
                                    className="img-fluid rounded-circle mb-3"
                                    style={{ 
                                        width: '200px', 
                                        height: '200px', 
                                        objectFit: 'cover',
                                        border: '3px solid #0d6efd'
                                    }}
                                />
                                <button
                                    className="btn btn-outline-primary w-100"
                                    onClick={() => {
                                        const userId = localStorage.getItem('userId');
                                        if (!userId) {
                                            alert('Please log in to edit your profile');
                                            navigate('/login');
                                            return;
                                        }
                                        navigate(`/students/edit/${userId}`);
                                    }}
                                >
                                    Edit Profile
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Profile Information */}
                    <div className="col-md-8">
                        <div className="card shadow-sm border-0 rounded-4">
                            <div className="card-body p-4">
                                <h3 className="text-primary fw-bold mb-4">Profile Information</h3>
                                
                                <div className="row mb-3">
                                    <div className="col-md-4">
                                        <strong className="text-muted">Full Name:</strong>
                                    </div>
                                    <div className="col-md-8">
                                        <p className="mb-0">{student.name}</p>
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <div className="col-md-4">
                                        <strong className="text-muted">Email Address:</strong>
                                    </div>
                                    <div className="col-md-8">
                                        <p className="mb-0">{student.email}</p>
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <div className="col-md-4">
                                        <strong className="text-muted">Contact Number:</strong>
                                    </div>
                                    <div className="col-md-8">
                                        <p className="mb-0">{student.contact}</p>
                                    </div>
                                </div>

                                <div className="d-flex justify-content-center gap-3 mt-4">
                                    <Link to="/my-courses" className="btn btn-primary">
                                        My Courses
                                    </Link>
                                    <Link to={`/my-assignments/${localStorage.getItem('userId')}`} className="btn btn-primary">
                                        My Assignments
                                    </Link>
                                    <Link to={`/my-quizzes/${localStorage.getItem('userId')}`} className="btn btn-primary">
                                        My Quizzes
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MyProfile; 