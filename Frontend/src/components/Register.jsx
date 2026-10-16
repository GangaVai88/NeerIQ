import { useState } from "react";
import bgVideo from "../assets/generate_a_video_of_water_flow.mp4";
import logo from "../assets/logo.png";
import s from "./auth.module.css";

function Register({ onGoToLogin, onGoToDashboard }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const user = {
      username,
      email,
      password,
    };

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed. Please try again.");
        return;
      }

      setSuccess(data.message);
      setTimeout(() => {
        onGoToLogin();
      }, 1500);
    } catch (err) {
      setError("Something went wrong. Please try again.");
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
          <h2 className={s.cardTitle}>Create your account</h2>

          <form onSubmit={handleRegister}>
            <div className={s.formGroup}>
              <label>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose a username"
                required
              />
            </div>

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
                placeholder="Create a password"
                required
              />
            </div>

            {/* Error from backend — shown in red */}
            {error && <p className={s.msgError}>{error}</p>}

            {/* Success message before redirecting */}
            {success && <p className={s.msgSuccess}>{success}</p>}

            <button type="submit" className={s.btnPrimary}>
              Create Account
            </button>
          </form>

          <div className={s.cardFooter}>
            Already have an account?{" "}
            <button type="button" className={s.btnLink} onClick={onGoToLogin}>
              Login here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
