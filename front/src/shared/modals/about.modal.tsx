// File: front/src/shared/modals/about.modal.tsx
// Last change: Updated import paths to match the final architecture.

import React from "react";
import { Button } from "../base/button.base";
import { Modal } from "../base/modal.base";
import "./about.modal.css";

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToRegister: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose, onNavigateToRegister }) => {
  
  const handleCreateAccount = () => {
    onClose(); 
    onNavigateToRegister();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="About SenDeliver"
    >
      <div className="about-modal">
        <section className="about-modal__section">
          <h3 className="about-modal__subtitle">Kto Sme</h3>
          <p className="about-modal__paragraph">
            SenDeliver je váš dôveryhodný partner v logistike. Spájame klientov, 
            špeditérov a dopravcov, aby sme vytvorili plynulý a efektívny dopravný ekosystém.
          </p>
        </section>

        <section className="about-modal__section">
          <h3 className="about-modal__subtitle">Naša Misia</h3>
          <p className="about-modal__paragraph">
            Priniesť revolúciu do logistického odvetvia prostredníctvom inovatívnych, efektívnych a udržateľných riešení, ktoré prinášajú hodnotu všetkým zúčastneným stranám.
          </p>
        </section>

        <div className="about-modal__actions">
          <Button variant="primary" onClick={handleCreateAccount}>
            Vytvoriť Účet
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AboutModal;
