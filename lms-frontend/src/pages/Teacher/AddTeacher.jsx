import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';


const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dql9au2cs/image/upload';
const UPLOAD_PRESET = 'brightpath';
const DEFAULT_IMAGE_PATH = 'https://res.cloudinary.com/dql9au2cs/image/upload/v1747781004/dummy_ll4aky.jpg';

export default function AddTeacher() {
    const navigate = useNavigate();

    const [teacher, setTeacher] = useState({
        title: "Mr",
        firstName: "",
        lastName: "",
        tEmail: "",
        qualificationInput: "",
        qualification: [],
        tDescription: "",
        tPhoto: DEFAULT_IMAGE_PATH,
        username: "",
        password: ""
    });

    const [uploading, setUploading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const {
        title, firstName, lastName, tEmail,
        qualificationInput, qualification,
        tDescription, tPhoto,
        username, password
    } = teacher;

    const validateForm = () => {
        if (!firstName.trim() || !lastName.trim()) {
            setError("First name and last name are required");
            return false;
        }
        if (!tEmail.trim()) {
            setError("Email is required");
            return false;
        }
        if (!username.trim()) {
            setError("Username is required");
            return false;
        }
        if (!password.trim()) {
            setError("Password is required");
            return false;
        }
        if (qualification.length === 0) {
            setError("At least one qualification is required");
            return false;
        }
        if (!tPhoto) {
            setError("Profile photo is required");
            return false;
        }
        return true;
    };

    const onInputChange = (e) => {
        setError("");
        setTeacher({ ...teacher, [e.target.name]: e.target.value });
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) {
            setTeacher({ ...teacher, tPhoto: DEFAULT_IMAGE_PATH });
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', UPLOAD_PRESET);

        try {
            setUploading(true);
            setError("");
            const response = await axios.post(CLOUDINARY_URL, formData);
            setTeacher({ ...teacher, tPhoto: response.data.secure_url });
        } catch (err) {
            console.error("Upload Error:", err);
            setError("Failed to upload image. Please try again.");
            setTeacher({ ...teacher, tPhoto: DEFAULT_IMAGE_PATH });
        } finally {
            setUploading(false);
        }
    };

    const addQualification = () => {
        if (qualificationInput.trim()) {
            setTeacher({
                ...teacher,
                qualification: [...qualification, qualificationInput.trim()],
                qualificationInput: ""
            });
            setError("");
        }
    };

    const removeQualification = (index) => {
        setTeacher({
            ...teacher,
            qualification: qualification.filter((_, i) => i !== index)
        });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!validateForm()) {
            return;
        }

        setSubmitting(true);

        const fullName = `${title}. ${firstName} ${lastName}`;

        const newTeacher = {
            tName: fullName,
            tEmail,
            tDescription,
            tPhoto: tPhoto === DEFAULT_IMAGE_PATH ? DEFAULT_IMAGE_PATH : tPhoto,
            qualification,
            username,
            password
        };

        try {
            const response = await axios.post(`http://localhost:8080/teacher/register`, newTeacher, {
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (response.status === 200 || response.status === 201) {
                navigate("/admin/tutors");
            } else {
                setError("Failed to add teacher. Please try again.");
            }
        } catch (error) {
            console.error("Error adding teacher:", error);
            const errorMessage = error.response?.data || "Failed to add teacher. Please try again.";
            setError(typeof errorMessage === 'string' ? errorMessage : "Failed to add teacher. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card border-0 rounded p-4 m-8 shadow">
                        <h2 className="card-title text-center">Add New Teacher</h2>
                        <div className="card-body">
                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            )}
                            <form onSubmit={onSubmit}>
                                {/* Title, First Name, Last Name */}
                                <div className="form-group mb-3 row">
                                    <div className="col-md-4">
                                        <select 
                                            className="form-control"
                                            name="title"
                                            value={title}
                                            onChange={onInputChange}
                                            required
                                        >
                                            <option value="Mr">Mr</option>
                                            <option value="Mrs">Mrs</option>
                                            <option value="Miss">Miss</option>
                                        </select>
                                    </div>

                                    <div className="col-md-4">
                                        <input 
                                            type="text"
                                            className="form-control"
                                            placeholder="First Name"
                                            name="firstName"
                                            value={firstName}
                                            onChange={onInputChange}
                                            required
                                        />
                                    </div>

                                    <div className="col-md-4">
                                        <input 
                                            type="text"
                                            className="form-control"
                                            placeholder="Last Name"
                                            name="lastName"
                                            value={lastName}
                                            onChange={onInputChange}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="form-group mb-3">
                                    <input 
                                        type="email"
                                        className="form-control"
                                        placeholder="Email"
                                        name="tEmail"
                                        value={tEmail}
                                        onChange={onInputChange}
                                        required
                                    />
                                </div>

                                {/* Username */}
                                <div className="form-group mb-3">
                                    <input 
                                        type="text"
                                        className="form-control"
                                        placeholder="Username"
                                        name="username"
                                        value={username}
                                        onChange={onInputChange}
                                        required
                                    />
                                </div>

                                {/* Password */}
                                <div className="form-group mb-3">
                                    <input 
                                        type="password"
                                        className="form-control"
                                        placeholder="Password"
                                        name="password"
                                        value={password}
                                        onChange={onInputChange}
                                        required
                                    />
                                </div>

                                {/* Qualification List */}
                                <div className="form-group mb-3">
                                    <label className="form-label">Qualifications</label>
                                    <ul className="list-group mb-2">
                                        {qualification.map((q, index) => (
                                            <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                                {q}
                                                <button 
                                                    type="button" 
                                                    className="btn btn-sm btn-danger" 
                                                    onClick={() => removeQualification(index)}
                                                >
                                                    Remove
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="d-flex gap-2">
                                        <input
                                            type="text"
                                            className="form-control flex-grow-1"
                                            placeholder="Add Qualification"
                                            name="qualificationInput"
                                            value={qualificationInput}
                                            onChange={onInputChange}
                                        />
                                        <button 
                                            type="button" 
                                            className="btn btn-outline-secondary"
                                            onClick={addQualification}
                                            style={{ minWidth: '80px' }}
                                        >
                                            Add
                                        </button>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="form-group mb-3">
                                    <textarea 
                                        className="form-control"
                                        placeholder="Description"
                                        name="tDescription"
                                        value={tDescription}
                                        onChange={onInputChange}
                                        rows="4"
                                    />
                                </div>

                                {/* File Upload */}
                                <div className="form-group mb-3">
                                    <label className="form-label">Profile Photo</label>
                                    <input 
                                        type="file"
                                        className="form-control"
                                        onChange={handleFileChange}
                                        accept="image/*"
                                    />
                                </div>

                                {uploading ? (
                                    <div className="text-center mb-3">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Uploading...</span>
                                        </div>
                                        <p className="mt-2">Uploading Image...</p>
                                    </div>
                                ) : (
                                    <div className="text-center mb-3">
                                        <img 
                                            src={tPhoto} 
                                            alt="Preview" 
                                            className="img-thumbnail" 
                                            style={{ 
                                                width: "150px", 
                                                height: "150px", 
                                                objectFit: "cover" 
                                            }} 
                                        />
                                    </div>
                                )}

                                {/* Submit Buttons */}
                                <div className="d-flex justify-content-center gap-3 mt-4">
                                    <button 
                                        className="btn btn-success px-4" 
                                        type="submit" 
                                        disabled={uploading || submitting}
                                    >
                                        {submitting ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Adding Teacher...
                                            </>
                                        ) : (
                                            "Add Teacher"
                                        )}
                                    </button>
                                    <Link 
                                        className="btn btn-danger px-4" 
                                        to="/admin/tutors"
                                        onClick={(e) => {
                                            if (submitting || uploading) {
                                                e.preventDefault();
                                            }
                                        }}
                                    >
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