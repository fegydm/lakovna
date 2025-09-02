// File: front/src/shared/modals/dots.modal.tsx
// Updated: Replaced AppRole with DotCategory and synced with new dot-system config.

import React, { FC } from "react";
import { Modal } from "../base/modal.base";
import type { DotCategory } from "common/types/dot-system.types";
import type { AuthStatus } from "common/types/auth.types";
import { useDotsModal } from "../../hooks/use-dots-modal.hook";
import { useTranslation } from "../../contexts/translation.context";
import "./dots.modal.css";

type DotsArray = string[];

interface SelectionGroupProps {
  title: string;
  options: { id: string; label: string }[];
  selected: string | null;
  onSelect: (id: string, isTopRow: boolean) => void;
  isTopRow: boolean;
  getDotColor: (id: string, isSelected: boolean, isTopRow: boolean) => string;
}

const SelectionGroup: FC<SelectionGroupProps> = ({
  title,
  options,
  selected,
  onSelect,
  isTopRow,
  getDotColor,
}) => (
  <div className="selection-group">
    <h3 className="selection-group__title">{title}</h3>
    <div className="selection-group__options">
      {options.map(({ id, label }) => {
        const isSelected = selected === id;
        return (
          <button
            key={id}
            onClick={() => onSelect(id, isTopRow)}
            className="selection-group__option"
          >
            <div
              className="selection-group__dot"
              style={{ backgroundColor: getDotColor(id, isSelected, isTopRow) }}
            />
            <span
              className={`selection-group__label ${
                isSelected ? "selection-group__label--active" : ""
              }`}
            >
              {label}
            </span>
          </button>
        );
      })}
    </div>
  </div>
);

export interface DotsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectionChange: (
    top: DotCategory | null,
    bottom: AuthStatus | null
  ) => Promise<void>;
  initialTopDots: DotsArray;
  initialBottomDots: DotsArray;
  onCustomizeClick: () => void;
}

export const DotsModal: React.FC<DotsModalProps> = ({
  isOpen,
  onClose,
  onSelectionChange,
  initialTopDots,
  initialBottomDots,
  onCustomizeClick,
}) => {
  const { t } = useTranslation();
  const {
    selectedTop,
    selectedBottom,
    roleOptions,
    statusOptions,
    handleSelection,
    getDotColor,
  } = useDotsModal({
    initialTopDots,
    initialBottomDots,
    onSelectionChange,
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t("common", "dotsModal.title")}
      description={t("common", "dotsModal.description")}
    >
      <div className="dots-modal">
        <SelectionGroup
          title={t("common", "dotsModal.roleTitle")}
          options={roleOptions}
          selected={selectedTop}
          onSelect={handleSelection}
          isTopRow={true}
          getDotColor={getDotColor}
        />
        <SelectionGroup
          title={t("common", "dotsModal.statusTitle")}
          options={statusOptions}
          selected={selectedBottom}
          onSelect={handleSelection}
          isTopRow={false}
          getDotColor={getDotColor}
        />
      </div>

      <div className="dots-modal__footer">
        <hr className="dots-modal__divider" />
        <button onClick={onCustomizeClick} className="dots-modal__customize-btn">
          {t("common", "dotsModal.customizeButton")}
        </button>
      </div>
    </Modal>
  );
};

export default DotsModal;
