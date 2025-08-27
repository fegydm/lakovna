// File: front/src/shared/layouts/footer/menu.footer.tsx
// Last change: Refactored to new naming convention and used Link component.

import React from "react";
import { Link } from "react-router-dom";
import './menu.footer.css';

const MenuFooter: React.FC = () => {
    return (
        <div className="menu-footer">
            <Link to="/about" className="menu-footer__item">About</Link>
            <Link to="/documentation" className="menu-footer__item">Documentation</Link>
            <Link to="/contact" className="menu-footer__item">Contact</Link>
            <Link to="/privacy" className="menu-footer__item">Privacy</Link>
        </div>
    );
};

export default MenuFooter;
