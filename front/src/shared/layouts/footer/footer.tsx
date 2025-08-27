// File: front/src/shared/layouts/footer/footer.tsx
// Last change: Adopted new parent/child naming convention.

import React from "react";
import { Link } from "react-router-dom";
import  SocialFooter  from "./social.footer";
import  CopyrightFooter  from "./copyright.footer";
import  MenuFooter  from "./menu.footer";
import './footer.css';

interface FooterProps {
  isAdmin: boolean;
}

const Footer: React.FC<FooterProps> = ({ isAdmin }) => {
  return (
    <div className="footer">
      <div className="footer__social">
        <SocialFooter />
      </div>

      <div className="footer__row">
        <CopyrightFooter />
        <MenuFooter />
      </div>

      {isAdmin && (
        <Link to="/admin" className="footer__admin-button">
          Administrácia
        </Link>
      )}
    </div>
  );
};

export default Footer;
