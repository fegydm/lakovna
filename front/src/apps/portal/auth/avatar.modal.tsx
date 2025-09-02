// File: front/src/apps/portal/auth/avatar.modal.tsx
// Last change: Replaced hardcoded text with translation keys and fixed import paths.

import { useState, useEffect } from 'react';
import { useAuthOptional } from '../../../contexts/auth.optional';
import { useTranslation } from '../../../contexts/translation.context';
import { Button } from "../../../shared/base/button.base";
import { Modal } from "../../../shared/base/modal.base";
import './avatar.modal.css';

interface AvatarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  onSave: (avatarId: string) => void;
  isGuestMode?: boolean;
  cookiesAllowed?: boolean;
  initialAvatar?: string | null;
}

type AvatarGroup = 'photos' | 'zodiac' | 'fantasy';

const AVATAR_DATA = {
  photos: Array.from({ length: 5 }, (_, i) => ({ id: `photo-${i + 1}`, label: `Photo ${i + 1}` })),
  zodiac: ["aries", "taurus", "gemini", "cancer", "leo", "virgo", "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces"].map(s => ({ id: s, label: s.charAt(0).toUpperCase() + s.slice(1) })),
  fantasy: ["Warrior", "Mage", "Archer", "Rogue", "Knight", "Wizard", "Paladin", "Monk"].map(c => ({ id: c.toLowerCase(), label: c })),
};

export const AvatarModal: React.FC<AvatarModalProps> = ({ isOpen, onClose, onLogout, onSave, isGuestMode = false, initialAvatar = null }) => {
  const auth = useAuthOptional();
  const { t } = useTranslation();
  const [activeGroup, setActiveGroup] = useState<AvatarGroup>('zodiac');
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);

  const activeUser = auth?.user;
  
  useEffect(() => {
    if (isOpen) {
      let initialId = null;
      if (initialAvatar) {
        if (initialAvatar.includes('/')) {
          const parts = initialAvatar.split('/');
          initialId = parts[parts.length - 1].replace('.png', '');
        } else {
          initialId = initialAvatar;
        }
      }
      setSelectedAvatar(initialId);
    }
  }, [isOpen, initialAvatar]);

  const handleSave = () => {
    if (!selectedAvatar) {
      console.warn("Please select an avatar first.");
      return;
    }
    onSave(selectedAvatar);
  };

  const handleLogoutClick = () => {
    onLogout();
  };

  const modalTitle = isGuestMode 
    ? t("common", "avatarModal.guestTitle") 
    : `${t("common", "avatarModal.userTitlePrefix")}: ${activeUser?.name || t("common", "terms.user")}`;
    
  const modalDescription = isGuestMode 
    ? t("common", "avatarModal.guestDescription") 
    : t("common", "avatarModal.userDescription");

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={modalTitle}
      description={modalDescription}
    >
      <div className="avatar-modal">
        <div className="avatar-modal__tabs">
          {Object.keys(AVATAR_DATA).map(group => (
            <button
              key={group}
              className={`avatar-modal__tab ${activeGroup === group ? 'avatar-modal__tab--active' : ''}`}
              onClick={() => setActiveGroup(group as AvatarGroup)}
            >
              {t("common", `avatarModal.tabs.${group}`)}
            </button>
          ))}
        </div>

        <div className="avatar-modal__grid">
          {AVATAR_DATA[activeGroup].map(avatar => (
            <button
              key={avatar.id}
              className={`avatar-modal__item ${selectedAvatar === avatar.id ? 'avatar-modal__item--selected' : ''}`}
              onClick={() => setSelectedAvatar(avatar.id)}
              title={avatar.label}
            >
              <img 
                src={`/avatars/${activeGroup}/${avatar.id}.png`} 
                alt={avatar.label}
                className="avatar-modal__item-image"
              />
            </button>
          ))}
        </div>

        <div className="avatar-modal__actions">
          {isGuestMode ? (
             <div /> 
          ) : (
            <Button variant="danger" onClick={handleLogoutClick}>{t("common", "actions.logout")}</Button>
          )}
          <div className="avatar-modal__actions-group--right">
            <Button variant="cancel" onClick={onClose}>{t("common", "actions.cancel")}</Button>
            <Button variant="primary" onClick={handleSave}>{t("common", "actions.saveChanges")}</Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AvatarModal;
