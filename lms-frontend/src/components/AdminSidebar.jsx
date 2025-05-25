import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { logout } from '../utils/auth';
import "../styles/AdminSidebar.css";

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || 'Admin';
  
  const menuItems = [
    { title: "Dashboard", path: "/admin", icon: "📊" },
    { title: "Courses", path: "/admin/courses", icon: "📚" },
    { title: "Students", path: "/admin/students", icon: "👨‍🎓" },
    { title: "Tutors", path: "/admin/tutors", icon: "👨‍🏫" },
    { title: "Enrollments", path: "/admin/enrollments", icon: "📝" },
    { title: "Payments", path: "/admin/payments", icon: "💰" },
    { title: "Reports", path: "/admin/reports", icon: "📈" },
    { title: "Settings", path: "/admin/settings", icon: "⚙️" }
  ];

  const handleLogout = () => {
    logout(() => {
      navigate('/login');
    });
  };

  return (
    <div className="admin-sidebar">
      <div className="admin-sidebar-header">
        <h2>Brightway Admin</h2>
        <div className="admin-user-info">
          <span className="admin-username">{userName}</span>
        </div>
      </div>
      <nav className="admin-sidebar-nav">
        <ul>
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link 
                to={item.path} 
                className={location.pathname === item.path ? "active" : ""}
              >
                <span className="menu-icon">{item.icon}</span>
                <span className="menu-title">{item.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="admin-sidebar-footer">
        <Link to="/" className="back-to-site">
          <span className="menu-icon">🏠</span>
          <span className="menu-title">Back to Website</span>
        </Link>
        <button onClick={handleLogout} className="logout-button">
          <span className="menu-icon">🚪</span>
          <span className="menu-title">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;