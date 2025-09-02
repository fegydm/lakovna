// File: front/src/shared/modals/confirm-logout.modal.tsx
// Last change: Updated import paths to use aliases.

import React from 'react';
import { Button } from "../base/button.base";
import { Modal } from "../base/modal.base";
import './confirm-logout.modal.css';

interface ConfirmLogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ConfirmLogoutModal: React.FC<ConfirmLogoutModalProps> = ({ isOpen, onClose, onConfirm }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Potvrdenie odhlásenia"
      description="Naozaj sa chcete odhlásiť z vášho účtu?"
    >
      <div className="confirm-logout-modal__actions">
        <Button variant="cancel" onClick={onClose}>
          Zrušiť
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Áno, odhlásiť
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmLogoutModal;
