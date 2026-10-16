import { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import s from "./dashboard.module.css";

function Dashboard({ isLoggedIn, onLogout, onGoToLogin, onGoToRegister }) {
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState("sensing");
  const [isSensingExpanded, setIsSensingExpanded] = useState(true);
  const [alerts, setAlerts] = useState([]); // Mock alerts state
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!isLoggedIn) return;
      try {
        const response = await fetch(
          "http://localhost:5000/api/dashboard/profile",
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          // If token is invalid or expired, log out
          if (response.status === 401 || response.status === 403) {
            onLogout();
          }
          return;
        }

        setProfile(data.profile);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

    fetchProfile();
  }, [isLoggedIn, onLogout]);

  // Derive avatar initials from username
  const initials = profile?.username
    ? profile.username.slice(0, 2).toUpperCase()
    : "U";

  const sidebarItems = [
    { id: "sensing", label: "Sensing and monitoring", expandable: true },
    { id: "ai", label: "AI intelligence" },
    { id: "accountability", label: "Accountability engine" },
    { id: "behavioural", label: "Behavioural Engine" },
  ];

  const mockSensors = [
    { id: "X7B9A2", location: "Kitchen" },
    { id: "M4Q1L8", location: "Bathroom" },
    { id: "T9V3C4", location: "Garden" },
    { id: "W2F8N5", location: "Overhead Tank" },
  ];

  const handleTabClick = (itemId) => {
    setActiveTab(itemId);
    if (itemId === "sensing") {
      setIsSensingExpanded((prev) => !prev);
    }
  };

  return (
    <div className={s.dashPage}>
      {/* ── Navbar ── */}
      <nav className={s.navbar}>
        <div className={s.navBrand}>
          {/* Styled text instead of logo in navbar */}
          <span style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#fff', letterSpacing: '1px' }}>
            Neer<span style={{ color: 'var(--dash-accent)' }}>IQ</span>
          </span>
        </div>
        
        {/* Search bar */}
        <div className={s.searchContainer}>
          <svg className={s.searchIcon} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
          </svg>
          <input type="text" className={s.searchInput} placeholder="Search..." />
        </div>

        <div className={s.navActions}>
          {/* Notification Icon Button ahead of Login/Register */}
          <button
            type="button"
            className={s.notificationBtn}
            onClick={() => setShowNotifications(true)}
            aria-label="View notifications"
            title="Notifications"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2m.995-14.901a1 1 0 1 0-1.99 0A5 5 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901"/>
            </svg>
            {alerts.length > 0 && <span className={s.notifBadgeDot} />}
          </button>

          {isLoggedIn ? (
            <div className={s.navProfile}>
              <div className={s.navAvatar}>{initials}</div>
              <button type="button" className={s.btnNav} onClick={onLogout}>
                Log Out
              </button>
            </div>
          ) : (
            <>
              <button type="button" className={s.btnNav} onClick={onGoToLogin}>
                Login
              </button>
              <button type="button" className={s.btnPrimary} onClick={onGoToRegister}>
                Register
              </button>
            </>
          )}
        </div>
      </nav>

      {/* ── Notification Modal ── */}
      {showNotifications && (
        <div className={s.modalOverlay} onClick={() => setShowNotifications(false)}>
          <div className={s.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={s.modalHeader}>
              <h3>Notifications & Alerts</h3>
              <button
                type="button"
                className={s.modalClose}
                onClick={() => setShowNotifications(false)}
                aria-label="Close notifications"
              >
                ✕
              </button>
            </div>
            <div className={s.modalBody}>
              {alerts.length === 0 ? (
                <div className={s.emptyNotifications}>
                  <div className={s.zeroNotificationCircle}>0</div>
                  <p className={s.noNotifText}>No notifications</p>
                  <p className={s.noNotifSub}>Currently there are no alerts or warnings.</p>
                </div>
              ) : (
                <ul className={s.notifList}>
                  {alerts.map((alert, idx) => (
                    <li key={idx} className={s.notifItem}>
                      {alert}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Dashboard Body ── */}
      <div className={s.dashBody}>
        {/* Sidebar */}
        <aside className={s.sidebar}>
          {/* Logo in the sidebar */}
          <div style={{ padding: '16px', display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
            <img src={logo} alt="NeerIQ Logo" style={{ maxWidth: '140px', height: 'auto' }} />
          </div>
          
          {sidebarItems.map((item) => (
            <div key={item.id} className={s.sidebarItemWrapper}>
              <div
                className={`${s.sidebarItem} ${activeTab === item.id ? s.active : ""}`}
                onClick={() => handleTabClick(item.id)}
              >
                <div className={s.sidebarItemHeader}>
                  <span>{item.label}</span>
                  {item.expandable && (
                    <span className={`${s.chevronIcon} ${isSensingExpanded ? s.chevronRotated : ""}`}>
                      ▼
                    </span>
                  )}
                </div>
              </div>

              {/* Expanding sensor locations section on the left */}
              {item.expandable && isSensingExpanded && (
                <div className={s.sidebarSensorList}>
                  {mockSensors.map((sensor) => (
                    <div key={sensor.id} className={s.sidebarSensorItem}>
                      <span className={s.sidebarSensorLocation}>{sensor.location}</span>
                      <span className={s.sidebarSensorBadge}>{sensor.id}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </aside>

        {/* Main Screen */}
        <main className={s.mainScreen} style={{ padding: '48px 32px' }}>
          {/* Main area clean background, ready for future view cards */}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
