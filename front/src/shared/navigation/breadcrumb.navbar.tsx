// File: front/src/shared/navigation/breadcrumb.navbar.tsx
// Last change: Prispôsobený názov komponentu, export a CSS triedy.

import { FC } from "react";
import { Link, useLocation } from "react-router-dom";
import "./breadcrumb.navbar.css";

interface BreadcrumbSegment {
  label: string;
  path: string;
}

export const BreadcrumbNavbar: FC = () => {
  const location = useLocation();

  const getPathSegments = (): BreadcrumbSegment[] => {
    const segments = location.pathname.split("/").filter(Boolean);
    return segments.map((segment, index) => ({
      path: `/${segments.slice(0, index + 1).join("/")}`,
      label: segment.charAt(0).toUpperCase() + segment.slice(1),
    }));
  };

  const segments = getPathSegments();

  return (
    <nav className="breadcrumb-navbar" aria-label="Breadcrumb">
      <ol className="breadcrumb-navbar__list">
        <li className="breadcrumb-navbar__item">
          <span className="breadcrumb-navbar__start-icon">↳</span>
          <Link to="/" className="breadcrumb-navbar__link">Home</Link>
        </li>
        {segments.map((segment, index) => (
          <li key={segment.path} className="breadcrumb-navbar__item">
            <span className="breadcrumb-navbar__separator">/</span>
            {index === segments.length - 1 ? (
              <span className="breadcrumb-navbar__current-page" aria-current="page">{segment.label}</span>
            ) : (
              <Link to={segment.path} className="breadcrumb-navbar__link">{segment.label}</Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};