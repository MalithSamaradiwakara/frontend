import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import defaultTeacherImage from '../../pic/dummy.jpg';

export default function AdminTeacherList() {
    const [teachers, setTeachers] = useState([]);

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

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold">Manage Teachers</h2>
                <Link className="btn btn-success" to="/teachers/addteacher">+ Add Teacher</Link>
            </div>

            <div className="table-responsive shadow-sm rounded">
                <table className=" table table-sm table-hover table-bordered align-middle mb-0 ">
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
                    <tbody >
                        {teachers.length > 0 ? (
                            teachers.map((teacher, index) => (
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
                                            <Link className="btn btn-outline-primary" to={`/tutors/viewtutors/${teacher.tId}`}>View</Link>
                                            <Link className="btn btn-outline-warning" to={`/tutors/edittutors/${teacher.tId}`}>Edit</Link>
                                            <button className="btn btn-outline-danger" onClick={() => deleteTeacher(teacher.tId)}>Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center text-muted py-4">No teachers found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
