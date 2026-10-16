import { useState, useEffect } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";

function App() {
  const [view, setView] = useState("dashboard");
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });

  const handleLoginSuccess = () => {
    localStorage.setItem("isLoggedIn", "true");
    setIsLoggedIn(true);
    setView("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
    setView("dashboard");
  };

  return (
    <div>
      {view === "login" && (
        <Login
          onLoginSuccess={handleLoginSuccess}
          onGoToRegister={() => setView("register")}
          onGoToDashboard={() => setView("dashboard")}
        />
      )}

      {view === "register" && (
        <Register 
          onGoToLogin={() => setView("login")} 
          onGoToDashboard={() => setView("dashboard")}
        />
      )}

      {view === "dashboard" && (
        <Dashboard 
          isLoggedIn={isLoggedIn}
          onLogout={handleLogout} 
          onGoToLogin={() => setView("login")}
          onGoToRegister={() => setView("register")}
        />
      )}
    </div>
  );
}

export default App;
