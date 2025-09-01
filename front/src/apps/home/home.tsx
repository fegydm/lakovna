// File: front/src/apps/home/home.tsx
// Last change: Fixed to use user.role directly from AuthContext

import React, { useState, useEffect } from "react";
import { logger } from "common/utils/logger.util";
import HomeTabs from "./tabs.home";
import { useAuth } from "../../contexts/auth.context";
import { AccessRole } from "common/types/universal/access-role.types";
import "./home.css";

const Home: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  useEffect(() => {
    if (isAuthenticated && user) {
      logger.info(`User accessed workshop`, { 
        userId: user.id, 
        userName: user.name,
        accessRole: user.role,
        selectedCategory: user.selectedCategory
      });
    } else {
      logger.info(`Guest accessed workshop with mock data`);
    }
  }, [isAuthenticated, user]);

  return (
    <div className="home">
      <HomeTabs 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isAuthenticated={isAuthenticated}
        accessRole={user?.role || AccessRole.viewer}
      />
    </div>
  );
};

export default Home;