// File: front/src/apps/home/tabs.home.tsx
// Last change: Changed userRole to accessRole

import React from "react";
import DashboardTab from "./dashboard/dashboard.tab";
import SchemaTab from "./schema/schema.tab";
import VehiclesTab from "./vehicles/vehicles.tab";
import StagesTab from "./stages/stages.tab";
import TeamTab from "./team/team.tab";
import SettingsTab from "./settings/settings.tab";
import type { AccessRole } from "../../../../common/types/universal/access-role.types";

interface HomeTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAuthenticated: boolean;
  accessRole: AccessRole;
}

const HomeTabs: React.FC<HomeTabsProps> = ({ 
  activeTab, 
  setActiveTab, 
  isAuthenticated, 
  accessRole 
}) => {
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: "📊", component: DashboardTab },
    { id: "schema", label: "Schema", icon: "🏭", component: SchemaTab },
    { id: "vehicles", label: "Vehicles", icon: "🚗", component: VehiclesTab },
    { id: "stages", label: "Stages", icon: "⚙️", component: StagesTab, requiresAuth: true },
    { id: "team", label: "Team", icon: "👥", component: TeamTab, requiresAuth: true },
    { id: "settings", label: "Settings", icon: "🔧", component: SettingsTab, requiresAuth: true }
  ];

  const availableTabs = tabs.filter(tab => 
    !tab.requiresAuth || isAuthenticated
  );

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || DashboardTab;

  return (
    <div className="home-tabs">
      <div className="home-tabs__navigation">
        {availableTabs.map((tab) => (
          <button
            key={tab.id}
            className={`home-tabs__tab ${activeTab === tab.id ? 'home-tabs__tab--active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="home-tabs__tab-icon">{tab.icon}</span>
            <span className="home-tabs__tab-label">{tab.label}</span>
            <div className="home-tabs__tab-underline"></div>
          </button>
        ))}
      </div>

      <div className="home-tabs__content">
        <ActiveComponent 
          isAuthenticated={isAuthenticated}
          accessRole={accessRole}
        />
      </div>
    </div>
  );
};

export default HomeTabs;