import React from "react";
import "../styles/DeleteConfirmationModal.css";

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, courseName }) => {
  if (!isOpen) return null;

  return (
    <div className="delete-modal-overlay">
      <div className="delete-modal-content">
        <h2>Confirm Delete</h2>
        <p>Are you sure you want to delete the course <strong>{courseName}</strong>?</p>
        <p>This action cannot be undone.</p>
        
        <div className="delete-modal-actions">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="confirm-delete-btn" onClick={onConfirm}>
            Delete Course
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;