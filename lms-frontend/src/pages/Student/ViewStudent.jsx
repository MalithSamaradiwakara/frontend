import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { studentService } from '../../services/apiService';
import defaultProfileImage from '../../pic/dummy.jpg';

export default function ViewStudent() {
    const [student, setStudent] = useState({
        name: "",
        email: "",
        contact: "",
        photo: "",
        enrollments: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        if (!id) {
            setError("Invalid student ID");
            setLoading(false);
            return;
        }
        loadStudent();
    }, [id]);

    const loadStudent = async () => {
        try {
            const studentData = await studentService.getById(id);
            if (!studentData) {
                throw new Error("No student data received");
            }
            setStudent(studentData);
            setError(null);
        } catch (error) {
            console.error("Error loading student:", error);
            if (error.response?.status === 404) {
                setError("Student not found");
            } else {
                setError("Failed to load student details. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const getStudentPhoto = (photoUrl) => {
        return photoUrl || defaultProfileImage;
    };

    if (loading) {
        return (
            <div className="text-center mt-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Banner */}
            <div className="container-fluid bg-primary text-white py-4 shadow-sm">
        <div className="container">
                    <h2 className="fw-bold mb-0">Student Profile</h2>
                    <p className="mb-0">View student details and enrolled courses</p>
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
                                    src={getStudentPhoto(student.photo)} 
                                    alt="Profile" 
                                    className="img-fluid rounded-circle mb-3"
                                    style={{ 
                                        width: '200px', 
                                        height: '200px', 
                                        objectFit: 'cover',
                                        border: '3px solid #0d6efd'
                                    }}
                                />
                                <Link className="btn btn-outline-primary w-100" to="/admin/students">
                                    Back to Students
                                </Link>
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

                                {student.enrollments && student.enrollments.length > 0 && (
                                    <div className="mt-4">
                                        <h4 className="text-primary fw-bold mb-3">Enrolled Courses</h4>
                                        <div className="list-group">
                                            {student.enrollments.map((enrollment, index) => (
                                                <div key={index} className="list-group-item border-0 bg-light mb-2 rounded">
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <div>
                                                            <h6 className="mb-1">{enrollment.courseName}</h6>
                                                            <small className="text-muted">
                                                                Enrolled: {new Date(enrollment.enrollDate).toLocaleDateString()}
                                                            </small>
                                                        </div>
                                                        <span className={`badge ${
                                                            enrollment.status.toLowerCase() === 'approved' ? 'bg-success' :
                                                            enrollment.status.toLowerCase() === 'pending' ? 'bg-warning' :
                                                            'bg-danger'
                                                        }`}>
                                                            {enrollment.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
} 