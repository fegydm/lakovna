// File: front/src/apps/home/team/team.tab.tsx

import React, { useState } from "react";
import type { AccessRole } from "../../../../../common/types/access-role.types";
import "./team.tab.css";

interface TeamTabProps {
  isAuthenticated: boolean;
  userRole: AccessRole;
}

const TeamTab: React.FC<TeamTabProps> = ({ isAuthenticated, userRole }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  const mockTeamMembers = [
    {
      id: 1,
      name: "Ján Malý",
      email: "jan.maly@lakovna.sk",
      role: "admin",
      authMethods: ["rfid", "password"],
      activeTasks: 2,
      lastActivity: "pred 5 min",
      status: "online",
      avatar: "JM",
      avatarColor: "#3B82F6"
    },
    {
      id: 2,
      name: "Peter Kováč", 
      email: "peter.kovac@lakovna.sk",
      role: "manager",
      authMethods: ["qr"],
      activeTasks: 1,
      lastActivity: "pred 15 min", 
      status: "online",
      avatar: "PK",
      avatarColor: "#10B981"
    },
    {
      id: 3,
      name: "Mária Nová",
      email: "maria.nova@lakovna.sk", 
      role: "worker",
      authMethods: ["rfid"],
      activeTasks: 3,
      lastActivity: "pred 2 hodiny",
      status: "offline", 
      avatar: "MN",
      avatarColor: "#F59E0B"
    },
    {
      id: 4,
      name: "Tomáš Starý",
      email: "tomas.stary@external.com",
      role: "viewer", 
      authMethods: ["password"],
      activeTasks: 0,
      lastActivity: "včera",
      status: "offline",
      avatar: "TS", 
      avatarColor: "#64748B"
    }
  ];

  const roleLabels = {
    superadmin: "Superadmin",
    admin: "Admin", 
    org_admin: "Org Admin",
    manager: "Manager",
    worker: "Worker",
    viewer: "Viewer"
  };

  const authMethodIcons = {
    rfid: "🏷️",
    qr: "📱", 
    usb: "💾",
    password: "🔑"
  };

  const canManageTeam = userRole === 'admin' || userRole === 'superadmin' || userRole === 'org_admin';

  const getRoleBadgeClass = (role: string) => {
    const roleClasses = {
      admin: "role-admin",
      org_admin: "role-org-admin", 
      manager: "role-manager",
      worker: "role-worker",
      viewer: "role-viewer"
    };
    return roleClasses[role as keyof typeof roleClasses] || "role-viewer";
  };

  const getStatusBadge = (status: string) => {
    return status === "online" 
      ? { class: "status-online", text: "Online" }
      : { class: "status-offline", text: "Offline" };
  };

  const filteredMembers = mockTeamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || member.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="team-tab">
      <div className="team-header">
        <h2 className="team-title">Tím & Pracovníci</h2>
        <div className="team-actions">
          <input
            type="text"
            className="search-input"
            placeholder="Hľadať člena tímu..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select 
            className="filter-select"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <option value="all">Všetky roly</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="worker">Worker</option> 
            <option value="viewer">Viewer</option>
          </select>
          {canManageTeam && (
            <div className="team-buttons">
              <button className="invite-btn">📧 Pozvať</button>
              <button className="add-worker-btn">+ Pridať pracovníka</button>
            </div>
          )}
        </div>
      </div>
      
      <div className="team-content">
        <div className="team-table">
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Meno</th>
                  <th>Email</th>
                  <th>Rola</th>
                  <th>Auth metóda</th>
                  <th>Aktívne úlohy</th>
                  <th>Posledná aktivita</th>
                  <th>Stav</th>
                  <th>Akcie</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((member) => {
                  const statusInfo = getStatusBadge(member.status);
                  return (
                    <tr key={member.id}>
                      <td>
                        <div className="member-info">
                          <div 
                            className="member-avatar"
                            style={{ backgroundColor: member.avatarColor }}
                          >
                            {member.avatar}
                          </div>
                          <span className="member-name">{member.name}</span>
                        </div>
                      </td>
                      <td className="email-cell">{member.email}</td>
                      <td>
                        <span className={`role-badge ${getRoleBadgeClass(member.role)}`}>
                          {roleLabels[member.role as keyof typeof roleLabels]}
                        </span>
                      </td>
                      <td className="auth-methods-cell">
                        {member.authMethods.map((method, index) => (
                          <React.Fragment key={index}>
                            {index > 0 && <span> + </span>}
                            <span className="auth-method">
                              {authMethodIcons[method as keyof typeof authMethodIcons]} {method.toUpperCase()}
                            </span>
                          </React.Fragment>
                        ))}
                      </td>
                      <td className="tasks-count">
                        <span className={member.activeTasks > 0 ? "has-tasks" : "no-tasks"}>
                          {member.activeTasks}
                        </span>
                      </td>
                      <td className="activity-cell">{member.lastActivity}</td>
                      <td>
                        <span className={`status-badge ${statusInfo.class}`}>
                          {statusInfo.text}
                        </span>
                      </td>
                      <td className="actions-cell">
                        {canManageTeam && (
                          <>
                            <button className="action-btn" title="Nastavenia">⚙️</button>
                            <button className="action-btn" title="Zobraziť profil">👁️</button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {filteredMembers.length === 0 && (
          <div className="no-results">
            <p>Žiadni členovia tímu nenájdení podľa zadaných kritérií.</p>
          </div>
        )}
      </div>

      {!canManageTeam && (
        <div className="permission-notice">
          <p>⚠️ Nemáš oprávnenie na správu tímu. Môžeš iba prezerať zoznam členov.</p>
        </div>
      )}

      <div className="team-stats">
        <div className="stats-summary">
          <div className="stat-item">
            <span className="stat-number">{filteredMembers.filter(m => m.status === 'online').length}</span>
            <span className="stat-label">Online</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{filteredMembers.filter(m => m.activeTasks > 0).length}</span>
            <span className="stat-label">Aktívni</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{filteredMembers.reduce((sum, m) => sum + m.activeTasks, 0)}</span>
            <span className="stat-label">Celkové úlohy</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamTab;