import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export function AttemptsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [attempts, setAttempts] = useState([]);
    const [filteredAttempts, setFilteredAttempts] = useState([]);
    const [quizzes, setQuizzes] = useState([]);
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({
        searchTerm: '',
        course: '',
        quiz: '',
        dateFrom: '',
        dateTo: ''
    });
    const [sortOrder, setSortOrder] = useState('newest');
    const [editingId, setEditingId] = useState(null);
    const [editValues, setEditValues] = useState({ marks: '', feedback: '' });

    useEffect(() => {
        fetchAttempts();
    }, []);

    const fetchAttempts = async () => {
        try {
            setIsLoading(true);

            // 🔐 Step 1: Get user login ID
            const loginId = localStorage.getItem('userId');
            if (!loginId) throw new Error('User not logged in');

            // 🔐 Step 2: Get teacherId using loginId
            const loginRes = await axios.get(`${process.env.REACT_APP_API_URL}api/auth/login/${loginId}`);
            const teacherId = loginRes.data.teacherId;
            if (!teacherId) throw new Error('No teacher ID found for logged-in user');

            // 📘 Step 3: Fetch teacher's courses
            const coursesRes = await axios.get(`${process.env.REACT_APP_API_URL}api/courses/teacher/${teacherId}`);
            const coursesData = coursesRes.data;
            setCourses(coursesData);

            // 📘 Step 4: Fetch quizzes for each course
            const quizzesPromises = coursesData.map(course =>
                axios.get(`${process.env.REACT_APP_API_URL}api/quizzes/course/${course.courseId}`)
            );
            const quizzesRes = await Promise.all(quizzesPromises);
            const teacherQuizzes = quizzesRes.flatMap(res => res.data);
            setQuizzes(teacherQuizzes);

            // 📘 Step 5: Fetch attempts for each quiz
            const attemptsPromises = teacherQuizzes.map(quiz =>
                axios.get(`${process.env.REACT_APP_API_URL}api/attempts/quiz/${quiz.quizId}`)
            );
            const attemptsRes = await Promise.all(attemptsPromises);
            const allAttempts = attemptsRes.flatMap(res => res.data);

            setAttempts(allAttempts);
            setFilteredAttempts(allAttempts);
        } catch (error) {
            console.error('Error fetching attempts:', error);
            alert('Failed to load quiz attempts. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        let results = [...attempts];

        // Apply search filter
        if (filters.searchTerm) {
            results = results.filter(attempt =>
                attempt.student.studentId.toString().includes(filters.searchTerm) ||
                attempt.student.name.toLowerCase().includes(filters.searchTerm.toLowerCase())
            );
        }

        // Apply course filter
        if (filters.course) {
            results = results.filter(attempt =>
                attempt.quiz.course.courseId === parseInt(filters.course)
            );
        }

        // Apply quiz filter
        if (filters.quiz) {
            results = results.filter(attempt =>
                attempt.quiz.quizId.toString() === filters.quiz
            );
        }

        // Date filters
        if (filters.dateFrom) {
            const fromDate = new Date(filters.dateFrom);
            results = results.filter(attempt =>
                new Date(attempt.submissionDate) >= fromDate
            );
        }

        if (filters.dateTo) {
            const toDate = new Date(filters.dateTo);
            results = results.filter(attempt =>
                new Date(attempt.submissionDate) <= toDate
            );
        }

        // Apply sorting
        results.sort((a, b) => {
            const dateA = new Date(a.submissionDate);
            const dateB = new Date(b.submissionDate);
            return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
        });

        setFilteredAttempts(results);
    }, [filters, sortOrder, attempts]);

    const handleEditClick = (attempt) => {
        setEditingId(`${attempt.quiz.quizId}-${attempt.student.studentId}`);
        setEditValues({
            marks: attempt.marks || '',
            feedback: attempt.feedback || ''
        });
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditValues(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveAttempt = async (quizId, studentId) => {
        try {
            const updatedValues = {
                marks: parseFloat(editValues.marks),
                feedback: editValues.feedback
            };

            await axios.put(
                `${process.env.REACT_APP_API_URL}api/attempts/quiz/${quizId}/student/${studentId}`,
                updatedValues
            );

            setAttempts(prev =>
                prev.map(attempt =>
                    attempt.quiz.quizId === quizId && attempt.student.studentId === studentId
                        ? { ...attempt, ...updatedValues }
                        : attempt
                )
            );
            setEditingId(null);
            alert('Marks and feedback saved successfully!');
        } catch (error) {
            console.error('Error saving attempt:', error);
            alert('Failed to save changes. Please try again.');
        }
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

    return (
        <div className="container py-5">
            <button
                onClick={() => navigate(`/teacher/${id}/quizzes`)}
                className="btn btn-outline-primary mb-4"
            >
                <i className="bi bi-arrow-left me-2"></i>
                Back to Quizzes
            </button>

            <div className="card p-4">
                <h2 className="text-primary mb-4">Quiz Attempts</h2>

                <div className="row mb-4 g-3">
                    <div className="col-md-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search student ID/name"
                            name="searchTerm"
                            value={filters.searchTerm}
                            onChange={handleFilterChange}
                        />
                    </div>

                    <div className="col-md-2">
                        <select
                            className="form-select"
                            name="course"
                            value={filters.course}
                            onChange={handleFilterChange}
                        >
                            <option value="">All Courses</option>
                            {courses.map(course => (
                                <option key={course.courseId} value={course.courseId}>
                                    {course.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="col-md-2">
                        <select
                            className="form-select"
                            name="quiz"
                            value={filters.quiz}
                            onChange={handleFilterChange}
                        >
                            <option value="">All Quizzes</option>
                            {quizzes.map(quiz => (
                                <option key={quiz.quizId} value={quiz.quizId}>
                                    {quiz.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="col-md-2">
                        <input
                            type="date"
                            className="form-control"
                            name="dateFrom"
                            value={filters.dateFrom}
                            onChange={handleFilterChange}
                        />
                    </div>

                    <div className="col-md-2">
                        <input
                            type="date"
                            className="form-control"
                            name="dateTo"
                            value={filters.dateTo}
                            onChange={handleFilterChange}
                        />
                    </div>

                    <div className="col-md-1">
                        <select
                            className="form-select"
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                        >
                            <option value="newest">Newest</option>
                            <option value="oldest">Oldest</option>
                        </select>
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="table">
                        <thead>
                        <tr>
                            <th>Student</th>
                            <th>Quiz</th>
                            <th>Course</th>
                            <th>Submitted</th>
                            <th>Marks</th>
                            <th>Feedback</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredAttempts.map(attempt => (
                            <tr key={`${attempt.quiz.quizId}-${attempt.student.studentId}`}>
                                <td>{attempt.student.name} (ID: {attempt.student.studentId})</td>
                                <td>{attempt.quiz.title}</td>
                                <td>{attempt.quiz.course.title}</td>
                                <td>{formatDate(attempt.submissionDate)}</td>
                                <td>
                                    {editingId === `${attempt.quiz.quizId}-${attempt.student.studentId}` ? (
                                        <input
                                            type="number"
                                            name="marks"
                                            value={editValues.marks}
                                            onChange={handleEditChange}
                                            className="form-control"
                                            min="0"
                                            max={attempt.quiz.totalMarks}
                                        />
                                    ) : (
                                        attempt.marks ?? 'Not graded'
                                    )}
                                </td>
                                <td>
                                    {editingId === `${attempt.quiz.quizId}-${attempt.student.studentId}` ? (
                                        <input
                                            name="feedback"
                                            value={editValues.feedback}
                                            onChange={handleEditChange}
                                            className="form-control"
                                        />
                                    ) : (
                                        attempt.feedback || 'No feedback'
                                    )}
                                </td>
                                <td>
                                    {editingId === `${attempt.quiz.quizId}-${attempt.student.studentId}` ? (
                                        <button
                                            className="btn btn-success btn-sm"
                                            onClick={() => handleSaveAttempt(attempt.quiz.quizId, attempt.student.studentId)}
                                        >
                                            Save
                                        </button>
                                    ) : (
                                        <button
                                            className="btn btn-warning btn-sm"
                                            onClick={() => handleEditClick(attempt)}
                                        >
                                            Edit
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default AttemptsPage;