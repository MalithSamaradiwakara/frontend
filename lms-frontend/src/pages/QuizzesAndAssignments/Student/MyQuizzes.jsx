import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function MyQuizzes() {
    const { id } = useParams(); // Student ID from URL
    const navigate = useNavigate();
    const [activeQuizzes, setActiveQuizzes] = useState([]);
    const [completedQuizzes, setCompletedQuizzes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                setIsLoading(true);
                setError(null);

                // 1. Fetch enrolled courses
                const enrollRes = await axios.get(`http://localhost:8080/api/enroll/student/${id}`);
                const courseIds = enrollRes.data.map(enroll => enroll.course.courseId);

                // 2. Fetch quizzes from each enrolled course
                const quizPromises = courseIds.map(courseId =>
                    axios.get(`http://localhost:8080/api/quizzes/course/${courseId}`)
                );
                const quizzesRes = await Promise.all(quizPromises);
                const allQuizzes = quizzesRes.flatMap(res => res.data);

                // 3. Fetch completed quizzes (attempts)
                const attemptRes = await axios.get(`http://localhost:8080/api/attempts/student/${id}`);
                const completed = attemptRes.data;
                setCompletedQuizzes(completed);

                // 4. Filter active quizzes (available and not attempted)
                const completedQuizIds = completed.map(attempt => attempt.quiz.quizId);
                const active = allQuizzes.filter(quiz =>
                    quiz.availability && !completedQuizIds.includes(quiz.quizId)
                );
                setActiveQuizzes(active);

            } catch (err) {
                console.error('Error fetching quizzes:', err);
                setError('Failed to load quizzes. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchQuizzes();
    }, [id]);

    const handleTakeQuiz = (quizId) => {
        navigate(`/student/${id}/attempt-quiz/${quizId}`);
    };

    const formatDate = (dateString) => {
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
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

    if (error) {
        return (
            <div className="container py-5">
                <div className="alert alert-danger">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5 animate__animated animate__fadeIn">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="text-primary m-0">
                    <i className="bi bi-journal-bookmark me-2"></i>
                    My Quizzes
                </h2>
                <button
                    onClick={() => navigate(`/student/${id}`)}
                    className="btn btn-outline-secondary"
                >
                    <i className="bi bi-arrow-left me-1"></i> Dashboard
                </button>
            </div>

            {/* Available Quizzes Section */}
            <div className="card shadow-lg mb-4 border-0">
                <div className="card-header bg-primary text-white">
                    <h4 className="m-0">
                        <i className="bi bi-pencil-square me-2"></i>
                        Available Quizzes ({activeQuizzes.length})
                    </h4>
                </div>
                <div className="card-body">
                    {activeQuizzes.length > 0 ? (
                        <div className="row row-cols-1 row-cols-md-2 g-4">
                            {activeQuizzes.map(quiz => (
                                <div key={quiz.quizId} className="col">
                                    <div className="card h-100 border-0 shadow-sm hover-shadow">
                                        <div className="card-body">
                                            <h5 className="card-title">{quiz.title}</h5>
                                            <p className="card-text text-muted">{quiz.description}</p>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <span className="badge bg-info me-2">
                                                        {quiz.course.title}
                                                    </span>
                                                    {quiz.dueDate && (
                                                        <small className="text-muted">
                                                            Due: {formatDate(quiz.dueDate)}
                                                        </small>
                                                    )}
                                                </div>
                                                <button
                                                    className="btn btn-primary"
                                                    onClick={() => handleTakeQuiz(quiz.quizId)}
                                                >
                                                    <i className="bi bi-pencil me-1"></i> Attempt
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="alert alert-info">
                            <i className="bi bi-info-circle me-2"></i>
                            No available quizzes at the moment.
                        </div>
                    )}
                </div>
            </div>

            {/* Completed Quizzes Section */}
            <div className="card shadow-lg border-0">
                <div className="card-header bg-success text-white">
                    <h4 className="m-0">
                        <i className="bi bi-check-circle me-2"></i>
                        Completed Quizzes ({completedQuizzes.length})
                    </h4>
                </div>
                <div className="card-body">
                    {completedQuizzes.length > 0 ? (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead className="table-light">
                                <tr>
                                    <th>Quiz</th>
                                    <th>Course</th>
                                    <th>Submitted</th>
                                    <th>Score</th>
                                    <th>Feedback</th>
                                </tr>
                                </thead>
                                <tbody>
                                {completedQuizzes.map(attempt => (
                                    <tr key={`${attempt.id.quizId}-${attempt.id.sId}`}>
                                        <td>{attempt.quiz.title}</td>
                                        <td>{attempt.quiz.course.title}</td>
                                        <td>{formatDate(attempt.submissionDate)}</td>
                                        <td>
                                                <span className="badge  bg-success">
                                                    {attempt.marks}%
                                                </span>
                                        </td>
                                        <td>
                                            <div className="text-truncate" style={{ maxWidth: '500px' }}>
                                                {attempt.feedback || 'In Review'}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="alert alert-info">
                            <i className="bi bi-info-circle me-2"></i>
                            You haven't completed any quizzes yet.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MyQuizzes;