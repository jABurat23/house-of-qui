import Dashboard from "./pages/Dashboard"
import ImperialGate from "./pages/ImperialGate"
import { useState, useEffect } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("imperial_session");
    if (saved) {
      try {
        setSession(JSON.parse(saved));
      } catch (e) {
        localStorage.removeItem("imperial_session");
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (data: any) => {
    setSession(data);
    localStorage.setItem("imperial_session", JSON.stringify(data));
  };

  const handleLogout = () => {
    setSession(null);
    localStorage.removeItem("imperial_session");
  };

  if (loading) return null;

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/login" 
          element={!session ? <ImperialGate onSuccess={handleLogin} /> : <Navigate to="/" replace />} 
        />
        <Route 
          path="/*" 
          element={session ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/login" replace />} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App