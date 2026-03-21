import { useEffect, useState } from "react";
import { api } from "../api/client";
import { socket } from "../api/socket";
import CourtLayout from "../layouts/CourtLayout";
import Throne from "./Throne";
import WarCouncil from "./WarCouncil";
import Archives from "./Archives";
import Treasury from "./Treasury";
import Forge from "./Forge";

interface DashboardProps {
  onLogout: () => void;
}

export default function Dashboard({ onLogout }: DashboardProps) {
  const [projects, setProjects] = useState([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const session = JSON.parse(localStorage.getItem("imperial_session") || "{}");

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

  const renderActiveChamber = () => {
    switch (activeTab) {
      case "overview":
        return <Throne projects={projects} />;
      case "security":
        return <WarCouncil logs={logs} />;
      case "archives":
        return <Archives logs={logs} />;
      case "treasury":
        return <Treasury />;
      case "forge":
        return <Forge />;
      default:
        return <Throne projects={projects} />;
    }
  };

  return (
    <CourtLayout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      onLogout={onLogout} 
      session={session}
      logs={logs}
    >
      <div className="h-full">
         {renderActiveChamber()}
      </div>
    </CourtLayout>
  );
}