import React from 'react';
import Modal from './Modal';
import Button from './Button';
import './ConfirmationDialog.css';

const ConfirmationDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Подтверждение', 
  message = 'Вы уверены, что хотите выполнить это действие?',
  confirmText = 'Подтвердить',
  cancelText = 'Отмена',
  confirmVariant = 'danger'
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="small"
      actions={[
        <Button key="cancel" variant="secondary" onClick={onClose}>
          {cancelText}
        </Button>,
        <Button key="confirm" variant={confirmVariant} onClick={handleConfirm}>
          {confirmText}
        </Button>
      ]}
    >
      <p className="confirmation-dialog__message">{message}</p>
    </Modal>
  );
};

export default ConfirmationDialog;