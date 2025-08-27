// File: front/src/shared/layouts/footer/social.footer.tsx
// Last change: Refactored to the new naming convention.

import React from "react";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";
import './social.footer.css';

const SOCIAL_LINKS = [
  { icon: FaFacebook, href: "https://facebook.com", label: "Facebook" },
  { icon: FaTwitter, href: "https://twitter.com", label: "Twitter" },
  { icon: FaLinkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: FaInstagram, href: "https://instagram.com", label: "Instagram" },
] as const;

const SocialFooter: React.FC = () => {
  return (
    <div className="social-footer">
      {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="social-footer__link"
          aria-label={label}
        >
          <Icon className="social-footer__icon" />
        </a>
      ))}
    </div>
  );
};

export default SocialFooter;
