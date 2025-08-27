// File: front/src/shared/elements/floating-button.element.tsx
// Last change: Replaced hardcoded text and fixed import paths.

import React, { useEffect, useMemo, useRef, useState } from "react";
import { FaArrowUp } from "react-icons/fa";
import { useTranslation } from "../../libs/contexts/translation.context";
import { Button } from "../base/button.base";
import "./floating-button.element.css";

interface FloatingButtonProps {
  /** Distance in px from top after which the button becomes visible */
  offset?: number;
  /** Optional extra class to compose with the BEM block */
  className?: string;
}

const FloatingButton: React.FC<FloatingButtonProps> = ({ offset = 200, className }) => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const tickingRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const onScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;
      requestAnimationFrame(() => {
        tickingRef.current = false;
        const y = window.scrollY || window.pageYOffset || 0;
        setIsVisible(y > offset);
      });
    };

    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [offset]);

  const blockClass = useMemo(() => {
    const base = "floating-button";
    const mods = [isVisible ? `${base}--visible` : ""].filter(Boolean);
    return [base, ...mods, className].filter(Boolean).join(" ");
  }, [isVisible, className]);

  const handleClick = () => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" });
  };

  const buttonLabel = t("common", "actions.scrollToTop");

  return (
    <div className={blockClass} data-testid="floating-button">
      <Button
        variant="floating"
        onClick={handleClick}
        aria-label={buttonLabel}
        title={buttonLabel}
      >
        <FaArrowUp size={24} />
      </Button>
    </div>
  );
};

export default FloatingButton;
