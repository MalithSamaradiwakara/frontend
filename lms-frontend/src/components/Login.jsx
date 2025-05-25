import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../services/apiService';
import '../styles/Login.css';

export default function Login() {
    const [credentials, setCredentials] = useState({
        username: '',
        password: '',
        userType: 'Student' // Default user type
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const navigate = useNavigate();
    const location = useLocation();

    // Extract redirect URL and message from location state (if provided)
    useEffect(() => {
        if (location.state) {
            if (location.state.message) {
                setMessage(location.state.message);
            }
        }
    }, [location]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });
        setError(''); // Clear error when user types
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await authService.login(credentials);
            const { id, userType, name } = response;

            // Store user info in localStorage
            localStorage.setItem('userId', id);
            localStorage.setItem('userType', userType);
            localStorage.setItem('userName', name);
            
            // Set auth token if available
            if (response.token) {
                localStorage.setItem('authToken', response.token);
            }

            if (userType === 'Student') {
                try {
                    const studentDetails = await authService.getLoginById(id);
                    const { studentId } = studentDetails;

                    if (studentId) {
                        localStorage.setItem('studentId', studentId);
                    }
                } catch (studentError) {
                    console.error("Failed to fetch studentId:", studentError);
                    setError("Login succeeded, but failed to retrieve student details.");
                }
            }

            // Redirect based on location state or user type
            if (location.state && location.state.redirectUrl) {
                navigate(location.state.redirectUrl);
            } else {
                // Default redirect based on user type
                switch(userType) {
                    case 'Student':
                        navigate('/student/dashboard');
                        break;
                    case 'Teacher':
                        navigate('/teacher/dashboard');
                        break;
                    case 'Admin':
                        navigate('/admin');
                        break;
                    default:
                        navigate('/');
                }
            }
        } catch (error) {
            console.error('Login failed:', error);
            setError(error.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2 className="text-center mb-4">Welcome to Brightway LMS</h2>
                {message && <div className="alert alert-info">{message}</div>}
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label htmlFor="userType">I am a</label>
                        <select
                            className="form-control"
                            name="userType"
                            value={credentials.userType}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="Student">Student</option>
                            <option value="Teacher">Teacher</option>
                            <option value="Admin">Admin</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            className="form-control"
                            name="username"
                            value={credentials.username}
                            onChange={handleInputChange}
                            placeholder="Enter your username"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            name="password"
                            value={credentials.password}
                            onChange={handleInputChange}
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="btn btn-primary w-100"
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                    <div className="text-center mt-3">
                        <a href="/register" className="register-link">
                            Don't have an account? Register here
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
}