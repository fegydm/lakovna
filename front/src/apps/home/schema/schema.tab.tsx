// File: front/src/apps/home/schema/schema.tab.tsx

import React, { useState } from "react";
import type { AccessRole } from "../../../../../common/types/access-role.types";
import "./schema.tab.css";

interface SchemaTabProps {
  isAuthenticated: boolean;
  userRole: AccessRole;
}

const SchemaTab: React.FC<SchemaTabProps> = ({ isAuthenticated, userRole }) => {
  const [activeView, setActiveView] = useState("overlay");
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);

  const viewOptions = [
    { id: "overlay", label: "Overlay S-Shape" },
    { id: "parallel", label: "Parallel" },
    { id: "vertical", label: "Vertical Split" },
    { id: "horizontal", label: "Horizontal Split" },
    { id: "list", label: "List View" },
    { id: "circular", label: "Circular" }
  ];

  const mockStages = [
    { id: 1, name: "Príjem", icon: "📋", progress: "6/8", status: "active" },
    { id: 2, name: "Umývanie", icon: "🚿", progress: "3/8", status: "normal" },
    { id: 3, name: "Príprava", icon: "🔧", progress: "2/8", status: "normal" },
    { id: 4, name: "Lakovanie", icon: "🎨", progress: "4/8", status: "normal" },
    { id: 5, name: "Dokončenie", icon: "✅", progress: "1/8", status: "normal" }
  ];

  const mockVehicles = isAuthenticated ? [
    { id: "BA123CD", brand: "BMW", status: "moving", position: { x: 120, y: 60 } },
    { id: "BL456GH", brand: "Audi", status: "delayed", position: { x: 680, y: 60 } },
    { id: "KE789JK", brand: "Mercedes", status: "waiting", position: { x: 520, y: 220 } },
    { id: "ZA012LM", brand: "VW", status: "moving", position: { x: 620, y: 380 } }
  ] : [
    { id: "DEMO01", brand: "BMW", status: "moving", position: { x: 120, y: 60 } },
    { id: "DEMO02", brand: "Audi", status: "waiting", position: { x: 680, y: 60 } }
  ];

  const handleVehicleClick = (vehicleId: string) => {
    setSelectedVehicle(selectedVehicle === vehicleId ? null : vehicleId);
  };

  return (
    <div className="schema-tab">
      <div className="schema-toolbar">
        <div className="view-selector">
          {viewOptions.map((option) => (
            <button
              key={option.id}
              className={`view-option ${activeView === option.id ? 'active' : ''}`}
              onClick={() => setActiveView(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>
        
        <div className="filter-controls">
          <input type="text" className="filter-input" placeholder="Hľadať vozidlo..." />
          <select className="filter-input">
            <option>Všetky stavy</option>
            <option>V procese</option>
            <option>Čakajúce</option>
            <option>Dokončené</option>
          </select>
        </div>
      </div>
      
      <div className="schema-canvas">
        <div className="stage-line">
          {mockStages.map((stage) => (
            <div key={stage.id} className={`stage ${stage.status}`}>
              <div className="stage-icon">{stage.icon}</div>
              <div className="stage-name">{stage.name}</div>
              <div className={`stage-progress ${stage.status}`}>{stage.progress}</div>
            </div>
          ))}
        </div>

        <div className="track-line">
          {mockVehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className={`vehicle ${vehicle.status} ${selectedVehicle === vehicle.id ? 'selected' : ''}`}
              style={{
                position: 'absolute',
                left: `${vehicle.position.x}px`,
                top: `${vehicle.position.y}px`
              }}
              onClick={() => handleVehicleClick(vehicle.id)}
            >
              <div className={`vehicle-status ${vehicle.status}`}></div>
              <div className="vehicle-icon">🚗</div>
              <div className="vehicle-reg">{vehicle.id}</div>
            </div>
          ))}
        </div>

        {!isAuthenticated && (
          <div className="demo-overlay">
            <div className="demo-notice">
              <h3>Demo režim</h3>
              <p>Zobrazujú sa iba ukážkové dáta. Prihlás sa pre plnú funkcionalitu.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SchemaTab;