// File: front/src/apps/home/stages/stages.tab.tsx

import React, { useState } from "react";
import type { AccessRole } from "../../../../../common/types/access-role.types";
import "./stages.tab.css";

interface StagesTabProps {
  isAuthenticated: boolean;
  userRole: AccessRole;
}

const StagesTab: React.FC<StagesTabProps> = ({ isAuthenticated, userRole }) => {
  const [selectedTemplate, setSelectedTemplate] = useState("paint_shop");

  const stageTemplates = [
    { id: "paint_shop", name: "🎨 Paint Shop", description: "Kompletný lakovací workflow" },
    { id: "service", name: "🔧 Auto Service", description: "Servisný workflow" },
    { id: "manufacturing", name: "🏭 Manufacturing", description: "Výrobný workflow" },
    { id: "custom", name: "⚙️ Custom", description: "Vlastný workflow" }
  ];

  const mockStages = [
    {
      id: 1,
      name: "Príjem", 
      icon: "📋",
      color: "#3B82F6",
      tasks: [
        { id: 1, title: "Kontrola stavu vozidla", completed: true },
        { id: 2, title: "Fotodokumentácia poškodení", completed: true },
        { id: 3, title: "Zápis do systému", completed: true },
        { id: 4, title: "Odhad nákladov", completed: true },
        { id: 5, title: "Schválenie opravy", completed: true },
        { id: 6, title: "Plánovanie pracovných krokov", completed: true },
        { id: 7, title: "Objednanie dielov", completed: false },
        { id: 8, title: "Príprava pracoviska", completed: false }
      ],
      statistics: { avgTime: "1.2h", efficiency: "95%" }
    },
    {
      id: 2,
      name: "Umývanie",
      icon: "🚿", 
      color: "#06B6D4",
      tasks: [
        { id: 1, title: "Predumývanie exteriéru", completed: true },
        { id: 2, title: "Odmasťovanie povrchu", completed: true },
        { id: 3, title: "Detailné čistenie", completed: true },
        { id: 4, title: "Sušenie", completed: false },
        { id: 5, title: "Kontrola čistoty", completed: false },
        { id: 6, title: "Príprava na ďalší krok", completed: false }
      ],
      statistics: { avgTime: "0.8h", efficiency: "88%" }
    },
    {
      id: 3,
      name: "Príprava",
      icon: "🔧",
      color: "#8B5CF6", 
      tasks: [
        { id: 1, title: "Brúsenie poškodených miest", completed: true },
        { id: 2, title: "Aplikácia tmelu", completed: true },
        { id: 3, title: "Vyrovnávanie povrchu", completed: false },
        { id: 4, title: "Primer aplikácia", completed: false },
        { id: 5, title: "Brúsenie primer-u", completed: false },
        { id: 6, title: "Čistenie prachu", completed: false },
        { id: 7, title: "Maskované nelakovanie", completed: false },
        { id: 8, title: "Kontrola pripravenosti", completed: false }
      ],
      statistics: { avgTime: "3.1h", efficiency: "78%" }
    },
    {
      id: 4,
      name: "Lakovanie",
      icon: "🎨",
      color: "#F59E0B",
      tasks: [
        { id: 1, title: "Príprava lakovanej kabíny", completed: true },
        { id: 2, title: "Basecoat aplikácia", completed: true },
        { id: 3, title: "Sušenie basecoat", completed: true },
        { id: 4, title: "Clearcoat aplikácia", completed: true },
        { id: 5, title: "Sušenie clearcoat", completed: false },
        { id: 6, title: "Kontrola kvality laku", completed: false },
        { id: 7, title: "Leštenie", completed: false },
        { id: 8, title: "Finálna kontrola", completed: false }
      ],
      statistics: { avgTime: "4.5h", efficiency: "85%" }
    },
    {
      id: 5,
      name: "Dokončenie",
      icon: "✅",
      color: "#10B981",
      tasks: [
        { id: 1, title: "Odstránenie maskovania", completed: false },
        { id: 2, title: "Kompletácia vozidla", completed: false },
        { id: 3, title: "Kontrola funkčnosti", completed: false },
        { id: 4, title: "Finálne čistenie", completed: false },
        { id: 5, title: "Kvalitná kontrola", completed: false },
        { id: 6, title: "Dokumentácia dokončenia", completed: false },
        { id: 7, title: "Príprava na odovzdanie", completed: false },
        { id: 8, title: "Kontaktovanie zákazníka", completed: false }
      ],
      statistics: { avgTime: "1.8h", efficiency: "92%" }
    }
  ];

  const canManage = userRole === 'admin' || userRole === 'superadmin' || userRole === 'org_admin';

  return (
    <div className="stages-tab">
      <div className="stages-header">
        <h2 className="stages-title">Konfigurácia staníc</h2>
        <div className="stages-actions">
          <select 
            className="template-select"
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value)}
            disabled={!canManage}
          >
            {stageTemplates.map(template => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </select>
          {canManage && (
            <button className="add-stage-btn">+ Pridať stanicu</button>
          )}
        </div>
      </div>

      <div className="stages-content">
        <div className="stages-main">
          <div className="workflow-card">
            <div className="workflow-header">
              <h3>Nastavenie workflow staníc</h3>
              <span className="workflow-subtitle">
                ({mockStages.length} staníc × 8 úloh max)
              </span>
            </div>
            
            <div className="stages-list">
              {mockStages.map((stage) => {
                const completedTasks = stage.tasks.filter(task => task.completed).length;
                const totalTasks = stage.tasks.length;
                
                return (
                  <div key={stage.id} className="stage-config-item">
                    <div className="stage-config-header">
                      <div 
                        className="stage-preview"
                        style={{ borderColor: stage.color }}
                      >
                        <div className="stage-number">{stage.id}</div>
                        <div className="stage-icon">{stage.icon}</div>
                        <div className="stage-name">{stage.name}</div>
                      </div>
                      
                      <div className="stage-details">
                        <div className="stage-info">
                          <div className="tasks-count">
                            <strong>{totalTasks} úloh definovaných</strong>
                            <span className="tasks-progress">
                              ({completedTasks}/{totalTasks} dokončených)
                            </span>
                          </div>
                          <div className="stage-tasks-preview">
                            {stage.tasks.slice(0, 3).map(task => task.title).join(", ")}
                            {stage.tasks.length > 3 && "..."}
                          </div>
                        </div>
                        
                        <div className="stage-stats">
                          <div className="stat-item">
                            <span className="stat-label">Avg. čas:</span>
                            <span className="stat-value">{stage.statistics.avgTime}</span>
                          </div>
                          <div className="stat-item">
                            <span className="stat-label">Efektivita:</span>
                            <span className="stat-value">{stage.statistics.efficiency}</span>
                          </div>
                        </div>
                      </div>
                      
                      {canManage && (
                        <button className="stage-config-btn" title="Konfigurovať stanicu">⚙️</button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        <div className="stages-sidebar">
          <div className="stats-panel">
            <div className="panel-header">Štatistiky staníc</div>
            <div className="stats-content">
              <div className="stat-row">
                <span>Aktívne stanice:</span>
                <strong>5/5</strong>
              </div>
              <div className="stat-row">
                <span>Priemerný čas na stanicu:</span>
                <strong>2.4h</strong>
              </div>
              <div className="stat-row">
                <span>Najpomalšia stanica:</span>
                <strong>Lakovanie</strong>
              </div>
              <div className="stat-row">
                <span>Najrýchlejšia stanica:</span>
                <strong>Príjem</strong>
              </div>
            </div>
          </div>
          
          <div className="templates-panel">
            <div className="panel-header">Workflow Templates</div>
            <div className="templates-content">
              {stageTemplates.map(template => (
                <div key={template.id} className="template-item">
                  <div className="template-info">
                    <div className="template-name">{template.name}</div>
                    <div className="template-description">{template.description}</div>
                  </div>
                  {canManage && (
                    <button 
                      className="template-apply-btn"
                      onClick={() => setSelectedTemplate(template.id)}
                    >
                      Aplikovať
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {!canManage && (
        <div className="permission-notice">
          <p>⚠️ Nemáš oprávnenie na úpravu konfigurácie staníc. Kontaktuj administrátora.</p>
        </div>
      )}
    </div>
  );
};

export default StagesTab;