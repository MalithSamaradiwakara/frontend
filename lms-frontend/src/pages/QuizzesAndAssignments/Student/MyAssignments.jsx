import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function MyAssignments() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [availableAssignments, setAvailableAssignments] = useState([]);
    const [submittedAssignments, setSubmittedAssignments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [filePath, setFilePath] = useState('');
    const [submissionSuccess, setSubmissionSuccess] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                setError(null);

                // Fetch enrolled courses
                const enrollRes = await axios.get(`http://localhost:8080/api/enroll/student/${id}`);
                const courseIds = enrollRes.data.map(enroll => enroll.course.courseId);

                // Fetch assignments from each course
                const assignmentPromises = courseIds.map(courseId =>
                    axios.get(`http://localhost:8080/api/assignments/course/${courseId}`)
                );
                const assignmentsRes = await Promise.all(assignmentPromises);
                const allAssignments = assignmentsRes.flatMap(res => res.data);

                // Fetch submissions
                const submissionRes = await axios.get(`http://localhost:8080/api/submissions/student/${id}`);
                const submittedIds = submissionRes.data.map(sub => sub.assignment.assignmentId);

                // Filter available assignments
                const available = allAssignments.filter(assign =>
                    assign.availability && !submittedIds.includes(assign.assignmentId)
                );

                setAvailableAssignments(available);
                setSubmittedAssignments(submissionRes.data);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to load assignments. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id, submissionSuccess]);

    const handleSubmit = async () => {
        if (!filePath) {
            setError("Please provide a valid file link or path.");
            return;
        }

        try {
            const submissionData = {
                id: {
                    assignmentId: selectedAssignment.assignmentId,
                    sId: parseInt(id)
                },
                student: { studentId: parseInt(id) },
                assignment: { assignmentId: selectedAssignment.assignmentId },
                submissionDate: new Date().toISOString(),
                filePath: filePath
            };

            const response = await axios.post(`http://localhost:8080/api/submissions`, submissionData);

            setSubmittedAssignments(prev => [...prev, response.data]);
            setAvailableAssignments(prev =>
                prev.filter(assign => assign.assignmentId !== selectedAssignment.assignmentId)
            );

            setFilePath('');
            setSubmissionSuccess(true);
            setShowPopup(false);
            setError(null);

            setTimeout(() => setSubmissionSuccess(false), 3000);
        } catch (err) {
            console.error('Submission error:', err);
            setError(err.response?.data?.message || 'Submission failed. Please try again.');
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

    if (error) {
        return (
            <div className="container py-5">
                <div className="alert alert-danger">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    {error}
                </div>
                <button
                    onClick={() => window.location.reload()}
                    className="btn btn-primary"
                >
                    <i className="bi bi-arrow-clockwise me-1"></i> Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="container py-5 animate__animated animate__fadeIn">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="text-primary m-0">
                    <i className="bi bi-journal-text me-2"></i>
                    My Assignments
                </h2>
                <button
                    onClick={() => navigate(`/student/${id}`)}
                    className="btn btn-outline-secondary"
                >
                    <i className="bi bi-arrow-left me-1"></i> Dashboard
                </button>
            </div>

            {submissionSuccess && (
                <div className="alert alert-success alert-dismissible fade show mb-4">
                    <i className="bi bi-check-circle me-2"></i>
                    Assignment submitted successfully!
                    <button
                        type="button"
                        className="btn-close"
                        onClick={() => setSubmissionSuccess(false)}
                    ></button>
                </div>
            )}

            <div className="card shadow-lg mb-4 border-0">
                <div className="card-header bg-primary text-white">
                    <h4 className="m-0">
                        <i className="bi bi-pencil-square me-2"></i>
                        Available Assignments ({availableAssignments.length})
                    </h4>
                </div>
                <div className="card-body">
                    {availableAssignments.length > 0 ? (
                        <div className="row row-cols-1 row-cols-md-2 g-4">
                            {availableAssignments.map(assign => (
                                <div key={assign.assignmentId} className="col">
                                    <div className="card h-100 border-0 shadow-sm hover-shadow">
                                        <div className="card-body">
                                            <h5 className="card-title">{assign.title}</h5>
                                            <p className="card-text text-muted">{assign.description}</p>
                                            <div className="d-flex justify-content-between align-items-center mt-3">
                                                <div>
                                                    <span className="badge bg-info me-2">
                                                        {assign.course.title}
                                                    </span>
                                                    {assign.filePath && (
                                                        <a
                                                            className="text-decoration-none"
                                                            href={assign.filePath}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            onClick={(e) => {
                                                                if (!assign.filePath) e.preventDefault();
                                                            }}
                                                        >
                                                            <i className="bi bi-file-earmark me-1"></i>
                                                            {assign.filePath ? 'Link To Resource' : 'No Resources'}
                                                        </a>
                                                    )}
                                                </div>
                                                <button
                                                    className="btn btn-primary"
                                                    onClick={() => {
                                                        setSelectedAssignment(assign);
                                                        setShowPopup(true);
                                                    }}
                                                >
                                                    <i className="bi bi-upload me-1"></i> Submit
                                                </button>
                                            </div>
                                        </div>
                                        {assign.deadline && (
                                            <div className="card-footer bg-light">
                                                <small className="text-muted">
                                                    Due: {formatDate(assign.deadline)}
                                                </small>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="alert alert-info">
                            <i className="bi bi-info-circle me-2"></i>
                            No assignments available at the moment.
                        </div>
                    )}
                </div>
            </div>

            <div className="card shadow-lg border-0">
                <div className="card-header bg-success text-white">
                    <h4 className="m-0">
                        <i className="bi bi-check-circle me-2"></i>
                        Submitted Assignments ({submittedAssignments.length})
                    </h4>
                </div>
                <div className="card-body">
                    {submittedAssignments.length > 0 ? (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead className="table-light">
                                <tr>
                                    <th>Assignment</th>
                                    <th>Course</th>
                                    <th>Submitted</th>
                                    <th>Status</th>
                                    <th>Score</th>
                                    <th>Feedback</th>
                                </tr>
                                </thead>
                                <tbody>
                                {submittedAssignments.map(submit => (
                                    <tr key={`${submit.assignment.assignmentId}-${id}`}>
                                        <td>{submit.assignment.title}</td>
                                        <td>{submit.assignment.course.title}</td>
                                        <td>{formatDate(submit.submissionDate)}</td>
                                        <td>
                                                <span className={`badge ${submit.marks !== null ? 'bg-success' : 'bg-warning'}`}>
                                                    {submit.marks !== null ? 'Graded' : 'Pending'}
                                                </span>
                                        </td>
                                        <td>
                                            {submit.marks !== null ? (
                                                <span className={`badge ${submit.marks >= 70 ? 'bg-success' : submit.marks >= 50 ? 'bg-warning' : 'bg-danger'}`}>
                                                        {submit.marks}%
                                                    </span>
                                            ) : 'N/A'}
                                        </td>
                                        <td>
                                            <div className="text-truncate" style={{ maxWidth: '200px' }} title={submit.feedback}>
                                                {submit.feedback || 'No feedback provided'}
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
                            You haven't submitted any assignments yet.
                        </div>
                    )}
                </div>
            </div>

            {showPopup && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header bg-primary text-white">
                                <h5 className="modal-title">
                                    <i className="bi bi-upload me-2"></i>
                                    Submit Assignment
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close btn-close-white"
                                    onClick={() => setShowPopup(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <h5>{selectedAssignment?.title}</h5>
                                <div className="text-muted mb-3">
                                    <span className="badge bg-info me-2">
                                        {selectedAssignment?.course.title}
                                    </span>
                                    {selectedAssignment?.deadline && (
                                        <small>Due: {formatDate(selectedAssignment.deadline)}</small>
                                    )}
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Submission Link</label>
                                    <input
                                        type="url"
                                        className="form-control"
                                        placeholder="https://drive.google.com/..."
                                        value={filePath}
                                        onChange={(e) => setFilePath(e.target.value)}
                                        pattern="https?://.+"
                                        required
                                    />
                                    <small className="text-muted">
                                        Supported services: Google Drive, OneDrive, Dropbox, etc.
                                    </small>
                                </div>
                                {error && (
                                    <div className="alert alert-danger mt-3">
                                        <i className="bi bi-exclamation-triangle me-2"></i>
                                        {error}
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setShowPopup(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="btn btn-primary"
                                    onClick={handleSubmit}
                                    disabled={!filePath}
                                >
                                    <i className="bi bi-send me-2"></i> Submit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MyAssignments;