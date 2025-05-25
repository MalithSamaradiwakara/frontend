import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { studentService } from '../../services/apiService';

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dql9au2cs/image/upload';
const UPLOAD_PRESET = 'brightpath';

export default function EditStudent() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [student, setStudent] = useState({
        id: "",
        name: "",
        email: "",
        contact: "",
        photo: ""
    });

    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        loadStudent();
    }, []);

    const loadStudent = async () => {
        try {
            const response = await studentService.getById(id);
            setStudent(response);
        } catch (error) {
            console.error("Error loading student:", error);
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', UPLOAD_PRESET);

        try {
            setUploading(true);
            const response = await fetch(CLOUDINARY_URL, {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            setStudent({ ...student, photo: data.secure_url });
        } catch (err) {
            console.error("Upload Error:", err);
        } finally {
            setUploading(false);
        }
    };

    const onInputChange = (e) => {
        setStudent({ ...student, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        try {
            await studentService.update(id, student);
            // Check if user is admin or student
            const userType = localStorage.getItem('userType');
            if (userType === 'Admin') {
                navigate("/admin/students");
            } else {
                navigate("/myprofile");
            }
        } catch (error) {
            console.error("Error updating student:", error);
            alert("Failed to update profile. Please try again.");
        }
    };

    return (
        <div className="container-fluid px-5">
            <div className="row justify-content-center">
                <div className="col-lg-10 col-xl-8">
                    <div className="card border-0 rounded p-5 shadow-lg">
                        <h2 className="card-title text-center mb-4">Edit Student Details</h2>
                        <div className="card-body px-4">
                            <form onSubmit={onSubmit}>
                                {/* Name and Email */}
                                <div className="row mb-4">
                                    <div className="col-md-6 mb-3 mb-md-0">
                                        <label className="form-label fw-semibold">Full Name</label>
                                        <input
                                            type="text"
                                            className="form-control form-control-lg"
                                            name="name"
                                            value={student.name}
                                            onChange={onInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold">Email</label>
                                        <input
                                            type="email"
                                            className="form-control form-control-lg"
                                            name="email"
                                            value={student.email}
                                            onChange={onInputChange}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Contact */}
                                <div className="mb-4">
                                    <label className="form-label fw-semibold">Contact Number</label>
                                    <input
                                        type="tel"
                                        className="form-control form-control-lg"
                                        name="contact"
                                        value={student.contact}
                                        onChange={onInputChange}
                                        required
                                    />
                                </div>

                                {/* Photo Upload */}
                                <div className="mb-4">
                                    <label className="form-label fw-semibold">Profile Photo</label>
                                    <div className="d-flex align-items-center gap-3">
                                        <input
                                            type="file"
                                            className="form-control form-control-lg"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            disabled={uploading}
                                        />
                                        {student.photo && (
                                            <img
                                                src={student.photo}
                                                alt="Profile preview"
                                                className="rounded-circle"
                                                style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                            />
                                        )}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="d-flex justify-content-center gap-3 mt-5">
                                    <button 
                                        className="btn btn-primary px-5 py-2" 
                                        type="submit" 
                                        disabled={uploading}
                                    >
                                        {uploading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Saving...
                                            </>
                                        ) : (
                                            "Save Changes"
                                        )}
                                    </button>
                                    <Link className="btn btn-outline-secondary px-5 py-2" to="/admin/students">
                                        Cancel
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 