import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../services/apiService';

export default function Login() {
    const [credentials, setCredentials] = useState({
        username: '',
        password: '',
        userType: 'Student'
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
        setError('');
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            console.log('Attempting login with credentials:', { ...credentials, password: '***' });
            const response = await authService.login(credentials);
            console.log('Login response:', response);

            if (!response) {
                throw new Error('No response received from server');
            }

            const { id, userType, name, token } = response;

            if (!id || !userType) {
                throw new Error('Invalid response format from server');
            }

            localStorage.setItem('userId', id);
            localStorage.setItem('userType', userType);
            localStorage.setItem('userName', name);
            if (token) {
                localStorage.setItem('token', token);
            }

            if (userType === 'Student') {
                try {
                    const studentDetails = await authService.getLoginById(id);
                    console.log('Student details:', studentDetails);
                    if (studentDetails?.studentId) {
                        localStorage.setItem('studentId', studentDetails.studentId);
                    }
                } catch (studentError) {
                    console.error("Failed to fetch studentId:", studentError);
                }
            }

            if (location.state?.redirectUrl) {
                navigate(location.state.redirectUrl);
            } else {
                switch (userType) {
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
            setError(
                error.message ||
                error.error?.message ||
                'Login failed. Please check your credentials and try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4 shadow" style={{ width: '100%', maxWidth: '400px' }}>
                <h3 className="text-center mb-4">Login</h3>
                {message && <div className="alert alert-info">{message}</div>}
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">Username</label>
                        <input
                            type="text"
                            name="username"
                            id="username"
                            value={credentials.username}
                            onChange={handleInputChange}
                            required
                            disabled={loading}
                            className="form-control"
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            value={credentials.password}
                            onChange={handleInputChange}
                            required
                            disabled={loading}
                            className="form-control"
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="userType" className="form-label">User Type</label>
                        <select
                            name="userType"
                            id="userType"
                            value={credentials.userType}
                            onChange={handleInputChange}
                            disabled={loading}
                            className="form-select"
                        >
                            <option value="Student">Student</option>
                            <option value="Teacher">Teacher</option>
                            <option value="Admin">Admin</option>
                        </select>
                    </div>
                    <div className="d-grid">
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
