import React, { useState, useEffect } from "react";
import { courseService } from "../services/apiService";
import CourseFormModal from "../components/CourseFormModal";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import "../styles/AdminCourseDashboard.css";

const AdminCourseDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Form Modal states
  const [showModal, setShowModal] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Delete Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  
  // Filter and Search states
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all"); // "all", "active", "inactive"

  // Fetch courses from the API
  useEffect(() => {
    fetchCourses();
  }, []);

  // Apply filters when courses, searchTerm, or activeFilter changes
  useEffect(() => {
    applyFilters();
  }, [courses, searchTerm, activeFilter]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const coursesData = await courseService.getAll();
      setCourses(coursesData);
      setFilteredCourses(coursesData);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch courses. Please try again later.");
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...courses];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(course => 
        course.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply active/inactive filter
    if (activeFilter === "active") {
      filtered = filtered.filter(course => course.isActive);
    } else if (activeFilter === "inactive") {
      filtered = filtered.filter(course => !course.isActive);
    }
    
    setFilteredCourses(filtered);
  };

  // Handle create course
  const handleCreateClick = () => {
    setCurrentCourse(null);
    setIsEditing(false);
    setShowModal(true);
  };

  // Handle edit course
  const handleEditClick = (course) => {
    setCurrentCourse(course);
    setIsEditing(true);
    setShowModal(true);
  };

  // Handle delete course
  const handleDeleteClick = (course) => {
    setCourseToDelete(course);
    setShowDeleteModal(true);
  };

  // Handle save course (create or update)
  const handleSaveCourse = async (courseData) => {
    try {
      if (isEditing) {
        // Update existing course
        await courseService.update(currentCourse.id, courseData);
      } else {
        // Create new course
        await courseService.create(courseData);
      }
      setShowModal(false);
      fetchCourses(); // Refresh the courses list
    } catch (err) {
      console.error("Error saving course:", err);
      alert("Failed to save course. Please try again.");
    }
  };

  // Handle confirm delete
  const handleConfirmDelete = async () => {
    try {
      await courseService.delete(courseToDelete.id);
      setShowDeleteModal(false);
      fetchCourses(); // Refresh the courses list
    } catch (err) {
      console.error("Error deleting course:", err);
      alert("Failed to delete course. Please try again.");
    }
  };

  // Toggle active status
  const toggleActiveStatus = async (course) => {
    try {
      const updatedCourse = { ...course, isActive: !course.isActive };
      await courseService.update(course.id, updatedCourse);
      fetchCourses(); // Refresh the courses list
    } catch (err) {
      console.error("Error updating course status:", err);
      alert("Failed to update course status. Please try again.");
    }
  };

  return (
    <div className="admin-dashboard-container">
      <div className="admin-dashboard-header">
        <h1>Course Management</h1>
        <button className="create-course-btn" onClick={handleCreateClick}>
          Add New Course
        </button>
      </div>
      
      <div className="admin-dashboard-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search courses by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-options">
          <label>Filter Status:</label>
          <select 
            value={activeFilter} 
            onChange={(e) => setActiveFilter(e.target.value)}
          >
            <option value="all">All Courses</option>
            <option value="active">Active Courses</option>
            <option value="inactive">Inactive Courses</option>
          </select>
        </div>
      </div>
      
      {loading ? (
        <div className="loading">Loading courses...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <div className="admin-course-table-container">
          <table className="admin-course-table">
            <thead>
              <tr>
                <th>Icon</th>
                <th>Title</th>
                <th>Description</th>
                <th>Price (LKR)</th>
                <th>Level</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course) => (
                  <tr key={course.id}>
                    <td className="course-icon-cell">{course.icon}</td>
                    <td>{course.title}</td>
                    <td className="description-cell">{course.description}</td>
                    <td>{course.price?.toFixed(2)}</td>
                    <td>{course.level}</td>
                    <td>
                      <div className="status-toggle">
                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={course.isActive}
                            onChange={() => toggleActiveStatus(course)}
                          />
                          <span className="slider round"></span>
                        </label>
                        <span className={`status-text ${course.isActive ? 'active' : 'inactive'}`}>
                          {course.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </td>
                    <td className="action-cell">
                      <button 
                        className="edit-btn"
                        onClick={() => handleEditClick(course)}
                      >
                        Edit
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => handleDeleteClick(course)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="no-courses">
                    No courses found. Try adjusting your filters or add a new course.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Course Form Modal */}
      {showModal && (
        <CourseFormModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSave={handleSaveCourse}
          course={currentCourse}
          isEditing={isEditing}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <DeleteConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleConfirmDelete}
          courseName={courseToDelete?.title}
        />
      )}
    </div>
  );
};

export default AdminCourseDashboard;