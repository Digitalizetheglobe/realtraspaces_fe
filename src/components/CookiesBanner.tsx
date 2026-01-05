"use client";

import React, { useEffect, useState } from "react";

const COOKIE_KEY = "cookiesAccepted";
const SESSION_ID_KEY = "cookieSessionId";

// Get API base URL from environment or default to localhost
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface CookieResponse {
  status: string;
  data?: {
    accepted: boolean;
  };
  message?: string;
}

const CookiesBanner: React.FC = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    checkAcceptanceStatus();
  }, []);

  const generateSessionId = (): string => {
    // Generate a simple session ID for anonymous users
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const getSessionId = (): string => {
    // Get existing session ID or create a new one
    let sessionId = localStorage.getItem(SESSION_ID_KEY);
    if (!sessionId) {
      sessionId = generateSessionId();
      localStorage.setItem(SESSION_ID_KEY, sessionId);
    }
    return sessionId;
  };

  const checkAcceptanceStatus = async (): Promise<void> => {
    try {
      // First check localStorage as a fallback
      const localAccepted = localStorage.getItem(COOKIE_KEY);
      if (localAccepted) {
        setVisible(false);
        return;
      }

      // Check with the API using consistent session ID
      const sessionId = getSessionId();
      const response = await fetch(`${API_BASE_URL}/api/cookie-policy/check?sessionId=${sessionId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result: CookieResponse = await response.json();
      
      if (result.status === 'success' && result.data?.accepted) {
        setVisible(false);
        localStorage.setItem(COOKIE_KEY, "true");
      } else {
        setVisible(true);
      }
    } catch (error) {
      console.error('Error checking cookie acceptance:', error);
      // Fallback to showing banner if API check fails
      const localAccepted = localStorage.getItem(COOKIE_KEY);
      if (!localAccepted) {
        setVisible(true);
      }
    }
  };

  const handleAccept = async (): Promise<void> => {
    setLoading(true);
    try {
      const sessionId = getSessionId();
      const response = await fetch(`${API_BASE_URL}/api/cookie-policy/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: sessionId,
          policyVersion: '1.0'
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result: CookieResponse = await response.json();
      if (result.status === 'success') {
        setVisible(false);
        localStorage.setItem(COOKIE_KEY, "true");
        console.log('Cookie policy accepted successfully');
      } else {
        console.error('Failed to accept cookies:', result.message);
        // Still hide the banner and store locally as fallback
        setVisible(false);
        localStorage.setItem(COOKIE_KEY, "true");
      }
    } catch (error) {
      console.error('Error accepting cookies:', error);
      // Fallback to localStorage only
      localStorage.setItem(COOKIE_KEY, "true");
      setVisible(false);
    } finally {
      setLoading(false);
    }
  };

  if (!visible) return null;

  return (
    <div 
      role="banner"
      aria-label="Cookie consent banner"
      style={{
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
        boxShadow: "0 -2px 10px rgba(0,0,0,0.3)",
      }}
    >
      <span style={{ marginRight: "1rem", fontSize: "14px" }}>
        We use cookies to improve your experience. Read our {" "}
        <a 
          href="/privacy-policy" 
          style={{ color: "#4fd1c5", textDecoration: "underline" }}
          aria-label="Read our cookies policy"
        >
          Cookies Policy
        </a>.
      </span>
      <button
        onClick={handleAccept}
        disabled={loading}
        aria-label={loading ? "Accepting cookies..." : "Accept cookies"}
        style={{
          background: loading ? "#666" : "#4fd1c5",
          color: "#222",
          border: "none",
          borderRadius: "4px",
          padding: "0.5rem 1rem",
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.7 : 1,
          fontWeight: "bold",
          fontSize: "14px",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          if (!loading) {
            (e.target as HTMLButtonElement).style.background = "#5ee7df";
          }
        }}
        onMouseLeave={(e) => {
          if (!loading) {
            (e.target as HTMLButtonElement).style.background = "#4fd1c5";
          }
        }}
      >
        {loading ? "Accepting..." : "Accept"}
      </button>
    </div>
  );
};

export default CookiesBanner; 