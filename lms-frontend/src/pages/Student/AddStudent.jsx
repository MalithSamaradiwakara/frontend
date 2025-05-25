import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dfk4fsgbt/image/upload';
const UPLOAD_PRESET = 'StudentRegistration';

export default function AddStudent() {
    const navigate = useNavigate();
    const [student, setStudent] = useState({
        S_Name: "",
        S_Email: "",
        S_Contact: "",
        S_Photo: "",
        username: "",
        password: "",
        confirmPassword: ""
    });

    const [passwordError, setPasswordError] = useState("");
    const [uploading, setUploading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const { S_Name, S_Email, S_Contact, S_Photo, username, password, confirmPassword } = student;

    const onInputChange = (e) => {
        const { name, value } = e.target;
        setStudent({ ...student, [name]: value });

        if (name === 'password' || name === 'confirmPassword') {
            setPasswordError("");
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', UPLOAD_PRESET);

            try {
                setUploading(true);
                const response = await axios.post(CLOUDINARY_URL, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                setStudent({ ...student, S_Photo: response.data.secure_url });
            } catch (error) {
                console.error('Cloudinary Upload Error:', error);
                alert('Failed to upload image. Please try again.');
            } finally {
                setUploading(false);
            }
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setPasswordError("Passwords do not match");
            return;
        }

        if (!S_Photo) {
            alert("Please upload a photo");
            return;
        }

        setSubmitting(true);

        try {
            const payload = { S_Name, S_Email, S_Contact, S_Photo, username, password };
            await axios.post("http://localhost:8080/students/register", payload);

            setSuccessMessage("Student registered successfully!");
            setStudent({
                S_Name: "",
                S_Email: "",
                S_Contact: "",
                S_Photo: "",
                username: "",
                password: "",
                confirmPassword: ""
            });
        } catch (error) {
            console.error("Error registering student:", error);
            const message = error.response?.data?.error || "Failed to register student. Please try again.";
            alert(message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="container mt-4">
            <div className="row justify-content-center">
                <div className="col-md-10">
                    <div className="card shadow p-4">
                        {/* Title and Subtitle */}
                        <div className="text-center mb-4">
                            <h2 className="text-black">Student Registration</h2>
                            <p className="text-muted">Please fill in the required details to register a new student.</p>
                        </div>

                        {successMessage && (
                            <div className="alert alert-success text-center">{successMessage}</div>
                        )}

                        <form onSubmit={onSubmit}>
                            {/* Student Info Section */}
                            <div className="bg-primary text-white p-2 rounded mb-3">
                                <h5 className="m-0">Student Information</h5>
                            </div>

                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="S_Name"
                                        placeholder="Enter student's name"
                                        value={S_Name}
                                        onChange={onInputChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        name="S_Email"
                                        placeholder="Enter student's email"
                                        value={S_Email}
                                        onChange={onInputChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Contact Number</label>
                                    <input
                                        type="tel"
                                        className="form-control"
                                        name="S_Contact"
                                        placeholder="Enter 10-digit contact number"
                                        value={S_Contact}
                                        onChange={onInputChange}
                                        pattern="[0-9]{10}"
                                        maxLength="10"
                                        required
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Profile Picture</label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        name="S_Photo"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        required
                                    />
                                    {uploading && (
                                        <div className="text-info mt-2">
                                            <i className="fas fa-spinner fa-spin"></i> Uploading image...
                                        </div>
                                    )}
                                    {S_Photo && !uploading && (
                                        <div className="mt-2">
                                            <img 
                                                src={S_Photo} 
                                                alt="Preview" 
                                                style={{ 
                                                    width: '120px', 
                                                    height: '120px', 
                                                    objectFit: 'cover', 
                                                    borderRadius: '8px', 
                                                    border: '1px solid #ccc' 
                                                }} 
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Login Info Section */}
                            <div className="bg-primary text-white p-2 rounded mt-4 mb-3">
                                <h5 className="m-0">Login Information</h5>
                            </div>

                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Username</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="username"
                                        placeholder="Choose a username"
                                        value={username}
                                        onChange={onInputChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        name="password"
                                        placeholder="Enter a password"
                                        value={password}
                                        onChange={onInputChange}
                                        required
                                        minLength="6"
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Confirm Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        name="confirmPassword"
                                        placeholder="Confirm password"
                                        value={confirmPassword}
                                        onChange={onInputChange}
                                        required
                                        minLength="6"
                                    />
                                    {passwordError && (
                                        <div className="text-danger mt-1">{passwordError}</div>
                                    )}
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="d-flex justify-content-end mt-4">
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={submitting || uploading}
                                >
                                    {submitting ? "Submitting..." : "Submit"}
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-outline-danger ms-2"
                                    onClick={() => navigate("/HomePage")}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
