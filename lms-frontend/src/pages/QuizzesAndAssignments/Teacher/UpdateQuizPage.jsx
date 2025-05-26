import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

export function UpdateQuizPage() {
    const { id, quizId } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState({});
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}api/quizzes/${quizId}`)
            .then(res => setQuiz(res.data));

        axios.get(`${process.env.REACT_APP_API_URL}api/questions/quiz/${quizId}`)
            .then(res => {
                const mapped = res.data.map(q => ({
                    ...q,
                    options: q.options // already array from mapper
                }));
                setQuestions(mapped);
            });
    }, [quizId]);

    const handleQuestionChange = (index, field, value) => {
        const updated = [...questions];
        if (field === 'text') updated[index].text = value;
        else updated[index].options[field] = value;
        setQuestions(updated);
    };

    const handleCorrectOption = (index, value) => {
        const updated = [...questions];
        updated[index].correctOption = parseInt(value);
        setQuestions(updated);
    };

    const handleSave = async () => {
        for (const q of questions) {
            await axios.put(`${process.env.REACT_APP_API_URL}api/questions/${q.id}`, {
                text: q.text,
                options: q.options.join(","),
                correctOption: q.correctOption,
                quizId: parseInt(quizId)
            });
        }
        alert("Quiz updated successfully!");
        navigate(`/teacher/${id}/teacher-quizzes`);
    };

    return (
        <div className="container py-5">
            <div className="card shadow-lg p-4">
                <h2 className="text-primary mb-4">✏️ Update Quiz: {quiz.title}</h2>

                {questions.map((q, index) => (
                    <div key={q.id} className="border p-3 mb-3">
                        <input
                            type="text"
                            className="form-control mb-2"
                            placeholder={`Question ${index + 1}`}
                            value={q.text}
                            onChange={e => handleQuestionChange(index, 'text', e.target.value)}
                        />
                        {q.options.map((opt, i) => (
                            <div key={i} className="input-group mb-1">
                                <span className="input-group-text">Option {i + 1}</span>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={opt}
                                    onChange={e => handleQuestionChange(index, i, e.target.value)}
                                />
                            </div>
                        ))}
                        <select className="form-select mt-2" value={q.correctOption} onChange={e => handleCorrectOption(index, e.target.value)}>
                            <option value="0">Correct Answer: Option 1</option>
                            <option value="1">Correct Answer: Option 2</option>
                            <option value="2">Correct Answer: Option 3</option>
                            <option value="3">Correct Answer: Option 4</option>
                        </select>
                    </div>
                ))}

                <button className="btn btn-warning" onClick={handleSave}>💾 Save Changes</button>
            </div>
        </div>
    );
}


export default UpdateQuizPage;
