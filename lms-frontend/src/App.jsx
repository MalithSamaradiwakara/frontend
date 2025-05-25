import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';

import Navbar from './components/Navbar';

// Auth Components
import Login from './components/Login';
import UserTypeSelection from './components/UserTypeSelection';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';

// Pages (existing)
import HomePage from './pages/HomePage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailsPage from './pages/CourseDetailsPage';
import ProfilePage from './pages/ProfilePage';
import TutorsPage from './pages/Teacher/TutorsPage';
import MyCoursesPage from './pages/MyCoursesPage';
import SupportPage from './pages/SupportPage';
import ViewTutorPage from './pages/Teacher/ViewTutorPage';
import EditTeacher from './pages/Teacher/EditTeacher';
import AddTeacher from './pages/Teacher/AddTeacher';
import AdminTeacher from './pages/Teacher/AdminTeacher';
import TeacherSelfReg from './pages/Teacher/TeacherSelfReg';
import CourseContentPage from "./pages/CourseContentPage";
// New Pages
import EnrollmentPage from './pages/EnrollmentPage';
import AddStudent from './pages/Student/AddStudent';
import EditStudent from './pages/Student/EditStudent';
import ViewStudent from './pages/Student/ViewStudent';
import AdminStudentDashboard from './pages/AdminStudentDashboard';
import MyProfile from './pages/MyProfile';

// Admin Pages
import AdminLayout from './components/AdminLayout';
import AdminPage from './pages/AdminPage';
import AdminCourseDashboard from './pages/AdminCourseDashboard';
import AdminEnrollmentDashboard from './pages/AdminEnrollmentDashboard';
import './App.css';
import AdminReg from './pages/AdminReg';
import AdminTeacherDashboard from './pages/AdminTeacherDashboard';
import TeacherLayout from './components/TeacherLayout';
import TeacherDashboard from './pages/Teacher/TeacherDashboard';
import ViewTeacherAdmin from './pages/Teacher/ViewTeacherAdmin';

// Generic Protected Route
const ProtectedRoute = ({ children, allowedUserTypes, redirectPath = '/login' }) => {
  const userType = localStorage.getItem('userType');
  if (!userType || !allowedUserTypes.includes(userType)) {
    return <Navigate to={redirectPath} replace />;
  }
  return children;
};

const AppContent = () => {
  const location = useLocation();

  // Hide navbar on login, register, admin pages, and teacher pages
  const hideNavbarRoutes = ['/login', '/register', '/admin', '/teacher'];
  const shouldHideNavbar = hideNavbarRoutes.some(path =>
    location.pathname.startsWith(path)
  );

  return (
    <>
      {!shouldHideNavbar && <Navbar />}
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<UserTypeSelection />} />
        
        {/* Teacher Protected Routes */}
        <Route
          element={
            <ProtectedRoute allowedUserTypes={['Teacher']}>
              <TeacherLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
          <Route path="/teacher/courses" element={<div>Teacher Courses</div>} />
          <Route path="/teacher/students" element={<div>Teacher Students</div>} />
        </Route>

        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/course/:courseId" element={<CourseDetailsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/tutors" element={<TutorsPage />} />
        <Route path="/my-courses" element={<MyCoursesPage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/admins/add" element={<AdminReg />} />
        <Route path="/course/:courseId/content" element={<CourseContentPage />} />
        <Route path="/students/addstudent" element={<AddStudent />} />
        {/* Teacher Management (from old version) */}
        <Route path="/tutors/viewtutors/:id" element={<ViewTutorPage />} />
        <Route path="/tutors/edittutors/:id" element={<EditTeacher />} />
        <Route path="/admin/teachers" element={<AdminTeacher />} />
        <Route path="/teachers/add" element={<TeacherSelfReg />} />

        {/* Enrollment (protected route) */}
        <Route
          path="/enroll/:courseId"
          element={
            <ProtectedRoute allowedUserTypes={['Student']}>
              <EnrollmentPage />
            </ProtectedRoute>
          }
        />

        {/* Student Management */}
        <Route path="/myprofile/:id" element={<MyProfile />} />
        <Route path="/students/view/:id" element={<ViewStudent />} />
        <Route 
          path="/students/edit/:id" 
          element={
            <ProtectedRoute allowedUserTypes={['Student']}>
              <EditStudent />
            </ProtectedRoute>
          } 
        />

        {/* Admin Protected Routes */}
        <Route element={<ProtectedAdminRoute />}> 
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminPage />} />
            <Route path="courses" element={<AdminCourseDashboard />} />
            <Route path="students" element={<AdminStudentDashboard />} />
            <Route path="students/addstudent" element={<AddStudent />} />
            <Route path="students/viewstudent/:id" element={<ViewStudent />} />
            <Route path="tutors" element={<AdminTeacherDashboard /> } />
            <Route path="tutors/view/:id" element={<ViewTeacherAdmin />} />
            <Route path="teachers/addteacher" element={<AddTeacher />} />
            <Route path="tutors/edittutors/:id" element={<EditTeacher />} />
            <Route path="enrollments" element={<AdminEnrollmentDashboard />} />
            <Route path="payments" element={<div>Payments Management</div>} />
            <Route path="reports" element={<div>Reports</div>} />
            <Route path="settings" element={<div>Settings</div>} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <Router>
      <div className="App">
        <AppContent />
      </div>
    </Router>
  );
}

export default App;
