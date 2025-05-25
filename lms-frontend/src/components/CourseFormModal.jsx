import React, { useState, useEffect } from "react";
import { teacherService } from '../services/apiService';
import "../styles/CourseFormModal.css";

const CourseFormModal = ({ isOpen, onClose, onSave, course, isEditing }) => {
  const initialFormState = {
    title: "",
    icon: "",
    description: "",
    fullDescription: "",
    duration: "",
    level: "",
    prerequisites: "",
    price: "",
    topics: [""],
    teacher: { tId: "" } // Add teacher field
  };

  const [formData, setFormData] = useState(initialFormState);
  const [teachers, setTeachers] = useState([]);
  const [loadingTeachers, setLoadingTeachers] = useState(false);

  // Fetch teachers when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchTeachers();
    }
  }, [isOpen]);

  useEffect(() => {
    if (course) {
      setFormData({
        ...course,
        topics: course.topics || [""],
        teacher: { tId: course.teacher?.tId || "" }
      });
    } else {
      setFormData(initialFormState);
    }
  }, [course]);

  const fetchTeachers = async () => {
    setLoadingTeachers(true);
    try {
      const teachersData = await teacherService.getAll();
      setTeachers(teachersData);
    } catch (error) {
      console.error("Error fetching teachers:", error);
    } finally {
      setLoadingTeachers(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTeacherChange = (e) => {
    const teacherId = e.target.value;
    setFormData((prev) => ({
      ...prev,
      teacher: { tId: teacherId }
    }));
  };

  const handleTopicChange = (index, value) => {
    const updatedTopics = [...formData.topics];
    updatedTopics[index] = value;
    setFormData((prev) => ({
      ...prev,
      topics: updatedTopics
    }));
  };

  const addTopic = () => {
    setFormData((prev) => ({
      ...prev,
      topics: [...prev.topics, ""]
    }));
  };

  const removeTopic = (index) => {
    if (formData.topics.length <= 1) return;
    const updatedTopics = formData.topics.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      topics: updatedTopics
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const cleanedData = {
      ...formData,
      price: parseFloat(formData.price), // Convert price to number
      topics: formData.topics.filter((topic) => topic.trim() !== ""),
      teacher: { tId: parseInt(formData.teacher.tId) } // Ensure teacher ID is integer
    };

    onSave(cleanedData);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{isEditing ? "Edit Course" : "Create New Course"}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="icon">Icon (emoji or symbol)</label>
            <input
              type="text"
              id="icon"
              name="icon"
              value={formData.icon}
              onChange={handleChange}
              required
              maxLength={2}
            />
          </div>

          <div className="form-group">
            <label htmlFor="teacher">Teacher</label>
            <select
              id="teacher"
              name="teacher"
              value={formData.teacher.tId}
              onChange={handleTeacherChange}
              required
              disabled={loadingTeachers}
            >
              <option value="">
                {loadingTeachers ? "Loading teachers..." : "Select a teacher"}
              </option>
              {teachers.map((teacher) => (
                <option key={teacher.tId} value={teacher.tId}>
                  {teacher.tName} ({teacher.tEmail})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="description">Short Description</label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="fullDescription">Full Description</label>
            <textarea
              id="fullDescription"
              name="fullDescription"
              value={formData.fullDescription}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Topics</label>
            {formData.topics.map((topic, index) => (
              <div className="topic-input" key={index}>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => handleTopicChange(index, e.target.value)}
                  placeholder="Enter topic"
                />
                <button
                  type="button"
                  className="remove-topic-btn"
                  onClick={() => removeTopic(index)}
                >
                  -
                </button>
              </div>
            ))}
            <button type="button" className="add-topic-btn" onClick={addTopic}>
              + Add Topic
            </button>
          </div>

          <div className="form-row">
            <div className="form-group half">
              <label htmlFor="duration">Duration</label>
              <input
                type="text"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group half">
              <label htmlFor="level">Level</label>
              <select
                id="level"
                name="level"
                value={formData.level}
                onChange={handleChange}
                required
              >
                <option value="">Select level</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="prerequisites">Prerequisites</label>
            <input
              type="text"
              id="prerequisites"
              name="prerequisites"
              value={formData.prerequisites}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="price">Price (LKR)</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              step="0.01"
              min="0"
            />
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="save-btn">
              {isEditing ? "Update Course" : "Create Course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseFormModal;