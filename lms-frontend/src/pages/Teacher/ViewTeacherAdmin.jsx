import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import defaultTeacherImage from '../../pic/dummy.jpg';

export default function ViewTeacherAdmin() {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [teacher, setTeacher] = useState({
        tName: "",
        tEmail: "",
        qualification: [],
        tDescription: "",
        tPhoto: ""
    });

    const loadTeacher = useCallback(async () => {
        try {
            setLoading(true);
            const result = await axios.get(`http://localhost:8080/teacher/${id}`);
            setTeacher(result.data);
            setError(null);
        } catch (error) {
            console.error("Error loading teacher:", error);
            setError("Failed to load teacher details. Please try again.");
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        loadTeacher();
    }, [loadTeacher]);

    const getTeacherPhoto = (photoUrl) => {
        if (!photoUrl) return defaultTeacherImage;
        return photoUrl.startsWith('http') ? photoUrl : `http://localhost:8080/${photoUrl}`;
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100">
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
            <div className="card border-0 rounded p-4 shadow" style={{ width: '30rem' }}>
                <img
                    src={getTeacherPhoto(teacher.tPhoto)}
                    className="card-img-top rounded-circle mx-auto mb-3 border"
                    alt="Teacher"
                    style={{ height: '220px', width: '220px', objectFit: 'cover' }}
                />
                <div className="card-body text-center">
                    <h4 className="card-title mb-2 fw-bold">👨‍🏫 {teacher.tName}</h4>
                    <p className="text-muted mb-1">📧 {teacher.tEmail}</p>

                    <div className="text-start mt-3">
                        <h6 className="fw-semibold">🎓 Qualifications:</h6>
                        {teacher.qualification && teacher.qualification.length > 0 ? (
                            <ul className="small ps-3">
                                {teacher.qualification.map((q, i) => (
                                    <li key={i}>{q}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-muted fst-italic">No qualifications listed</p>
                        )}

                        <h6 className="fw-semibold mt-3">📝 Description:</h6>
                        <p>{teacher.tDescription || <span className="text-muted fst-italic">No description</span>}</p>
                    </div>

                    <div className="d-flex justify-content-center gap-2 mt-3">
                        <Link className="btn btn-outline-primary" to="/admin/tutors">← Back to Tutors</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
