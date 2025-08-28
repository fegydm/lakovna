// File: front/src/apps/portal/404/404.page.tsx
// Last change: Replaced hardcoded text and fixed import paths.

import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import lottie from "lottie-web/build/player/lottie_light";
import { useTranslation } from "../../../libs/contexts/translation.context";
import { Button } from "../../../shared/base/button.base";
import './404.page.css';

const Page404: React.FC = () => {
  const container = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (container.current) {
      const anim = lottie.loadAnimation({
        container: container.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        path: "/animations/notfound.json",
      });
      return () => anim.destroy();
    }
    return undefined;
  }, []);

  return (
    <div className="page-404">
      <div ref={container} className="page-404__animation" />

      <p className="page-404__message">
        {t("common", "404.message")}
      </p>

      <Button as={Link} to="/" variant="primary">
        {t("common", "actions.goToHome")}
      </Button>
    </div>
  );
};

export default Page404;
