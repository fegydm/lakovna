// File: front/src/apps/home/dashboard/dashboard.tab.tsx
// Last change: Changed userRole to accessRole

import React from "react";
import type { AccessRole } from "common/types/universal/access-role.types";
import "./dashboard.tab.css";

interface DashboardTabProps {
  isAuthenticated: boolean;
  accessRole: AccessRole;
}

const DashboardTab: React.FC<DashboardTabProps> = ({ isAuthenticated, accessRole }) => {
  const mockMetrics = {
    vehiclesInProcess: isAuthenticated ? 23 : 8,
    averageProcessingTime: isAuthenticated ? "4.2h" : "3.1h", 
    capacityUtilization: isAuthenticated ? 89 : 67,
    delayedVehicles: isAuthenticated ? 3 : 1
  };

  const mockAlerts = isAuthenticated ? [
    { type: "danger", icon: "⚠️", title: "Oneskorenie v lakovaní", description: "BMW X5 (BA123CD) je o 2 hodiny za plánom", time: "pred 15 min" },
    { type: "warning", icon: "🔧", title: "Požaduje pozornosť", description: "Audi A4 na stanici prípravy čaká na kontrolu kvality", time: "pred 32 min" },
    { type: "info", icon: "📋", title: "Nové vozidlo", description: "Mercedes C-Class (BL987FG) zaregistrované do systému", time: "pred 1 hodinou" }
  ] : [
    { type: "info", icon: "📋", title: "Demo režim", description: "Prihlás sa pre reálne dáta a kompletné funkcie", time: "teraz" },
    { type: "warning", icon: "🔧", title: "Mock vozidlo", description: "VW Golf čaká na diagnostiku", time: "pred 45 min" }
  ];

  return (
    <div className="dashboard-tab">
      <div className="dashboard-grid">
        <div className="dashboard-main">
          <div className="metric-cards">
            <div className="metric-card">
              <div className="metric-value">{mockMetrics.vehiclesInProcess}</div>
              <div className="metric-label">Vozidlá v procese</div>
              <div className="metric-change positive">+12% tento týždeň</div>
            </div>
            <div className="metric-card">
              <div className="metric-value">{mockMetrics.averageProcessingTime}</div>
              <div className="metric-label">Priemerný čas spracovania</div>
              <div className="metric-change negative">+8% oproti minulému týždňu</div>
            </div>
            <div className="metric-card">
              <div className="metric-value">{mockMetrics.capacityUtilization}%</div>
              <div className="metric-label">Využitie kapacity</div>
              <div className="metric-change positive">+3% tento mesiac</div>
            </div>
            <div className="metric-card">
              <div className="metric-value">{mockMetrics.delayedVehicles}</div>
              <div className="metric-label">Oneskorené vozidlá</div>
              <div className="metric-change negative">+2 od včera</div>
            </div>
          </div>

          <div className="chart-card">
            <div className="chart-header">Využitie staníc za posledných 7 dní</div>
            <div className="chart-placeholder">
              📊 {isAuthenticated ? 'Chart s reálnymi dátami' : 'Demo chart - prihlás sa pre reálne dáta'}
            </div>
          </div>
        </div>

        <div className="dashboard-sidebar">
          <div className="alerts-panel">
            <div className="alerts-header">
              {isAuthenticated ? 'Urgentné upozornenia' : 'Demo upozornenia'}
            </div>
            {mockAlerts.map((alert, index) => (
              <div key={index} className="alert-item">
                <div className={`alert-icon ${alert.type}`}>{alert.icon}</div>
                <div className="alert-content">
                  <div className="alert-title">{alert.title}</div>
                  <div className="alert-description">{alert.description}</div>
                  <div className="alert-time">{alert.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardTab;