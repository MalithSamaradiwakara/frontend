import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dql9au2cs/image/upload';
const UPLOAD_PRESET = 'brightpath';

export default function EditTeacher() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [teacher, setTeacher] = useState({
        tId: "",
        tName: "",
        tEmail: "",
        tDescription: "",
        tPhoto: "",
        qualification: []
    });

    const [newQualification, setNewQualification] = useState("");
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        loadTeacher();
    }, []);

    const loadTeacher = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/teacher/${id}`);
            setTeacher(response.data);
        } catch (error) {
            console.error("Error loading teacher:", error);
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
            const response = await axios.post(CLOUDINARY_URL, formData);
            setTeacher({ ...teacher, tPhoto: response.data.secure_url });
        } catch (err) {
            console.error("Upload Error:", err);
        } finally {
            setUploading(false);
        }
    };

    const onInputChange = (e) => {
        setTeacher({ ...teacher, [e.target.name]: e.target.value });
    };

    const addQualification = () => {
        if (newQualification.trim()) {
            setTeacher({
                ...teacher,
                qualification: [...teacher.qualification, newQualification.trim()]
            });
            setNewQualification("");
        }
    };

    const updateQualification = (index, value) => {
        const updatedQualifications = [...teacher.qualification];
        updatedQualifications[index] = value;
        setTeacher({ ...teacher, qualification: updatedQualifications });
    };

    const removeQualification = (index) => {
        setTeacher({
            ...teacher,
            qualification: teacher.qualification.filter((_, i) => i !== index)
        });
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.put(`http://localhost:8080/teacher/${id}/qualifications/full`, {
                qualification: teacher.qualification
            }, {
                headers: {
                    "Content-Type": "application/json"
                }
            });

            await axios.put(`http://localhost:8080/teacher/${id}`, teacher, {
                headers: {
                    "Content-Type": "application/json"
                }
            });

            navigate("/admin/tutors");
        } catch (error) {
            console.error("Error updating teacher:", error);
        }
    };

    return (
        <div className="container-fluid px-5"> {/* Wider container with padding */}
            <div className="row justify-content-center">
                <div className="col-lg-10 col-xl-8"> {/* Wider column */}
                    <div className="card border-0 rounded p-5 shadow-lg"> {/* More padding */}
                        <h2 className="card-title text-center mb-4">Edit Teacher Details</h2>
                        <div className="card-body px-4"> {/* Added horizontal padding */}
                            <form onSubmit={onSubmit}>
                                {/* Name and Email */}
                                <div className="row mb-4">
                                    <div className="col-md-6 mb-3 mb-md-0">
                                        <label className="form-label fw-semibold">Full Name</label>
                                        <input
                                            type="text"
                                            className="form-control form-control-lg"
                                            name="tName"
                                            value={teacher.tName}
                                            onChange={onInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold">Email</label>
                                        <input
                                            type="email"
                                            className="form-control form-control-lg"
                                            name="tEmail"
                                            value={teacher.tEmail}
                                            onChange={onInputChange}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Qualifications */}
                                <div className="mb-4">
                                    <label className="form-label fw-semibold">Qualifications</label>
                                    <ul className="list-group mb-3">
                                        {teacher.qualification.map((q, index) => (
                                            <li key={index} className="list-group-item d-flex align-items-center p-3">
                                                <input
                                                    type="text"
                                                    className="form-control me-3"
                                                    value={q}
                                                    onChange={(e) => updateQualification(index, e.target.value)}
                                                />
                                                <button
                                                    type="button"
                                                    className="btn btn-danger"
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
                                            placeholder="Add new qualification"
                                            value={newQualification}
                                            onChange={(e) => setNewQualification(e.target.value)}
                                        />
                                        <button 
                                            type="button" 
                                            className="btn btn-outline-primary"
                                            onClick={addQualification}
                                            style={{ minWidth: '100px' }}
                                        >
                                            Add
                                        </button>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="mb-4">
                                    <label className="form-label fw-semibold">Description</label>
                                    <textarea
                                        className="form-control"
                                        name="tDescription"
                                        value={teacher.tDescription}
                                        onChange={onInputChange}
                                        rows="5"
                                    />
                                </div>

                                {/* Photo Upload */}
                                <div className="mb-4">
                                    <label className="form-label fw-semibold">Profile Photo</label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        onChange={handleFileChange}
                                        accept="image/*"
                                    />
                                    {uploading && (
                                        <div className="mt-2 text-center">
                                            <div className="spinner-border text-primary" role="status">
                                                <span className="visually-hidden">Uploading...</span>
                                            </div>
                                            <p className="mt-2">Uploading image...</p>
                                        </div>
                                    )}
                                    {teacher.tPhoto && !uploading && (
                                        <div className="mt-3 text-center">
                                            <img
                                                src={teacher.tPhoto}
                                                alt="Teacher"
                                                className="img-thumbnail"
                                                style={{
                                                    width: "200px",
                                                    height: "200px",
                                                    objectFit: "cover"
                                                }}
                                            />
                                        </div>
                                    )}
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
                                    <Link className="btn btn-outline-secondary px-5 py-2" to="/admin/tutors">
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