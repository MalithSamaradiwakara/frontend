import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function TeacherAssignmentsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [assignmentsByCourse, setAssignmentsByCourse] = useState({});
    const [newAssignment, setNewAssignment] = useState({
        title: '',
        description: '',
        courseId: '',
        filePath: '',
        availability: true
    });
    const [editAssignmentId, setEditAssignmentId] = useState(null);
    const [editValues, setEditValues] = useState({
        title: '',
        description: '',
        filePath: '',
        availability: true,
        courseId: ''
    });
    const [isLoading, setIsLoading] = useState(true);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                setErrorMessage(null);

                const loginId = localStorage.getItem('userId');
                if (!loginId) throw new Error('User not logged in');

                // Step 1: Get teacherId from login
                const loginRes = await axios.get(`${process.env.REACT_APP_API_URL}api/auth/login/${loginId}`);
                const teacherId = loginRes.data.teacherId;
                if (!teacherId) throw new Error('No teacher ID found for logged-in user');

                // Step 2: Get courses taught by teacher
                const coursesRes = await axios.get(`${process.env.REACT_APP_API_URL}api/courses/teacher/${teacherId}`);
                const courses = coursesRes.data;
                setCourses(courses);

                // Step 3: Fetch assignments for each course
                const assignmentPromises = courses.map(course =>
                    axios.get(`${process.env.REACT_APP_API_URL}api/assignments/course/${course.courseId}`)
                );

                const assignmentsRes = await Promise.all(assignmentPromises);

                const assignmentsMap = {};
                assignmentsRes.forEach((res, index) => {
                    const courseId = courses[index].courseId;
                    assignmentsMap[courseId] = res.data;
                });

                setAssignmentsByCourse(assignmentsMap);

            } catch (err) {
                console.error('Error fetching teacher assignments:', err);
                setErrorMessage(err.message || 'Failed to load data. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);


    const handleInputChange = (e) => {
        const target = e.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        setNewAssignment(prev => ({ ...prev, [name]: value }));
    };

    const handleCreate = async () => {
        if (!newAssignment.title || !newAssignment.courseId) {
            setErrorMessage('Please fill in required fields (Title and Course)');
            setTimeout(() => setErrorMessage(''), 3000);
            return;
        }

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}api/assignments`, {
                title: newAssignment.title,
                description: newAssignment.description,
                filePath: newAssignment.filePath,
                availability: newAssignment.availability,
                course: { courseId: parseInt(newAssignment.courseId) }
            });

            const createdAssignment = response.data;
            const courseId = parseInt(newAssignment.courseId);

            setAssignmentsByCourse(prev => ({
                ...prev,
                [courseId]: [...(prev[courseId] || []), createdAssignment]
            }));

            setNewAssignment({
                title: '',
                description: '',
                courseId: '',
                filePath: '',
                availability: true
            });
            setSuccessMessage('Assignment created successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);

        } catch (err) {
            console.error('Error creating assignment:', err);
            setErrorMessage('Failed to create assignment. Please try again.');
            setTimeout(() => setErrorMessage(''), 3000);
        }
    };

    const handleEditClick = (assignment) => {
        setEditAssignmentId(assignment.assignmentId);
        setEditValues({
            title: assignment.title,
            description: assignment.description,
            filePath: assignment.filePath,
            availability: assignment.availability,
            courseId: assignment.course.courseId
        });
    };

    const handleEditChange = (e) => {
        const target = e.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        setEditValues(prev => ({ ...prev, [name]: value }));
    };

    const handleEditSave = async (assignmentId) => {
        try {
            const updatedAssignment = {
                title: editValues.title,
                description: editValues.description,
                filePath: editValues.filePath,
                availability: editValues.availability,
                course: { courseId: parseInt(editValues.courseId) }
            };

            const response = await axios.put(
                `${process.env.REACT_APP_API_URL}api/assignments/${assignmentId}`,
                updatedAssignment
            );

            const updatedData = response.data;
            const oldCourseId = Object.keys(assignmentsByCourse).find(courseId =>
                assignmentsByCourse[courseId].some(a => a.assignmentId === assignmentId)
            );

            setAssignmentsByCourse(prev => {
                const newState = { ...prev };

                if (oldCourseId) {
                    newState[oldCourseId] = prev[oldCourseId].filter(
                        a => a.assignmentId !== assignmentId
                    );
                }

                const newCourseId = updatedData.course.courseId.toString();
                newState[newCourseId] = [
                    ...(newState[newCourseId] || []),
                    updatedData
                ];

                return newState;
            });

            setEditAssignmentId(null);
            setSuccessMessage('Assignment updated successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);

        } catch (err) {
            console.error('Error updating assignment:', err);
            setErrorMessage('Failed to update assignment. Please try again.');
            setTimeout(() => setErrorMessage(''), 3000);
        }
    };

    const handleDelete = async (assignmentId, courseId) => {
        if (!window.confirm("Are you sure you want to delete this assignment?")) return;

        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}api/assignments/${assignmentId}`);

            setAssignmentsByCourse(prev => ({
                ...prev,
                [courseId]: prev[courseId].filter(a => a.assignmentId !== assignmentId)
            }));

            setSuccessMessage('Assignment deleted successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);

        } catch (err) {
            console.error('Error deleting assignment:', err);
            setErrorMessage('Failed to delete assignment. Please try again.');
            setTimeout(() => setErrorMessage(''), 3000);
        }
    };

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5 animate__animated animate__fadeIn">
            {successMessage && (
                <div className="alert alert-success alert-dismissible fade show">
                    {successMessage}
                    <button type="button" className="btn-close" onClick={() => setSuccessMessage('')}></button>
                </div>
            )}
            {errorMessage && (
                <div className="alert alert-danger alert-dismissible fade show">
                    {errorMessage}
                    <button type="button" className="btn-close" onClick={() => setErrorMessage('')}></button>
                </div>
            )}

            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="text-primary m-0">
                    <i className="bi bi-journal-bookmark me-2"></i>
                    Assignment Management
                </h2>
                <div className="d-flex gap-2">
                    <button
                        onClick={() => navigate(`/teacher/${id}`)}
                        className="btn btn-outline-primary"
                    >
                        <i className="bi bi-arrow-left me-2"></i>
                        Dashboard
                    </button>
                    <button
                        onClick={() => navigate(`/teacher/assignments/submissions`)}
                        className="btn btn-outline-secondary"
                    >
                        <i className="bi bi-file-earmark-text me-2"></i>
                        Submissions
                    </button>
                </div>
            </div>

            <div className="card shadow-lg mb-4 border-0">
                <div className="card-header bg-primary text-white">
                    <h5 className="m-0">
                        <i className="bi bi-plus-circle me-2"></i>
                        Create New Assignment
                    </h5>
                </div>
                <div className="card-body">
                    <div className="row g-3">
                        <div className="col-md-6">
                            <input
                                type="text"
                                name="title"
                                className="form-control"
                                placeholder="Assignment Title *"
                                value={newAssignment.title}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="col-md-6">
                            <select
                                name="courseId"
                                className="form-select"
                                value={newAssignment.courseId}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Select Course *</option>
                                {courses.map(course => (
                                    <option key={course.courseId} value={course.courseId}>
                                        {course.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-12">
                            <textarea
                                name="description"
                                className="form-control"
                                placeholder="Description"
                                rows="3"
                                value={newAssignment.description}
                                onChange={handleInputChange}
                            ></textarea>
                        </div>
                        <div className="col-12">
                            <div className="input-group">
                                <span className="input-group-text">
                                    <i className="bi bi-link"></i>
                                </span>
                                <input
                                    type="text"
                                    name="filePath"
                                    className="form-control"
                                    placeholder="Resource URL (optional)"
                                    value={newAssignment.filePath}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="form-check form-switch">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    name="availability"
                                    checked={newAssignment.availability}
                                    onChange={handleInputChange}
                                    id="availabilitySwitch"
                                />
                                <label className="form-check-label" htmlFor="availabilitySwitch">
                                    {newAssignment.availability ? 'Available' : 'Closed'}
                                </label>
                            </div>
                        </div>
                        <div className="col-12">
                            <button
                                className="btn btn-primary w-100 py-2"
                                onClick={handleCreate}
                            >
                                <i className="bi bi-save me-2"></i>
                                Create Assignment
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {courses.map(course => (
                <div key={course.courseId} className="card shadow-lg mb-4 border-0">
                    <div className="card-header bg-light">
                        <div className="d-flex align-items-center">
                            <i className="bi bi-journal-book me-3 fs-4 text-primary"></i>
                            <h4 className="m-0">{course.title}</h4>
                            <span className="badge bg-primary ms-3">
                                {assignmentsByCourse[course.courseId]?.length || 0} Assignments
                            </span>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="row g-4">
                            {(assignmentsByCourse[course.courseId] || []).map(assign => (
                                <div key={assign.assignmentId} className="col-md-6">
                                    <div className="card h-100 border-start border-4 border-primary shadow-sm">
                                        <div className="card-body">
                                            {editAssignmentId === assign.assignmentId ? (
                                                <div>
                                                    <h6 className="text-primary mb-3">
                                                        <i className="bi bi-pencil-square me-2"></i>
                                                        Edit Assignment
                                                    </h6>
                                                    <div className="mb-3">
                                                        <input
                                                            type="text"
                                                            name="title"
                                                            className="form-control"
                                                            value={editValues.title}
                                                            onChange={handleEditChange}
                                                        />
                                                    </div>
                                                    <div className="mb-3">
                                                        <textarea
                                                            name="description"
                                                            className="form-control"
                                                            value={editValues.description}
                                                            onChange={handleEditChange}
                                                            rows="3"
                                                        ></textarea>
                                                    </div>
                                                    <div className="mb-3">
                                                        <input
                                                            type="text"
                                                            name="filePath"
                                                            className="form-control"
                                                            value={editValues.filePath}
                                                            onChange={handleEditChange}
                                                        />
                                                    </div>
                                                    <div className="mb-3">
                                                        <select
                                                            name="courseId"
                                                            className="form-select"
                                                            value={editValues.courseId}
                                                            onChange={handleEditChange}
                                                        >
                                                            {courses.map(c => (
                                                                <option key={c.courseId} value={c.courseId}>
                                                                    {c.title}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div className="mb-3">
                                                        <div className="form-check form-switch">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                name="availability"
                                                                checked={editValues.availability}
                                                                onChange={handleEditChange}
                                                                id={`editSwitch-${assign.assignmentId}`}
                                                            />
                                                            <label className="form-check-label" htmlFor={`editSwitch-${assign.assignmentId}`}>
                                                                {editValues.availability ? 'Available' : 'Closed'}
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div className="d-flex gap-2 justify-content-end">
                                                        <button
                                                            className="btn btn-success"
                                                            onClick={() => handleEditSave(assign.assignmentId)}
                                                        >
                                                            <i className="bi bi-check-circle me-2"></i>
                                                            Save
                                                        </button>
                                                        <button
                                                            className="btn btn-secondary"
                                                            onClick={() => setEditAssignmentId(null)}
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div>
                                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                                        <h5 className="text-primary fw-bold">
                                                            {assign.title}
                                                        </h5>
                                                        <span className={`badge ${assign.availability ? 'bg-success' : 'bg-secondary'}`}>
                                                            {assign.availability ? 'Active' : 'Archived'}
                                                        </span>
                                                    </div>
                                                    <p className="text-muted">{assign.description}</p>
                                                    {assign.filePath && (
                                                        <div className="mb-3">
                                                            <a
                                                                href={assign.filePath}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-decoration-none"
                                                            >
                                                                <i className="bi bi-file-earmark-arrow-down me-2"></i>
                                                                Download Resources
                                                            </a>
                                                        </div>
                                                    )}
                                                    <div className="d-flex gap-2 justify-content-end">
                                                        <button
                                                            className="btn btn-outline-primary"
                                                            onClick={() => handleEditClick(assign)}
                                                        >
                                                            <i className="bi bi-pencil-square me-2"></i>
                                                            Edit
                                                        </button>
                                                        <button
                                                            className="btn btn-outline-danger"
                                                            onClick={() => handleDelete(assign.assignmentId, course.courseId)}
                                                        >
                                                            <i className="bi bi-trash me-2"></i>
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default TeacherAssignmentsPage;