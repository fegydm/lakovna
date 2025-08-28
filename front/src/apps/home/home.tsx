// File: front/src/apps/home/home.tsx
// Last change: Created main workshop interface adapted from Sendeliver hauler

import React, { useState, useEffect } from "react";
import { logger } from "../../libs/utils/logger.util";
import HomeTabs from "./tabs.home";
import { useAuth } from "../../libs/contexts/auth.context";
import "./home.css";

const Home: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  useEffect(() => {
    if (isAuthenticated && user) {
      logger.info(`User accessed workshop`, { 
        userId: user.id, 
        userName: user.name,
        role: user.role 
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
        userRole={user?.role || 'viewer'}
      />
    </div>
  );
};

export default Home;