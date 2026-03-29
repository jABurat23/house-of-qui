import { useEffect, useState } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { api } from "../api/client";
import { socket } from "../api/socket";
import CourtLayout from "../layouts/CourtLayout";
import Throne from "./Throne";
import WarCouncil from "./WarCouncil";
import Archives from "./Archives";
import Treasury from "./Treasury";
import Forge from "./Forge";
import Settings from "./Settings";
import CommandCenter from "./CommandCenter";
import type { Project, AuditLog, ImperialSession } from "../types";

interface DashboardProps {
  onLogout: () => void;
}

export default function Dashboard({ onLogout }: DashboardProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const navigate = useNavigate();
  
  const session = JSON.parse(
    localStorage.getItem("imperial_session") || "{}"
  ) as ImperialSession;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/monarch/projects");
        setProjects(res.data);
      } catch (err) {
        console.error("The Throne failed to communicate with the registry.", err);
      }
    };
    
    const fetchLogs = async () => {
      try {
        const res = await api.get("/system/audit/recent");
        setLogs(res.data);
      } catch (err) {
        console.error("The Archives are silent.", err);
      }
    };

    fetchData();
    fetchLogs();

    // Sacred WebSocket Binding
    socket.on("audit:broadcast", (data) => {
      setLogs(prev => [data, ...prev].slice(0, 50));
    });

    socket.on("telemetry:identity", () => {
      fetchData();
    });

    return () => {
      socket.off("audit:broadcast");
      socket.off("telemetry:identity");
    };
  }, []);

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  return (
    <CourtLayout 
      onLogout={handleLogout} 
      session={session}
      logs={logs}
    >
      <div className="h-full">
         <Routes>
           <Route path="/overview" element={<Throne projects={projects} logs={logs} />} />
           <Route path="/command" element={<CommandCenter />} />
           <Route path="/security" element={<WarCouncil logs={logs} />} />
           <Route path="/archives" element={<Archives logs={logs} />} />
           <Route path="/treasury" element={<Treasury />} />
           <Route path="/forge" element={<Forge projects={projects} />} />
           <Route path="/settings" element={<Settings />} />
           <Route path="/" element={<Navigate to="/overview" replace />} />
         </Routes>
      </div>
    </CourtLayout>
  );
}