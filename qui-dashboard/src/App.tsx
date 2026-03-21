import Dashboard from "./pages/Dashboard"
import ImperialGate from "./pages/ImperialGate"
import { useState, useEffect } from "react"

function App() {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem("imperial_session");
    if (saved) {
      try {
        setSession(JSON.parse(saved));
      } catch (e) {
        localStorage.removeItem("imperial_session");
      }
    }
  }, []);

  const handleLogin = (data: any) => {
    setSession(data);
    localStorage.setItem("imperial_session", JSON.stringify(data));
  };

  const handleLogout = () => {
    setSession(null);
    localStorage.removeItem("imperial_session");
  };

  if (!session) {
    return <ImperialGate onSuccess={handleLogin} />;
  }

  return (
    <Dashboard onLogout={handleLogout} />
  );
}

export default App