import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { studentService } from '../services/apiService';
import defaultProfileImage from '../pic/dummy.jpg';
import "../styles/AdminStudentDashboard.css";

const AdminStudentDashboard = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    // Filter students whenever searchTerm changes
    const filtered = students.filter(student => 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStudents(filtered);
  }, [searchTerm, students]);

  const loadStudents = async () => {
    try {
      const studentData = await studentService.getAll();
      setStudents(studentData);
      setFilteredStudents(studentData);
      setError(null);
    } catch (error) {
      console.error("Error loading students:", error);
      setError("Failed to load students. Please try again.");
      setStudents([]);
      setFilteredStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteStudent = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await studentService.delete(id);
        alert("Student deleted successfully");
        loadStudents();
      } catch (error) {
        console.error("Error deleting student:", error);
        alert("Failed to delete student. Please try again.");
      }
    }
  };

  const getStudentPhoto = (photoUrl) => {
    return photoUrl || defaultProfileImage;
  };

  return (
    <div className="admin-student-dashboard">
      <div className="admin-dashboard-header">
        <h1>Student Management</h1>
      </div>
      <div className="admin-dashboard-content">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="search-box">
            <input
              type="text"
              className="form-control"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Link className="btn btn-primary" to="/admin/students/addstudent">
            Add New Student
          </Link>
        </div>
        {loading ? (
          <div className="text-center mt-5">Loading...</div>
        ) : error ? (
          <div className="text-center mt-5 text-danger">{error}</div>
        ) : filteredStudents.length === 0 ? (
          <div className="text-center mt-5">
            {searchTerm ? 'No matching students found' : 'No students found'}
          </div>
        ) : (
          <table className="table table-hover border shadow">
            <thead className="table-dark">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Photo</th>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Contact</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student, index) => (
                <tr key={student.id}>
                  <th scope="row">{index + 1}</th>
                  <td>
                    <img 
                      src={getStudentPhoto(student.photo)} 
                      alt={student.name}
                      className="rounded-circle"
                      style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                    />
                  </td>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>{student.contact}</td>
                  <td>
                    <div className="btn-group btn-group-sm" role="group">
                      <Link 
                        className="btn btn-outline-primary" 
                        to={`/admin/students/viewstudent/${student.id}`}
                      >
                        View
                      </Link>
                      <button 
                        className="btn btn-outline-danger" 
                        onClick={() => deleteStudent(student.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminStudentDashboard;
