import { useState } from "react";
import bgVideo from "../assets/generate_a_video_of_water_flow.mp4";
import logo from "../assets/logo.png";
import s from "./auth.module.css";

function Login({ onLoginSuccess, onGoToRegister, onGoToDashboard }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    const user = {
      email,
      password,
    };

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(user),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Login failed.");
        return;
      }

      setMessage(data.message);
      onLoginSuccess();
    } catch (error) {
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className={s.authPage}>
      {/* Background video */}
      <video
        className={s.bgVideo}
        src={bgVideo}
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Dark overlay */}
      <div className={s.overlay} />

      {/* Centred content */}
      <div className={s.authContent}>
        {/* Back to dashboard button */}
        <button type="button" className={s.btnBack} onClick={onGoToDashboard}>
          &larr; Back to Dashboard
        </button>

        {/* Brand / Project name */}
        <div className={s.brandBlock}>
          <img src={logo} alt="NeerIQ Logo" className={s.logoImg} />
          <p className={s.brandTagline}>AI-Powered Water Management</p>
        </div>

        {/* Glass card */}
        <div className={s.card}>
          <h2 className={s.cardTitle}>Welcome back</h2>

          <form onSubmit={handleLogin}>
            <div className={s.formGroup}>
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className={s.formGroup}>
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            {message && <p className={s.msgError}>{message}</p>}

            <button type="submit" className={s.btnPrimary}>
              Log In
            </button>
          </form>

          <div className={s.cardFooter}>
            Don&apos;t have an account?{" "}
            <button type="button" className={s.btnLink} onClick={onGoToRegister}>
              Register here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
