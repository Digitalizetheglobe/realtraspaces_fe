import React, { useEffect, useState } from "react";

const COOKIE_KEY = "cookiesAccepted";

const CookiesBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem(COOKIE_KEY);
    if (!accepted) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_KEY, "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div style={{
      position: "fixed",
      bottom: 0,
      left: 0,
      width: "100%",
      background: "#222",
      color: "#fff",
      padding: "1rem",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    }}>
      <span style={{ marginRight: "1rem" }}>
        We use cookies to improve your experience. Read our {" "}
        <a href="/privacy-policy" style={{ color: "#4fd1c5", textDecoration: "underline" }}>
          Cookies Policy
        </a>.
      </span>
      <button
        onClick={handleAccept}
        style={{
          background: "#4fd1c5",
          color: "#222",
          border: "none",
          borderRadius: "4px",
          padding: "0.5rem 1rem",
          cursor: "pointer",
        }}
      >
        Accept
      </button>
    </div>
  );
};

export default CookiesBanner; 