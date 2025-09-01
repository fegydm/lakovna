// File: sendeliver/front/src/shared/modals/logout.modal.tsx
// Last change: Removed 3rd argument from t() and concatenated count manually.

import React from 'react';
import { Button } from "../base/button.base";
import { Modal } from "../base/modal.base";
import { useTranslation } from "../../contexts/translation.context";
import './logout.modal.css';

const LOGOUT_ICONS = {
  warning: '⚠️',
  tab: '📄',
  all: '🚪',
};

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTabCount: number;
  onLogoutCurrent: () => void;
  onLogoutAll: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({
  isOpen,
  onClose,
  activeTabCount,
  onLogoutCurrent,
  onLogoutAll
}) => {
  const { t } = useTranslation();
  const ns = "modals";

  const isSingleTab = activeTabCount <= 1;

  const renderSingleTabOption = () => (
    <Button
      variant="danger"
      onClick={onLogoutCurrent}
      className="logout-modal__option-single"
    >
      <div className="logout-modal__option-icon">{LOGOUT_ICONS.all}</div>
      <div className="logout-modal__option-title">
        {t(ns, "logout.options.confirm")}
      </div>
    </Button>
  );

  const renderMultiTabOptions = () => (
    <>
      <Button
        variant="ghost"
        onClick={onLogoutCurrent}
        className="logout-modal__option"
      >
        <div className="logout-modal__option-icon">{LOGOUT_ICONS.tab}</div>
        <div className="logout-modal__option-content">
          <div className="logout-modal__option-title">
            {t(ns, "logout.options.currentTab")}
          </div>
          <div className="logout-modal__option-subtitle">
            {t(ns, "logout.options.currentTabSubtitle")}
          </div>
        </div>
      </Button>

      <Button
        variant="ghost"
        onClick={onLogoutAll}
        className="logout-modal__option logout-modal__option--all"
      >
        <div className="logout-modal__option-icon">{LOGOUT_ICONS.all}</div>
        <div className="logout-modal__option-content">
          <div className="logout-modal__option-title">
            {t(ns, "logout.options.allTabs")}
          </div>
          <div className="logout-modal__option-subtitle">
            {t(ns, "logout.options.allTabsSubtitle") + " (" + activeTabCount + ")"}
          </div>
        </div>
      </Button>
    </>
  );

  const modalActions = (
    <Button variant="cancel" onClick={onClose}>
      {t(ns, "logout.actions.cancel")}
    </Button>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t(ns, "logout.title")}
      className="logout-modal"
      actions={modalActions}
    >
      <div className="logout-modal__content">
        <div className="logout-modal__icon">{LOGOUT_ICONS.warning}</div>
        
        {isSingleTab ? (
          <p className="logout-modal__description">
            {t(ns, "logout.description.singleTab")}
          </p>
        ) : (
          <div className="logout-modal__multi-tab-info">
            <p className="logout-modal__tab-count">
              {t(ns, "logout.description.multiTabCount") + " (" + activeTabCount + ")"}
            </p>
            <p className="logout-modal__instruction">
              {t(ns, "logout.description.multiTabInstruction")}
            </p>
          </div>
        )}

        <div className="logout-modal__options">
          {isSingleTab ? renderSingleTabOption() : renderMultiTabOptions()}
        </div>
      </div>
    </Modal>
  );
};

export default LogoutModal;
