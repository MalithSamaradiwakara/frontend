import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export function CreateQuizPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [quizData, setQuizData] = useState({
        title: "",
        description: "",
        courseId: "",
        availability: true
    });
    const [questions, setQuestions] = useState([]);
    const [newQuestion, setNewQuestion] = useState({
        question: "",
        option1: "",
        option2: "",
        option3: "",
        option4: "",
        correct: 1
    });

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setIsLoading(true);

                // 🔐 Step 1: Get user login ID from localStorage
                const loginId = localStorage.getItem('userId');
                if (!loginId) throw new Error('User not logged in');

                // 🔐 Step 2: Get teacherId using loginId
                const loginRes = await axios.get(`http://localhost:8080/api/auth/login/${loginId}`);
                const teacherId = loginRes.data.teacherId;
                if (!teacherId) throw new Error('No teacher ID found for logged-in user');

                // 📘 Step 3: Fetch courses using teacherId
                const coursesRes = await axios.get(`http://localhost:8080/api/courses/teacher/${teacherId}`);
                setCourses(coursesRes.data);

            } catch (err) {
                console.error('Error fetching courses:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCourses();
    }, []);


    const handleQuizChange = (e) => {
        const { name, value } = e.target;
        setQuizData(prev => ({ ...prev, [name]: value }));
    };

    const handleQuestionChange = (e) => {
        const { name, value } = e.target;
        setNewQuestion(prev => ({ ...prev, [name]: value }));
    };

    const handleAddQuestion = () => {
        const { option1, option2, option3, option4, ...rest } = newQuestion;

        if (!rest.question || !option1 || !option2 || !option3 || !option4) {
            alert("Please fill in all question fields");
            return;
        }

        const questionToAdd = {
            ...rest,
            answers: `${option1};${option2};${option3};${option4}`,
            correct: parseInt(rest.correct)
        };

        setQuestions(prev => [...prev, questionToAdd]);
        setNewQuestion({
            question: "",
            option1: "",
            option2: "",
            option3: "",
            option4: "",
            correct: 1
        });
    };

    const handleDeleteQuestion = (index) => {
        setQuestions(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmitQuiz = async () => {
        if (!quizData.title || !quizData.courseId) {
            alert("Please provide a quiz title and select a course");
            return;
        }

        if (questions.length === 0) {
            alert("Please add at least one question");
            return;
        }

        try {
            // Step 1: Create the quiz and get its ID
            const quizResponse = await axios.post(`http://localhost:8080/api/quizzes`, {
                title: quizData.title,
                description: quizData.description,
                availability: quizData.availability,
                course: { courseId: parseInt(quizData.courseId) },
                teacher: { teacherId: parseInt(id) }
            });

            const createdQuiz = quizResponse.data;
            const quizId = createdQuiz.quizId;

            // Step 2: Add questions one by one using the quiz ID
            await Promise.all(questions.map(question =>
                axios.post(`http://localhost:8080/api/questions`, {
                    quiz: { quizId },  // Correct way to link the question to the quiz
                    question: question.question,
                    answers: question.answers,
                    correct: question.correct
                })
            ));

            alert("Quiz and questions created successfully!");
            navigate(`/teacher/${id}/quizzes`);
        } catch (err) {
            console.error('Error creating quiz or questions:', err);
            alert("Failed to create quiz. Please try again.");
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
            <button
                onClick={() => navigate(`/teacher/${id}/quizzes`)}
                className="btn btn-outline-primary mb-4 shadow-sm d-flex align-items-center"
                style={{
                    borderColor: '#0d6efd',
                    color: '#0d6efd',
                    transition: 'all 0.3s'
                }}
            >
                <i className="bi bi-arrow-left me-2"></i>
                Back to Quizzes
            </button>

            <div className="card shadow-lg p-4 border-0" style={{
                backgroundColor: '#f8f9fa',
                backgroundImage: 'linear-gradient(to bottom, #ffffff, #f1f3f5)'
            }}>
                <h2 className="text-primary mb-4 fw-bold">
                    <i className="bi bi-plus-circle-fill me-2"></i>
                    Create New Quiz
                </h2>

                <div className="row g-3 mb-4">
                    <div className="col-md-6">
                        <label className="form-label">Quiz Title*</label>
                        <input
                            type="text"
                            name="title"
                            className="form-control shadow-sm"
                            value={quizData.title}
                            onChange={handleQuizChange}
                            required
                        />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Course*</label>
                        <select
                            name="courseId"
                            className="form-select shadow-sm"
                            value={quizData.courseId}
                            onChange={handleQuizChange}
                            required
                        >
                            <option value="">Select a course</option>
                            {courses.map(course => (
                                <option key={course.courseId} value={course.courseId}>
                                    {course.title}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="col-12">
                        <label className="form-label">Description</label>
                        <textarea
                            name="description"
                            className="form-control shadow-sm"
                            value={quizData.description}
                            onChange={handleQuizChange}
                            rows="3"
                        />
                    </div>
                    <div className="col-md-6">
                        <div className="form-check form-switch d-flex align-items-center">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="quiz-availability"
                                checked={quizData.availability}
                                onChange={(e) => setQuizData({ ...quizData, availability: e.target.checked })}
                                style={{
                                    width: '3rem',
                                    height: '1.5rem',
                                    backgroundColor: quizData.availability ? '#0d6efd' : '#6c757d',
                                    borderColor: quizData.availability ? '#0b5ed7' : '#5c636a'
                                }}
                            />
                            <label className="form-check-label ms-3 fs-5" htmlFor="quiz-availability">
                                {quizData.availability ? 'Active' : 'Inactive'}
                            </label>
                        </div>
                    </div>
                </div>

                <hr className="my-4 border-brown" />

                <h5 className="text-brown fw-bold mb-3">
                    <i className="bi bi-question-circle me-2"></i>
                    Questions ({questions.length})
                </h5>

                <div className="card mb-4 p-3" style={{
                    backgroundColor: '#e9ecef',
                    borderLeft: '5px solid #0d6efd'
                }}>
                    <h6 className="text-brown mb-3">
                        <i className="bi bi-plus-lg me-2"></i>
                        Add New Question
                    </h6>
                    <div className="mb-3">
                        <label className="form-label">Question*</label>
                        <input
                            type="text"
                            name="question"
                            className="form-control shadow-sm"
                            value={newQuestion.question}
                            onChange={handleQuestionChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Options*</label>
                        {[1, 2, 3, 4].map(num => (
                            <div key={num} className="input-group mb-2">
                                <span className="input-group-text">{num}</span>
                                <input
                                    type="text"
                                    name={`option${num}`}
                                    className="form-control shadow-sm"
                                    value={newQuestion[`option${num}`]}
                                    onChange={handleQuestionChange}
                                    required
                                />
                            </div>
                        ))}
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Correct Answer*</label>
                        <select
                            name="correct"
                            className="form-select shadow-sm"
                            value={newQuestion.correct}
                            onChange={handleQuestionChange}
                            required
                        >
                            {[1, 2, 3, 4].map(num => (
                                <option key={num} value={num}>Option {num}</option>
                            ))}
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

                {questions.length > 0 && (
                    <div className="mb-4">
                        <h6 className="text-brown mb-3">Added Questions</h6>
                        <div className="row g-4">
                            {questions.map((q, index) => (
                                <div key={index} className="col-md-6">
                                    <div className="card h-100 border-0 shadow-sm">
                                        <div className="card-body">
                                            <h6 className="text-primary fw-bold">{q.question}</h6>
                                            <ul className="list-group mb-3">
                                                {q.answers.split(';').map((answer, i) => (
                                                    <li
                                                        key={i}
                                                        className={`list-group-item ${i + 1 === q.correct ? 'list-group-item-success' : ''}`}
                                                    >
                                                        {answer.trim()}
                                                        {i + 1 === q.correct && (
                                                            <span className="badge bg-success ms-2">Correct</span>
                                                        )}
                                                    </li>
                                                ))}
                                            </ul>
                                            <button
                                                className="btn btn-sm btn-outline-danger shadow-sm"
                                                onClick={() => handleDeleteQuestion(index)}
                                            >
                                                <i className="bi bi-trash me-1"></i>
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="d-flex justify-content-end">
                    <button
                        className="btn btn-success shadow-sm"
                        onClick={handleSubmitQuiz}
                        disabled={!quizData.title || !quizData.courseId || questions.length === 0}
                    >
                        <i className="bi bi-check-circle me-2"></i>
                        Create Quiz
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CreateQuizPage;