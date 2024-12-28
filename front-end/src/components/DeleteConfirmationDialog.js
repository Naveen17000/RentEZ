import React from 'react';
import '../styles/DeleteConfirmationDialog.css'; // You can style the modal in this file

function DeleteConfirmationDialog({ isOpen, onCancel, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Are you sure you want to delete this product?</h3>
        <div className="modal-actions">
          <button onClick={onCancel} className="cancel-btn">Cancel</button>
          <button onClick={onConfirm} className="confirm-btn">Confirm</button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmationDialog;
