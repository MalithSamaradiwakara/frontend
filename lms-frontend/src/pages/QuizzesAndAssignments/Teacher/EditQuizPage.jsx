import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export function EditQuizPage() {
    const { id, quizId } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [newQuestion, setNewQuestion] = useState({
        question: "",
        option1: "",
        option2: "",
        option3: "",
        option4: "",
        correct: 1
    });
    const [editQuestionId, setEditQuestionId] = useState(null);
    const [editValues, setEditValues] = useState({
        question: "",
        option1: "",
        option2: "",
        option3: "",
        option4: "",
        correct: 1
    });

    // Fetch quiz and questions
    useEffect(() => {
        setIsLoading(true);

        // Fetch quiz details
        axios.get(`${process.env.REACT_APP_API_URL}api/quizzes/${quizId}`)
            .then(quizRes => {
                setQuiz(quizRes.data);

                // Fetch questions for this quiz
                return axios.get(`${process.env.REACT_APP_API_URL}api/questions/quiz/${quizId}`);
            })
            .then(questionsRes => {
                // Convert answers string to separate options for display
                const questionsWithOptions = questionsRes.data.map(q => {
                    const options = q.answers.split(';');
                    return {
                        ...q,
                        option1: options[0]?.trim() || "",
                        option2: options[1]?.trim() || "",
                        option3: options[2]?.trim() || "",
                        option4: options[3]?.trim() || ""
                    };
                });
                setQuestions(questionsWithOptions);
                setIsLoading(false);
            })
            .catch(err => {
                console.error('Error fetching data:', err);
                setIsLoading(false);
            });
    }, [quizId]);

    // Handle input change for new question
    const handleNewQuestionChange = (e) => {
        const { name, value } = e.target;
        setNewQuestion(prev => ({ ...prev, [name]: value }));
    };

    // Handle input change for edit question
    const handleEditQuestionChange = (e) => {
        const { name, value } = e.target;
        setEditValues(prev => ({ ...prev, [name]: value }));
    };

    // Add new question
    const handleAddQuestion = () => {
        const { option1, option2, option3, option4, ...rest } = newQuestion;

        if (!rest.question || !option1 || !option2 || !option3 || !option4) {
            alert("Please fill in all required fields");
            return;
        }

        const questionData = {
            ...rest,
            answers: `${option1};${option2};${option3};${option4}`,
            correct: parseInt(rest.correct),
            quiz: { quizId: parseInt(quizId) }
        };

        axios.post(`${process.env.REACT_APP_API_URL}api/questions`, questionData)
            .then(res => {
                // Convert answers back to separate options for display
                const newQuestionWithOptions = {
                    ...res.data,
                    option1,
                    option2,
                    option3,
                    option4
                };
                setQuestions(prev => [...prev, newQuestionWithOptions]);
                setNewQuestion({
                    question: "",
                    option1: "",
                    option2: "",
                    option3: "",
                    option4: "",
                    correct: 1
                });

                // Animation feedback
                const form = document.querySelector('.new-question-form');
                if (form) {
                    form.classList.add('animate__animated', 'animate__flash');
                    setTimeout(() => {
                        form.classList.remove('animate__animated', 'animate__flash');
                    }, 1000);
                }
            })
            .catch(err => {
                console.error('Error adding question:', err);
                alert('Failed to add question');
            });
    };

    // Edit question
    const handleEditQuestion = (question) => {
        setEditQuestionId(question.questionId);
        setEditValues({
            question: question.question,
            option1: question.option1,
            option2: question.option2,
            option3: question.option3,
            option4: question.option4,
            correct: question.correct
        });
    };

    // Save edited question
    const handleSaveEdit = () => {
        const { option1, option2, option3, option4, ...rest } = editValues;

        if (!rest.question || !option1 || !option2 || !option3 || !option4) {
            alert("Please fill in all required fields");
            return;
        }

        const updatedQuestion = {
            ...rest,
            answers: `${option1};${option2};${option3};${option4}`,
            correct: parseInt(rest.correct)
        };

        axios.put(`${process.env.REACT_APP_API_URL}api/questions/${editQuestionId}`, updatedQuestion)
            .then(res => {
                // Convert answers back to separate options for display
                const updatedQuestionWithOptions = {
                    ...res.data,
                    option1,
                    option2,
                    option3,
                    option4
                };
                setQuestions(prev =>
                    prev.map(q =>
                        q.questionId === editQuestionId ? updatedQuestionWithOptions : q
                    )
                );
                setEditQuestionId(null);

                // Animation feedback
                const card = document.getElementById(`question-${editQuestionId}`);
                if (card) {
                    card.classList.add('animate__animated', 'animate__pulse');
                    setTimeout(() => {
                        card.classList.remove('animate__animated', 'animate__pulse');
                    }, 1000);
                }
            })
            .catch(err => {
                console.error('Error updating question:', err);
                alert('Failed to update question');
            });
    };

    // Delete question
    const handleDeleteQuestion = (questionId) => {
        if (window.confirm("Are you sure you want to delete this question?")) {
            const card = document.getElementById(`question-${questionId}`);
            if (card) {
                card.classList.add('animate__animated', 'animate__fadeOut');
            }

            setTimeout(() => {
                axios.delete(`${process.env.REACT_APP_API_URL}api/questions/${questionId}`)
                    .then(() => {
                        setQuestions(prev => prev.filter(q => q.questionId !== questionId));
                    })
                    .catch(err => {
                        console.error('Error deleting question:', err);
                        if (card) {
                            card.classList.remove('animate__animated', 'animate__fadeOut');
                        }
                        alert('Failed to delete question');
                    });
            }, 500);
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

    if (!quiz) {
        return (
            <div className="container py-5">
                <div className="alert alert-danger">
                    Quiz not found
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5 animate__animated animate__fadeIn">
            {/* Back Navigation Button */}
            <button
                onClick={() => navigate(`/teacher/${id}/quizzes`)}
                className="btn btn-outline-primary mb-4 shadow-sm d-flex align-items-center"
                style={{
                    borderColor: '#0d6efd',
                    color: '#0d6efd',
                    transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#0d6efd';
                    e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#0d6efd';
                }}
            >
                <i className="bi bi-arrow-left me-2"></i>
                Back to Quizzes
            </button>

            <div className="card shadow-lg p-4 border-0" style={{
                backgroundColor: '#f8f9fa',
                backgroundImage: 'linear-gradient(to bottom, #ffffff, #f1f3f5)'
            }}>
                {/* Quiz Header */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="text-primary mb-1 fw-bold">
                            <i className="bi bi-question-circle-fill me-2"></i>
                            {quiz.title}
                        </h2>
                        <p className="text-gray mb-0">{quiz.description}</p>
                        <p className="text-brown mb-0">
                            <i className="bi bi-book-fill me-2"></i>
                            {quiz.course?.title}
                        </p>
                    </div>
                    <div className="form-check form-switch">

                        <label className="form-check-label" htmlFor="quiz-availability">
                            {quiz.availability ? 'Active' : 'Inactive'}
                        </label>
                    </div>
                </div>

                <hr className="my-4 border-brown" />

                {/* Questions Count */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="text-brown fw-bold m-0">
                        <i className="bi bi-list-ol me-2"></i>
                        Questions ({questions.length})
                    </h5>
                </div>

                {/* Add New Question Form */}
                <div className="card mb-4 p-3 new-question-form" style={{
                    backgroundColor: '#e9ecef',
                    borderLeft: '5px solid #0d6efd'
                }}>
                    <h5 className="text-brown mb-3">
                        <i className="bi bi-plus-circle-fill me-2"></i>
                        Add New Question
                    </h5>
                    <div className="mb-3">
                        <label className="form-label">Question</label>
                        <input
                            type="text"
                            name="question"
                            className="form-control shadow-sm"
                            value={newQuestion.question}
                            onChange={handleNewQuestionChange}
                            placeholder="Enter the question"
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Options</label>
                        <div className="input-group mb-2">
                            <span className="input-group-text">1</span>
                            <input
                                type="text"
                                name="option1"
                                className="form-control shadow-sm"
                                value={newQuestion.option1}
                                onChange={handleNewQuestionChange}
                                placeholder="Option 1"
                            />
                        </div>
                        <div className="input-group mb-2">
                            <span className="input-group-text">2</span>
                            <input
                                type="text"
                                name="option2"
                                className="form-control shadow-sm"
                                value={newQuestion.option2}
                                onChange={handleNewQuestionChange}
                                placeholder="Option 2"
                            />
                        </div>
                        <div className="input-group mb-2">
                            <span className="input-group-text">3</span>
                            <input
                                type="text"
                                name="option3"
                                className="form-control shadow-sm"
                                value={newQuestion.option3}
                                onChange={handleNewQuestionChange}
                                placeholder="Option 3"
                            />
                        </div>
                        <div className="input-group mb-3">
                            <span className="input-group-text">4</span>
                            <input
                                type="text"
                                name="option4"
                                className="form-control shadow-sm"
                                value={newQuestion.option4}
                                onChange={handleNewQuestionChange}
                                placeholder="Option 4"
                            />
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Correct Answer</label>
                        <select
                            name="correct"
                            className="form-select shadow-sm"
                            value={newQuestion.correct}
                            onChange={handleNewQuestionChange}
                        >
                            <option value="1">Option 1</option>
                            <option value="2">Option 2</option>
                            <option value="3">Option 3</option>
                            <option value="4">Option 4</option>
                        </select>
                    </div>
                    <button
                        className="btn btn-primary shadow-sm"
                        onClick={handleAddQuestion}
                    >
                        <i className="bi bi-plus-lg me-2"></i>
                        Add Question
                    </button>
                </div>

                {/* Questions List */}
                {questions.length === 0 ? (
                    <div className="alert alert-info">
                        <i className="bi bi-info-circle-fill me-2"></i>
                        No questions found for this quiz. Add your first question above.
                    </div>
                ) : (
                    <div className="row g-4">
                        {questions.map((question) => (
                            <div key={question.questionId} id={`question-${question.questionId}`} className="col-md-6">
                                <div className="card h-100 border-0 shadow-sm" style={{
                                    backgroundColor: '#fff',
                                    borderLeft: '4px solid #ffc107'
                                }}>
                                    <div className="card-body">
                                        {editQuestionId === question.questionId ? (
                                            <div>
                                                <h6 className="text-brown mb-3">Edit Question</h6>
                                                <div className="mb-3">
                                                    <label className="form-label">Question</label>
                                                    <input
                                                        type="text"
                                                        name="question"
                                                        className="form-control shadow-sm"
                                                        value={editValues.question}
                                                        onChange={handleEditQuestionChange}
                                                    />
                                                </div>
                                                <div className="mb-3">
                                                    <label className="form-label">Options</label>
                                                    <div className="input-group mb-2">
                                                        <span className="input-group-text">1</span>
                                                        <input
                                                            type="text"
                                                            name="option1"
                                                            className="form-control shadow-sm"
                                                            value={editValues.option1}
                                                            onChange={handleEditQuestionChange}
                                                        />
                                                    </div>
                                                    <div className="input-group mb-2">
                                                        <span className="input-group-text">2</span>
                                                        <input
                                                            type="text"
                                                            name="option2"
                                                            className="form-control shadow-sm"
                                                            value={editValues.option2}
                                                            onChange={handleEditQuestionChange}
                                                        />
                                                    </div>
                                                    <div className="input-group mb-2">
                                                        <span className="input-group-text">3</span>
                                                        <input
                                                            type="text"
                                                            name="option3"
                                                            className="form-control shadow-sm"
                                                            value={editValues.option3}
                                                            onChange={handleEditQuestionChange}
                                                        />
                                                    </div>
                                                    <div className="input-group mb-3">
                                                        <span className="input-group-text">4</span>
                                                        <input
                                                            type="text"
                                                            name="option4"
                                                            className="form-control shadow-sm"
                                                            value={editValues.option4}
                                                            onChange={handleEditQuestionChange}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="mb-3">
                                                    <label className="form-label">Correct Answer</label>
                                                    <select
                                                        name="correct"
                                                        className="form-select shadow-sm"
                                                        value={editValues.correct}
                                                        onChange={handleEditQuestionChange}
                                                    >
                                                        <option value="1">Option 1</option>
                                                        <option value="2">Option 2</option>
                                                        <option value="3">Option 3</option>
                                                        <option value="4">Option 4</option>
                                                    </select>
                                                </div>
                                                <div className="d-flex justify-content-end">
                                                    <button
                                                        className="btn btn-warning me-2 shadow-sm"
                                                        onClick={handleSaveEdit}
                                                    >
                                                        <i className="bi bi-save me-1"></i>
                                                        Save
                                                    </button>
                                                    <button
                                                        className="btn btn-secondary shadow-sm"
                                                        onClick={() => setEditQuestionId(null)}
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div>
                                                <div className="d-flex justify-content-between align-items-start mb-2">
                                                    <h5 className="text-primary fw-bold mb-0">{question.question}</h5>
                                                </div>

                                                <div className="mb-3">
                                                    <label className="form-label text-gray">Options:</label>
                                                    <ul className="list-group">
                                                        <li
                                                            className={`list-group-item ${1 === question.correct ? 'list-group-item-success' : ''}`}
                                                        >
                                                            {question.option1}
                                                            {1 === question.correct && (
                                                                <span className="badge bg-success ms-2">Correct</span>
                                                            )}
                                                        </li>
                                                        <li
                                                            className={`list-group-item ${2 === question.correct ? 'list-group-item-success' : ''}`}
                                                        >
                                                            {question.option2}
                                                            {2 === question.correct && (
                                                                <span className="badge bg-success ms-2">Correct</span>
                                                            )}
                                                        </li>
                                                        <li
                                                            className={`list-group-item ${3 === question.correct ? 'list-group-item-success' : ''}`}
                                                        >
                                                            {question.option3}
                                                            {3 === question.correct && (
                                                                <span className="badge bg-success ms-2">Correct</span>
                                                            )}
                                                        </li>
                                                        <li
                                                            className={`list-group-item ${4 === question.correct ? 'list-group-item-success' : ''}`}
                                                        >
                                                            {question.option4}
                                                            {4 === question.correct && (
                                                                <span className="badge bg-success ms-2">Correct</span>
                                                            )}
                                                        </li>
                                                    </ul>
                                                </div>

                                                <div className="d-flex justify-content-end">
                                                    <button
                                                        className="btn btn-sm btn-outline-warning me-2 shadow-sm"
                                                        onClick={() => handleEditQuestion(question)}
                                                    >
                                                        <i className="bi bi-pencil-square me-1"></i>
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-outline-danger shadow-sm"
                                                        onClick={() => handleDeleteQuestion(question.questionId)}
                                                    >
                                                        <i className="bi bi-trash me-1"></i>
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
                )}
            </div>
        </div>
    );
}

export default EditQuizPage;