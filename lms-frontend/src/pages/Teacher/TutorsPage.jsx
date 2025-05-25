import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import defaultTeacherImage from '../../pic/dummy.jpg';

export default function TutorsPage() {
    const [teachers, setTeachers] = useState([]);
    const [isAdminView, setIsAdminView] = useState(false);

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

    const toggleAdminView = () => {
        setIsAdminView(!isAdminView);
    };

    const getTeacherPhoto = (photoUrl) => {
        return photoUrl ? photoUrl : defaultTeacherImage;
    };

    return (
        <div className='d-flex flex-column align-items-center'>
            
            <div className='d-flex flex-row flex-wrap justify-content-center gap-4'>
                {teachers.length > 0 ? (
                    teachers.map((teacher) => (
                        <div key={teacher.tId} className="card border-0 rounded position-relative p-3 m-6 shadow" style={{ width: '20rem', marginTop: '100px' }}>
                            <img 
                                src={getTeacherPhoto(teacher.tPhoto)}
                                className="card-img-top rounded-circle mx-auto position-absolute" 
                                alt="Teacher" 
                                style={{ height: '200px', width: '200px', objectFit: 'cover', left: '50px', top: '-100px' }}
                            />
                            <div className="card-body" style={{ paddingTop: '100px' }}>
                                <h5 className="card-title">Name : {teacher.tName}</h5>
                                <p className="card-text">Email : {teacher.tEmail}</p>
                                <p className="card-text">
                                    Qualification: 
                                    <ul className="mb-1">
                                        {teacher.qualification.map((q, index) => (
                                            <li key={index}>{q}</li>
                                        ))}
                                    </ul>
                                </p>
                                <p className="card-text">~ {teacher.tDescription} ~</p>
                                {isAdminView ? (
                                    <div className="d-flex justify-content-between">
                                        <Link className="btn btn-primary" to={`/tutors/viewtutors/${teacher.tId}`}>View</Link>
                                        <Link className="btn btn-outline-primary" to={`/tutors/edittutors/${teacher.tId}`}>Edit</Link>
                                        <button className="btn btn-danger" onClick={() => deleteTeacher(teacher.tId)}>Delete</button>
                                    </div>
                                ) : (
                                    <div className="d-flex justify-content-center">
                                        <Link className="btn btn-primary" to={`/tutors/viewtutors/${teacher.tId}`}>View</Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No teachers available</p>
                )}
            </div>
        </div>
    );
}
