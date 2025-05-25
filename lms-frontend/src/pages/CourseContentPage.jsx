import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/CourseContentPage.css";

export default function CourseContentPage() {
  const { courseId } = useParams();
  const [activeTab, setActiveTab] = useState("learning-materials");

  // Hardcoded course data for demonstration
  const courseData = {
    id: courseId,
    title: "Introduction to Web Development",
    description: "Learn the fundamentals of web development including HTML, CSS, and JavaScript.",
    modules: [
      {
        id: 1,
        title: "Getting Started with HTML",
        materials: [
          { id: 1, type: "video", title: "Introduction to HTML", duration: "10:25", url: "#" },
          { id: 2, type: "reading", title: "HTML Basics - Elements and Tags", timeToRead: "15 min", url: "#" },
          { id: 3, type: "video", title: "Creating Your First HTML Page", duration: "15:40", url: "#" }
        ]
      },
      {
        id: 2,
        title: "CSS Fundamentals",
        materials: [
          { id: 4, type: "video", title: "Introduction to CSS", duration: "12:18", url: "#" },
          { id: 5, type: "reading", title: "CSS Selectors and Properties", timeToRead: "20 min", url: "#" },
          { id: 6, type: "video", title: "Styling Your HTML Page", duration: "18:35", url: "#" }
        ]
      },
      {
        id: 3,
        title: "JavaScript Basics",
        materials: [
          { id: 7, type: "video", title: "Introduction to JavaScript", duration: "14:55", url: "#" },
          { id: 8, type: "reading", title: "Variables and Data Types", timeToRead: "25 min", url: "#" },
          { id: 9, type: "video", title: "Writing Your First JavaScript Code", duration: "20:10", url: "#" }
        ]
      }
    ],
    assignments: [
      {
        id: 1,
        title: "HTML Structure Assignment",
        description: "Create a basic HTML page with proper semantic structure.",
        dueDate: "2025-06-01",
        points: 100,
        status: "not-started"
      },
      {
        id: 2,
        title: "CSS Styling Challenge",
        description: "Style the HTML page you created with CSS properties.",
        dueDate: "2025-06-15",
        points: 150,
        status: "not-started"
      },
      {
        id: 3,
        title: "JavaScript Event Handlers",
        description: "Add event handlers to your web page using JavaScript.",
        dueDate: "2025-06-30",
        points: 200,
        status: "not-started"
      }
    ],
    quizzes: [
      {
        id: 1,
        title: "HTML Basics Quiz",
        questions: 10,
        timeLimit: "15 minutes",
        availableUntil: "2025-06-10",
        status: "available"
      },
      {
        id: 2,
        title: "CSS Properties Quiz",
        questions: 15,
        timeLimit: "20 minutes",
        availableUntil: "2025-06-20",
        status: "available"
      },
      {
        id: 3,
        title: "JavaScript Fundamentals Quiz",
        questions: 20,
        timeLimit: "25 minutes",
        availableUntil: "2025-07-05",
        status: "available"
      }
    ]
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "learning-materials":
        return (
          <div className="tab-content-container">
            <h2>Learning Materials</h2>
            <div className="modules-container">
              {courseData.modules.map((module) => (
                <div className="module-card" key={module.id}>
                  <h3 className="module-title">{module.title}</h3>
                  <div className="materials-list">
                    {module.materials.map((material) => (
                      <div className="material-item" key={material.id}>
                        <div className="material-icon">
                          {material.type === "video" ? "🎬" : "📄"}
                        </div>
                        <div className="material-info">
                          <h4>{material.title}</h4>
                          <p>
                            {material.type === "video" 
                              ? `Duration: ${material.duration}` 
                              : `Reading time: ${material.timeToRead}`}
                          </p>
                        </div>
                        <button className="material-button">Access</button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case "assignments":
        return (
          <div className="tab-content-container">
            <h2>Assignments</h2>
            <div className="assignments-container">
              {courseData.assignments.map((assignment) => (
                <div className="assignment-card" key={assignment.id}>
                  <h3>{assignment.title}</h3>
                  <p className="assignment-description">{assignment.description}</p>
                  <div className="assignment-details">
                    <span className="assignment-due">Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                    <span className="assignment-points">{assignment.points} points</span>
                  </div>
                  <button className="assignment-button">Start Assignment</button>
                </div>
              ))}
            </div>
          </div>
        );
      case "quizzes":
        return (
          <div className="tab-content-container">
            <h2>Quizzes</h2>
            <div className="quizzes-container">
              {courseData.quizzes.map((quiz) => (
                <div className="quiz-card" key={quiz.id}>
                  <h3>{quiz.title}</h3>
                  <div className="quiz-details">
                    <p><strong>Questions:</strong> {quiz.questions}</p>
                    <p><strong>Time Limit:</strong> {quiz.timeLimit}</p>
                    <p><strong>Available Until:</strong> {new Date(quiz.availableUntil).toLocaleDateString()}</p>
                  </div>
                  <button className="quiz-button">Start Quiz</button>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return <div>Select a tab to view content</div>;
    }
  };

  return (
    <div className="course-content-page">
      <div className="course-header">
        <h1>{courseData.title}</h1>
        <p className="course-description">{courseData.description}</p>
      </div>
      
      <div className="content-tabs">
        <button 
          className={`tab-button ${activeTab === "learning-materials" ? "active" : ""}`}
          onClick={() => setActiveTab("learning-materials")}
        >
          Learning Materials
        </button>
        <button 
          className={`tab-button ${activeTab === "assignments" ? "active" : ""}`}
          onClick={() => setActiveTab("assignments")}
        >
          Assignments
        </button>
        <button 
          className={`tab-button ${activeTab === "quizzes" ? "active" : ""}`}
          onClick={() => setActiveTab("quizzes")}
        >
          Quizzes
        </button>
      </div>
      
      <div className="tab-content">
        {renderTabContent()}
      </div>
    </div>
  );
}