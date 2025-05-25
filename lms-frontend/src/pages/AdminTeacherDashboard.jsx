import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import defaultTeacherImage from '../pic/dummy.jpg';

export default function AdminTeacherList() {
    const [teachers, setTeachers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadTeachers();
    }, []);

    const loadTeachers = async () => {
        try {
            const result = await axios.get("http://localhost:8080/teacher");
            setTeachers(result.data);
        } catch (error) {
            console.error("Error loading teachers:", error);
        }
    };

    const deleteTeacher = async (tId) => {
        try {
            await axios.delete(`http://localhost:8080/teacher/${tId}`);
            loadTeachers();
        } catch (error) {
            console.error("Error deleting teacher:", error);
        }
    };

    const getTeacherPhoto = (photoUrl) => {
        return photoUrl ? photoUrl : defaultTeacherImage;
    };

    // Filter teachers based on search term
    const filteredTeachers = teachers.filter(teacher => 
        teacher.tName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.tEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (teacher.qualification && teacher.qualification.some(q => 
            q.toLowerCase().includes(searchTerm.toLowerCase())
        ))
    );

    return (
        <div className="container mt-6">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold">Manage Teachers</h2>
                <Link className="btn btn-success" to="/admin/teachers/addteacher">+ Add Teacher</Link>
            </div>

            {/* Search Bar */}
            <div className="mb-4">
                <div className="input-group">
                    <span className="input-group-text">
                        <i className="bi bi-search"></i>
                    </span>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by name, email or qualification..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <button 
                            className="btn btn-outline-secondary" 
                            type="button"
                            onClick={() => setSearchTerm('')}
                        >
                            Clear
                        </button>
                    )}
                </div>
            </div>

            <div className="table-responsive shadow-sm rounded">
                <table className="table table-sm table-hover table-bordered align-middle mb-0">
                    <thead className="table-dark text-center">
                        <tr>
                            <th style={{ width: '5%' }}>ID</th>
                            <th style={{ width: '10%' }}>Picture</th>
                            <th style={{ width: '20%' }}>Name</th>
                            <th style={{ width: '20%' }}>Email</th>
                            <th style={{ width: '25%' }}>Qualifications</th>
                            <th style={{ width: '20%' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTeachers.length > 0 ? (
                            filteredTeachers.map((teacher, index) => (
                                <tr key={teacher.tId}>
                                    <td className="text-center fw-semibold">{index + 1}</td>
                                    <td className="text-center">
                                        <img 
                                            src={getTeacherPhoto(teacher.tPhoto)} 
                                            alt="Profile" 
                                            className="rounded-circle border"
                                            style={{ width: "50px", height: "50px", objectFit: "cover" }}
                                        />
                                    </td>
                                    <td>{teacher.tName}</td>
                                    <td>{teacher.tEmail}</td>
                                    <td>
                                        {teacher.qualification && teacher.qualification.length > 0 ? (
                                            <ul className="mb-0 ps-3 small">
                                                {teacher.qualification.map((q, i) => (
                                                    <li key={i}>{q}</li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <span className="text-muted fst-italic">No qualifications</span>
                                        )}
                                    </td>
                                    <td className="text-center">
                                        <div className="btn-group btn-group-sm" role="group">
                                            <Link className="btn btn-outline-primary" to={`/admin/tutors/view/${teacher.tId}`}>View</Link>
                                            <Link className="btn btn-outline-warning" to={`/admin/tutors/edittutors/${teacher.tId}`}>Edit</Link>
                                            <button className="btn btn-outline-danger" onClick={() => deleteTeacher(teacher.tId)}>Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center text-muted py-4">
                                    {searchTerm ? 'No matching teachers found' : 'No teachers found'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}