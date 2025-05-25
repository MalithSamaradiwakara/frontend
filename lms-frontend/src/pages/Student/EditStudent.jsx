import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

// Cloudinary upload preset and cloud name
const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dql9au2cs/image/upload';
const UPLOAD_PRESET = 'brightpath';

export default function EditStudent() {
    let navigate = useNavigate();
    const { id } = useParams();

    const [student, setStudent] = useState({
        name: "",
        email: "",
        contact: "",
        photo: ""
    });

    const [uploading, setUploading] = useState(false);

    const { name, email, contact, photo } = student;

    useEffect(() => {
        loadStudent();
    }, []);

    const loadStudent = async () => {
        try {
            // First get login data to get student ID
            const loginResponse = await axios.get(`http://localhost:8080/api/auth/login/${id}`);
            const studentId = loginResponse.data.studentId;
            
            // Then get student data
            const result = await axios.get(`http://localhost:8080/students/profile/${studentId}`);
            setStudent(result.data);
        } catch (error) {
            console.error("Error loading student:", error);
            alert("Failed to load student details. Please try again.");
        }
    };

    const onInputChange = (e) => {
        setStudent({ ...student, [e.target.name]: e.target.value });
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
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                setStudent({ ...student, photo: response.data.secure_url });
                setUploading(false);
            } catch (error) {
                console.error('Cloudinary Upload Error:', error);
                alert('Failed to upload image. Please try again.');
                setUploading(false);
            }
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            // First get login data to get student ID
            const loginResponse = await axios.get(`http://localhost:8080/api/auth/login/${id}`);
            const studentId = loginResponse.data.studentId;
            
            // Then update student data
            await axios.put(`http://localhost:8080/students/${studentId}`, student);
            alert("Profile updated successfully!");
            navigate(`/myprofile/${id}`);
        } catch (error) {
            console.error("Error updating student:", error);
            alert("Failed to update profile. Please try again.");
        }
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
                    <h2 className="text-center m-4">Edit Profile</h2>
                    <form onSubmit={(e) => onSubmit(e)}>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">
                                Full Name
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter your full name"
                                name="name"
                                value={name}
                                onChange={(e) => onInputChange(e)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">
                                Email Address
                            </label>
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Enter your email address"
                                name="email"
                                value={email}
                                onChange={(e) => onInputChange(e)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="contact" className="form-label">
                                Contact Number
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter your contact number"
                                name="contact"
                                value={contact}
                                onChange={(e) => onInputChange(e)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="photo" className="form-label">
                                Profile Photo
                            </label>
                            <input
                                type="file"
                                className="form-control"
                                accept="image/*"
                                onChange={handleFileChange}
                                disabled={uploading}
                            />
                            {uploading && <p className="text-muted">Uploading image...</p>}
                            {photo && (
                                <div className="mt-2">
                                    <img 
                                        src={photo} 
                                        alt="Profile preview" 
                                        className="img-thumbnail" 
                                        style={{ maxWidth: '200px' }}
                                    />
                                </div>
                            )}
                        </div>
                        <button type="submit" className="btn btn-outline-primary" disabled={uploading}>
                            Update Profile
                        </button>
                        <button
                            type="button"
                            className="btn btn-outline-danger mx-2"
                            onClick={() => navigate(`/myprofile/${id}`)}
                            disabled={uploading}
                        >
                            Cancel
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
} 