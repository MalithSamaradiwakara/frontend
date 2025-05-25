import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/CourseCard.css"; 

const CourseCard = ({ course }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    // Check if slug exists, otherwise use course.id as a fallback
    const courseId = course.slug ? course.slug : course.id;
    navigate(`/course/${courseId}`);
  };

  return (
    <div className="course-card" onClick={handleCardClick}>
      <div className="course-icon">{course.icon}</div>
      <div className="course-info">
        <h3>{course.title}</h3>
        <p>{course.description}</p>
      </div>
    </div>
  );
};

export default CourseCard;