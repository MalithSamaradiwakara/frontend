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

    useEffect(() => {
        if (location.state?.message) {
            setMessage(location.state.message);
        }
    }, [location]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prev => ({ ...prev, [name]: value }));
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
                localStorage.setItem('token', response.token);
            }

            if (userType === 'Student') {
                try {
                    const studentDetails = await authService.getLoginById(id);
                    if (studentDetails?.studentId) {
                        localStorage.setItem('studentId', studentDetails.studentId);
                    }
                } catch (studentError) {
                    console.error("Failed to fetch studentId:", studentError);
                    setError("Login succeeded, but failed to retrieve student details.");
                    return;
                }
            }

            // Redirect based on location state or user type
            if (location.state?.redirectUrl) {
                navigate(location.state.redirectUrl);
            } else {
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
            setError(error.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Login</h2>
                {message && <div className="alert alert-info">{message}</div>}
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            name="username"
                            value={credentials.username}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={credentials.password}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>User Type</label>
                        <select
                            name="userType"
                            value={credentials.userType}
                            onChange={handleInputChange}
                        >
                            <option value="Student">Student</option>
                            <option value="Teacher">Teacher</option>
                            <option value="Admin">Admin</option>
                        </select>
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
}