import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function AttemptQuiz() {
    const { id, quizId } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // 🪛 Fetch quiz and questions
    useEffect(() => {
        const fetchQuizData = async () => {
            try {
                setIsLoading(true);
                setError(null);

                console.log(`Fetching quiz with ID: ${quizId}`);

                // Fetch quiz details
                const quizRes = await axios.get(`http://localhost:8080/api/quizzes/${quizId}`);
                console.log('Quiz Data:', quizRes.data);
                if (!quizRes.data) throw new Error('Quiz not found');

                setQuiz(quizRes.data);

                // Fetch questions for the quiz
                const questionRes = await axios.get(`http://localhost:8080/api/questions/quiz/${quizId}`);
                console.log('Questions Data:', questionRes.data);
                if (!Array.isArray(questionRes.data) || questionRes.data.length === 0) {
                    throw new Error('No questions found for this quiz');
                }

                setQuestions(questionRes.data);
            } catch (err) {
                console.error('Fetch error:', err);
                setError(err.response?.data?.message || 'Failed to load quiz. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchQuizData();
    }, [quizId]);

    // Handle option selection
    const handleOptionChange = (questionId, selectedOption) => {
        setAnswers(prev => ({ ...prev, [questionId]: selectedOption }));
    };

    // Calculate Marks based on correct answers
    const calculateMarks = () => {
        let score = 0;
        questions.forEach((q) => {
            if (parseInt(answers[q.questionId]) === q.correct) {
                score += 1;
            }
        });
        return (score / questions.length) * 100;
    };

    // Submit quiz attempt
    const handleSubmit = async () => {
        if (Object.keys(answers).length !== questions.length) {
            setError("Please answer all questions before submitting.");
            return;
        }

        try {
            const attemptData = {
                id: {
                    quizId: parseInt(quizId),
                    sId: parseInt(id)
                },
                student: { studentId: parseInt(id) },
                quiz: { quizId: parseInt(quizId) },
                submissionDate: new Date().toISOString(),
                feedback: "Auto-generated feedback",
                marks: calculateMarks()
            };

            console.log('Attempt Data:', attemptData);

            await axios.post(`http://localhost:8080/api/attempts`, attemptData);
            alert("Quiz submitted successfully!");
            navigate(`/student/${id}/quizzes`);
        } catch (err) {
            console.error('Submission error:', err.response?.data || err.message);
            setError('Failed to submit quiz. Please try again.');
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
        <div className="container py-5">
            <h2 className="text-primary mb-4">📝 Attempt Quiz</h2>
            {quiz && (
                <div className="card shadow-lg p-4 mb-4">
                    <h4>{quiz.title}</h4>
                    <p>{quiz.description}</p>
                </div>
            )}

            {questions.length > 0 ? (
                questions.map((question, index) => (
                    <div key={question.questionId} className="card mb-3 p-3 shadow-sm">
                        <h5>Q{index + 1}. {question.question}</h5>
                        {question.answers.split(';').map((option, optIndex) => (
                            <div key={optIndex} className="form-check">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name={`question-${question.questionId}`}
                                    value={optIndex + 1}
                                    checked={answers[question.questionId] === (optIndex + 1)}
                                    onChange={() => handleOptionChange(question.questionId, optIndex + 1)}
                                />
                                <label className="form-check-label">{option}</label>
                            </div>
                        ))}
                    </div>
                ))
            ) : (
                <p>No questions available.</p>
            )}

            <div className="text-center mt-4">
                <button
                    className="btn btn-success"
                    onClick={handleSubmit}
                    disabled={Object.keys(answers).length !== questions.length}
                >
                    ✅ Finish Attempt
                </button>
            </div>
        </div>
    );
}

export default AttemptQuiz;
