// File: front/src/apps/home/vehicles/vehicles.tab.tsx

import React, { useState } from "react";
import type { AccessRole } from "../../../../../common/types/universal/access-role.types";
import "./vehicles.tab.css";

interface VehiclesTabProps {
  isAuthenticated: boolean;
  accessRole: AccessRole;
}

const VehiclesTab: React.FC<VehiclesTabProps> = ({ isAuthenticated, accessRole }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const mockVehicles = isAuthenticated ? [
    {
      registration: "BA123CD",
      brand: "BMW",
      model: "X5",
      customer: "Janko Mrkvička",
      currentStage: "Lakovanie",
      status: "active",
      entryTime: "08:30",
      estimatedCompletion: "14:30"
    },
    {
      registration: "BL456GH", 
      brand: "Audi",
      model: "A4",
      customer: "Petra Novákova",
      currentStage: "Príprava",
      status: "delayed",
      entryTime: "07:15",
      estimatedCompletion: "15:45"
    },
    {
      registration: "KE789JK",
      brand: "Mercedes",
      model: "C-Class", 
      customer: "Milan Kovár",
      currentStage: "Príjem",
      status: "waiting",
      entryTime: "09:45",
      estimatedCompletion: "16:00"
    },
    {
      registration: "ZA012LM",
      brand: "Volkswagen",
      model: "Golf",
      customer: "Anna Kráľová", 
      currentStage: "Dokončenie",
      status: "completed",
      entryTime: "06:30",
      estimatedCompletion: "12:30"
    }
  ] : [
    {
      registration: "DEMO01",
      brand: "BMW",
      model: "X5",
      customer: "Demo zákazník",
      currentStage: "Lakovanie", 
      status: "active",
      entryTime: "08:30",
      estimatedCompletion: "14:30"
    },
    {
      registration: "DEMO02",
      brand: "Audi", 
      model: "A4",
      customer: "Demo zákazník 2",
      currentStage: "Príjem",
      status: "waiting", 
      entryTime: "09:00",
      estimatedCompletion: "15:00"
    }
  ];

  const getStatusBadge = (status: string) => {
    const statusMap = {
      waiting: { class: "waiting", text: "Čakajúce" },
      active: { class: "active", text: "V procese" },
      completed: { class: "completed", text: "Hotové" },
      delayed: { class: "delayed", text: "Oneskorené" }
    };
    return statusMap[status as keyof typeof statusMap] || { class: "waiting", text: "Neznámy" };
  };

  const filteredVehicles = mockVehicles.filter(vehicle => 
    vehicle.registration.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="vehicles-tab">
      <div className="vehicles-header">
        <h2 className="vehicles-title">
          Vozidlá {!isAuthenticated && "(Demo)"}
        </h2>
        <div className="vehicles-actions">
          <input 
            type="text"
            className="search-input"
            placeholder="Hľadať vozidlo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {(isAuthenticated && (accessRole === 'owner' || accessRole === 'manager')) && (
            <button className="add-vehicle-btn">+ Pridať vozidlo</button>
          )}
        </div>
      </div>
      
      <div className="vehicles-table">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Registračné číslo</th>
                <th>Značka & Model</th>
                <th>Zákazník</th>
                <th>Aktuálna stanica</th>
                <th>Stav</th>
                <th>Vstup</th>
                <th>Odhadovaný koniec</th>
                <th>Akcie</th>
              </tr>
            </thead>
            <tbody>
              {filteredVehicles.map((vehicle, index) => {
                const statusInfo = getStatusBadge(vehicle.status);
                return (
                  <tr key={index}>
                    <td className="registration-cell">{vehicle.registration}</td>
                    <td>{vehicle.brand} {vehicle.model}</td>
                    <td>{vehicle.customer}</td>
                    <td>{vehicle.currentStage}</td>
                    <td>
                      <span className={`status-badge ${statusInfo.class}`}>
                        {statusInfo.text}
                      </span>
                    </td>
                    <td>{vehicle.entryTime}</td>
                    <td>{vehicle.estimatedCompletion}</td>
                    <td className="actions-cell">
                      <button className="action-btn" title="Nastavenia">⚙️</button>
                      <button className="action-btn" title="Zobraziť">👁️</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {!isAuthenticated && (
        <div className="demo-notice-bottom">
          <p>💡 Prihlás sa pre správu vozidiel, pridávanie nových záznamov a pokročilé funkcie</p>
        </div>
      )}
    </div>
  );
};

export default VehiclesTab;