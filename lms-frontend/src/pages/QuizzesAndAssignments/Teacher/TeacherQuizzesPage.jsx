import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export function TeacherQuizzesPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [quizzes, setQuizzes] = useState([]);
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [groupedQuizzes, setGroupedQuizzes] = useState({});
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    // Fetch quizzes and courses data
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const loginId = localStorage.getItem('userId');
                if (!loginId) throw new Error('No user ID found in localStorage');

                // Step 1: Get teacher ID using login ID
                const loginRes = await axios.get(`${process.env.REACT_APP_API_URL}api/auth/login/${loginId}`);
                const teacherId = loginRes.data.teacherId;

                if (!teacherId) throw new Error('Teacher ID not found for this login');

                // Step 2: Fetch courses taught by this teacher
                const coursesRes = await axios.get(`${process.env.REACT_APP_API_URL}api/courses/teacher/${teacherId}`);
                const courses = coursesRes.data;
                setCourses(courses);

                // Step 3: Fetch quizzes created by this teacher
                const quizzesRes = await axios.get(`${process.env.REACT_APP_API_URL}api/quizzes/teacher/${teacherId}`);
                const quizzes = quizzesRes.data;
                setQuizzes(quizzes);

                // Step 4: Group quizzes by course
                const grouped = {};
                courses.forEach(course => {
                    grouped[course.courseId] = quizzes.filter(
                        quiz => quiz.course?.courseId === course.courseId
                    );
                });
                setGroupedQuizzes(grouped);

            } catch (err) {
                console.error('Error fetching teacher data:', err);
                setError(err.message || 'Failed to fetch teacher data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);


    // Handle quiz deletion
    const handleDeleteQuiz = async (quizId) => {
        if (!window.confirm("Are you sure you want to delete this quiz?")) return;

        try {
            // Delete quiz from backend
            await axios.delete(`${process.env.REACT_APP_API_URL}api/quizzes/${quizId}`);

            // Remove quiz from frontend state
            const updatedGroupedQuizzes = { ...groupedQuizzes };
            for (const courseId in updatedGroupedQuizzes) {
                updatedGroupedQuizzes[courseId] = updatedGroupedQuizzes[courseId].filter(
                    quiz => quiz.quizId !== quizId
                );
            }

            setGroupedQuizzes(updatedGroupedQuizzes);
            setSuccessMessage('Quiz deleted successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);

        } catch (err) {
            console.error('Error deleting quiz:', err);
            setError('Failed to delete quiz. Please try again.');
            setTimeout(() => setError(''), 3000);
        }
    };

    // Toggle quiz availability
    const toggleQuizAvailability = async (quiz) => {
        try {
            const updatedQuiz = { ...quiz, availability: !quiz.availability };
            const response = await axios.put(
                `${process.env.REACT_APP_API_URL}api/quizzes/${quiz.quizId}`,
                updatedQuiz
            );

            // Update state with modified quiz
            setGroupedQuizzes(prev => ({
                ...prev,
                [quiz.course.courseId]: prev[quiz.course.courseId].map(q =>
                    q.quizId === quiz.quizId ? response.data : q
                )
            }));

            setSuccessMessage(`Quiz "${quiz.title}" is now ${updatedQuiz.availability ? 'Active' : 'Inactive'}`);
            setTimeout(() => setSuccessMessage(''), 3000);

        } catch (err) {
            console.error('Error toggling availability:', err);
            setError('Failed to update quiz status. Please try again.');
            setTimeout(() => setError(''), 3000);
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
            {/* Notifications */}
            {successMessage && (
                <div className="alert alert-success alert-dismissible fade show">
                    {successMessage}
                    <button type="button" className="btn-close" onClick={() => setSuccessMessage('')}></button>
                </div>
            )}
            {error && (
                <div className="alert alert-danger alert-dismissible fade show">
                    {error}
                    <button type="button" className="btn-close" onClick={() => setError('')}></button>
                </div>
            )}

            {/* Header Section */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="text-primary m-0">
                    <i className="bi bi-question-circle me-2"></i>
                    Quiz Management
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
                        onClick={() => navigate(`/teacher/quizzes/attempts`)}
                        className="btn btn-outline-secondary"
                    >
                        <i className="bi bi-file-earmark-text me-2"></i>
                        View Attempts
                    </button>
                </div>
            </div>

            {/* Create New Quiz Button */}
            <div className="d-flex justify-content-end mb-4">
                <button
                    className="btn btn-primary"
                    onClick={() => navigate(`/teacher/quizzes/create-new`)}
                >
                    <i className="bi bi-plus-lg me-2"></i>
                    Create New Quiz
                </button>
            </div>

            {/* Courses List */}
            {courses.length === 0 ? (
                <div className="alert alert-info">
                    <i className="bi bi-info-circle me-2"></i>
                    You don't have any courses assigned yet.
                </div>
            ) : (
                courses.map(course => (
                    <div key={course.courseId} className="card shadow-lg mb-4 border-0">
                        <div className="card-header bg-light">
                            <div className="d-flex align-items-center">
                                <i className="bi bi-journal-book me-3 fs-4 text-primary"></i>
                                <div>
                                    <h4 className="m-0">{course.title}</h4>
                                    <small className="text-muted">Course ID: {course.courseId}</small>
                                </div>
                                <span className="badge bg-primary ms-auto">
                                    {(groupedQuizzes[course.courseId] || []).length} Quizzes
                                </span>
                            </div>
                        </div>

                        {/* Quizzes List */}
                        <div className="card-body">
                            <div className="row g-4">
                                {(groupedQuizzes[course.courseId] || []).length === 0 ? (
                                    <div className="col-12">
                                        <div className="alert alert-warning mb-0">
                                            <i className="bi bi-exclamation-triangle me-2"></i>
                                            No quizzes found for this course
                                        </div>
                                    </div>
                                ) : (
                                    (groupedQuizzes[course.courseId] || []).map(quiz => (
                                        <div key={quiz.quizId} className="col-md-6">
                                            <div className="card h-100 border-start border-4 border-primary shadow-sm">
                                                <div className="card-body">
                                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                                        <h5 className="text-primary fw-bold">
                                                            {quiz.title}
                                                        </h5>
                                                        <div className="form-check form-switch">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                checked={quiz.availability}
                                                                onChange={() => toggleQuizAvailability(quiz)}
                                                                id={`toggle-${quiz.quizId}`}
                                                            />
                                                            <label className="form-check-label" htmlFor={`toggle-${quiz.quizId}`}>
                                                                {quiz.availability ? 'Active' : 'Inactive'}
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <p className="text-muted">{quiz.description}</p>
                                                    <div className="d-flex justify-content-end gap-2">
                                                        <button
                                                            className="btn btn-outline-primary"
                                                            onClick={() => navigate(`/teacher/${id}/quizzes/${quiz.quizId}`)}
                                                        >
                                                            <i className="bi bi-pencil-square me-2"></i>
                                                            Edit
                                                        </button>
                                                        <button
                                                            className="btn btn-outline-danger"
                                                            onClick={() => handleDeleteQuiz(quiz.quizId)}
                                                        >
                                                            <i className="bi bi-trash me-2"></i>
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default TeacherQuizzesPage;
