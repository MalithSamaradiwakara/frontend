import React from 'react';
import { useNavigate } from 'react-router-dom';

function UserTypeSelection() {
    const navigate = useNavigate();

    const handleUserTypeSelection = (userType) => {
        if (userType === 'student') {
            navigate('/students/addstudent');
        } else if (userType === 'teacher') {
            navigate('/teachers/add');
        } else if (userType === 'admin') {
            navigate('/admins/add');
        }
    };

    return (
        <div className="container">
            <div className="row justify-content-center mt-5">
                <div className="col-md-6">
                    <div className="card shadow">
                        <div className="card-body text-center">
                            <h2 className="card-title mb-4">Select User Type</h2>
                            <p className="mb-4">Please select whether you are a student or a teacher</p>
                            <div className="d-grid gap-3">
                                <button 
                                    className="btn btn-primary btn-lg"
                                    onClick={() => handleUserTypeSelection('student')}
                                >
                                    I am a Student
                                </button>
                                <button 
                                    className="btn btn-success btn-lg"
                                    onClick={() => handleUserTypeSelection('teacher')}
                                >
                                    I am a Teacher
                                </button>
                                <button 
                                    className="btn btn-danger btn-lg"
                                    onClick={() => handleUserTypeSelection('admin')}
                                >
                                    I am a Admin
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserTypeSelection; 