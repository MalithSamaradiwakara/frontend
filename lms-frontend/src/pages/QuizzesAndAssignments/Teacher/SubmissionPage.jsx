import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export function SubmissionsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [submissions, setSubmissions] = useState([]);
    const [filteredSubmissions, setFilteredSubmissions] = useState([]);
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: '',
        course: '',
        status: 'all',
        dateFrom: '',
        dateTo: ''
    });
    const [editingId, setEditingId] = useState(null);
    const [editValues, setEditValues] = useState({ marks: '', feedback: '' });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);

                // 🔐 Step 0: Get login ID from localStorage
                const loginId = localStorage.getItem('userId');
                if (!loginId) throw new Error('User not logged in');

                // 🔐 Step 1: Get teacher ID from login info
                const loginRes = await axios.get(`${process.env.REACT_APP_API_URL}api/auth/login/${loginId}`);
                const teacherId = loginRes.data.teacherId;
                if (!teacherId) throw new Error('No teacher ID found for the logged-in user');

                // 📘 Step 2: Fetch teacher's courses
                const { data: courses } = await axios.get(`${process.env.REACT_APP_API_URL}api/courses/teacher/${teacherId}`);
                setCourses(courses);

                // 📝 Step 3: Fetch assignments for each course
                const assignmentsRes = await Promise.all(
                    courses.map(course =>
                        axios.get(`${process.env.REACT_APP_API_URL}api/assignments/course/${course.courseId}`)
                    )
                );
                const allAssignments = assignmentsRes.flatMap(res => res.data);

                // 📩 Step 4: Fetch submissions for each assignment
                const submissionsRes = await Promise.all(
                    allAssignments.map(assignment =>
                        axios.get(`${process.env.REACT_APP_API_URL}api/submissions/assignment/${assignment.assignmentId}`)
                    )
                );
                const allSubmissions = submissionsRes.flatMap(res => res.data)
                    .map(sub => ({
                        ...sub,
                        course: courses.find(c => c.courseId === sub.assignment.course.courseId)
                    }));

                // ✅ Step 5: Set state
                setSubmissions(allSubmissions);
                setFilteredSubmissions(allSubmissions);

            } catch (error) {
                console.error('Error fetching data:', error);
                alert('Failed to load submissions. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []); // empty dependency array since loginId is from localStorage


    useEffect(() => {
        applyFilters();
    }, [filters, submissions]);

    const applyFilters = () => {
        let results = [...submissions];

        // Search filter
        if (filters.search) {
            results = results.filter(sub =>
                sub.student.studentId.toString().includes(filters.search) ||
                sub.student.name.toLowerCase().includes(filters.search.toLowerCase())
            );
        }

        // Course filter
        if (filters.course) {
            results = results.filter(sub =>
                sub.course.courseId === parseInt(filters.course)
            );
        }

        // Status filter
        if (filters.status === 'ungraded') {
            results = results.filter(sub => sub.marks === null);
        }

        // Date filter
        if (filters.dateFrom) {
            const fromDate = new Date(filters.dateFrom);
            results = results.filter(sub => new Date(sub.submissionDate) >= fromDate);
        }

        if (filters.dateTo) {
            const toDate = new Date(filters.dateTo);
            results = results.filter(sub => new Date(sub.submissionDate) <= toDate);
        }

        setFilteredSubmissions(results);
    };

    const handleFilterChange = (name, value) => {
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveGrade = async (assignmentId, studentId) => {
        try {
            const payload = {
                ...editValues,
                marks: editValues.marks ? parseFloat(editValues.marks) : null,
                // Preserve original submission date
                submissionDate: submissions.find(sub =>
                    sub.assignment.assignmentId === assignmentId &&
                    sub.student.studentId === studentId
                ).submissionDate
            };

            await axios.put(
                `${process.env.REACT_APP_API_URL}api/submissions/assignment/${assignmentId}/student/${studentId}`,
                payload
            );

            setSubmissions(prev =>
                prev.map(sub =>
                    sub.assignment.assignmentId === assignmentId && sub.student.studentId === studentId
                        ? { ...sub, ...payload }
                        : sub
                )
            );

            setEditingId(null);
            alert('Grade and feedback saved successfully!');
        } catch (error) {
            console.error('Error saving grade:', error);
            alert('Failed to save changes. Please try again.');
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
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
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="text-primary m-0">
                    <i className="bi bi-file-earmark-arrow-up me-2"></i>
                    Assignment Submissions
                </h2>
                <button
                    onClick={() => navigate(`/teacher/${id}/assignments`)}
                    className="btn btn-outline-secondary"
                >
                    <i className="bi bi-arrow-left me-1"></i> Back to Assignments
                </button>
            </div>

            {/* Filter Controls */}
            <div className="card shadow-lg mb-4 border-0">
                <div className="card-header bg-light">
                    <h5 className="m-0">
                        <i className="bi bi-funnel me-2"></i>
                        Filter Submissions
                    </h5>
                </div>
                <div className="card-body">
                    <div className="row g-3">
                        <div className="col-md-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search student ID/name"
                                value={filters.search}
                                onChange={(e) => handleFilterChange('search', e.target.value)}
                            />
                        </div>
                        <div className="col-md-2">
                            <select
                                className="form-select"
                                value={filters.course}
                                onChange={(e) => handleFilterChange('course', e.target.value)}
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
                                value={filters.status}
                                onChange={(e) => handleFilterChange('status', e.target.value)}
                            >
                                <option value="all">All Statuses</option>
                                <option value="ungraded">Ungraded Only</option>
                            </select>
                        </div>
                        <div className="col-md-2">
                            <input
                                type="date"
                                className="form-control"
                                placeholder="From Date"
                                value={filters.dateFrom}
                                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                            />
                        </div>
                        <div className="col-md-2">
                            <input
                                type="date"
                                className="form-control"
                                placeholder="To Date"
                                value={filters.dateTo}
                                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Submissions Table */}
            <div className="card shadow-lg border-0">
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0">
                            <thead className="table-light">
                            <tr>
                                <th>Student</th>
                                <th>Course</th>
                                <th>Assignment</th>
                                <th>Submitted</th>
                                <th>Status</th>
                                <th>Grade</th>
                                <th>Feedback</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredSubmissions.map(sub => {
                                    const isEditing = editingId === `${sub.assignment.assignmentId}-${sub.student.studentId}`;
                                    const statusBadge = sub.marks === null ?
                                        <span className="badge bg-warning">Pending</span> :
                                        <span className="badge bg-success">Graded</span>;

                                    return (
                                        <tr key={`${sub.assignment.assignmentId}-${sub.student.studentId}`}>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <i className="bi bi-person-circle me-2"></i>
                                                    <div>
                                                        <div>{sub.student.name}</div>
                                                        <small className="text-muted">ID: {sub.student.studentId}</small>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{sub.course.title}</td>
                                            <td>{sub.assignment.title}</td>
                                            <td>{formatDate(sub.submissionDate)}</td>
                                            <td>{statusBadge}</td>
                                            <td>
                                                {isEditing ? (
                                                    <input
                                                        type="number"
                                                        name="marks"
                                                        className="form-control form-control-sm"
                                                        value={editValues.marks}
                                                        onChange={(e) => setEditValues(prev => ({
                                                            ...prev,
                                                            marks: e.target.value
                                                        }))}
                                                    />
                                                ) : sub.marks ?? '–'}
                                            </td>
                                            <td>
                                                {isEditing ? (
                                                    <textarea
                                                        name="feedback"
                                                        className="form-control form-control-sm"
                                                        value={editValues.feedback}
                                                        onChange={(e) => setEditValues(prev => ({
                                                            ...prev,
                                                            feedback: e.target.value
                                                        }))}
                                                        rows="2"
                                                    />
                                                ) : sub.feedback || '–'}
                                            </td>
                                            <td>
                                                {isEditing ? (
                                                    <div className="d-flex gap-2">
                                                        <button
                                                            className="btn btn-sm btn-success"
                                                            onClick={() => handleSaveGrade(sub.assignment.assignmentId, sub.student.studentId)}
                                                        >
                                                            <i className="bi bi-check"></i>
                                                        </button>
                                                        <button
                                                            className="btn btn-sm btn-secondary"
                                                            onClick={() => setEditingId(null)}
                                                        >
                                                            <i className="bi bi-x"></i>
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        className="btn btn-sm btn-outline-primary"
                                                        onClick={() => {
                                                            setEditingId(`${sub.assignment.assignmentId}-${sub.student.studentId}`);
                                                            setEditValues({
                                                                marks: sub.marks || '',
                                                                feedback: sub.feedback || ''
                                                            });
                                                        }}
                                                    >
                                                        <i className="bi bi-pencil"></i>
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    )
                                }
                            )}
                            </tbody>
                        </table>
                        {filteredSubmissions.length === 0 && (
                            <div className="text-center py-4">
                                <i className="bi bi-inbox fs-1 text-muted"></i>
                                <p className="text-muted mt-2">No submissions found matching your criteria</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SubmissionsPage;