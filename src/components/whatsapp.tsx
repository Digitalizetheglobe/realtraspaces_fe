"use client";
import { useState } from "react";
import Image from "next/image";
import wp from "../../public/assets/wha.png"; // ✅ Adjusted import path for WhatsApp icon
import snd from "../../public/assets/send.png"; // ✅ Adjusted import path for send icon
const WhatsAppPopup = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [phoneNumber] = useState("+91 70393 11539"); // ✅ Blue tick WhatsApp number
  const [message, setMessage] = useState("");
  const [isHovered, setIsHovered] = useState(false);

  const handleSendMessage = () => {
    if (!message.trim() || !phoneNumber.trim()) return;

    // Remove spaces and ensure proper number format
    const formattedPhoneNumber = phoneNumber.replace(/\s+/g, "");
    const url = `https://wa.me/${formattedPhoneNumber}?text=${encodeURIComponent(message)}`;
    
    window.open(url, "_blank");
    setMessage("");
  };

  return (
    <>
      {/* WhatsApp Floating Button */}
      <button
        onClick={() => setShowPopup(!showPopup)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          position: "fixed",
          bottom: "40px",
          left: "40px", // ✅ Changed to left side on desktop
          backgroundColor: "rgb(33, 202, 95)",
          border: "none",
          borderRadius: "50%",
          width: isHovered ? "60px" : "40px",
          height: isHovered ? "60px" : "40px",
          cursor: "pointer",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
          padding: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          transition: "width 0.2s, height 0.2s",
        }}
      >
        <Image src={wp} alt="WhatsApp" width={35} height={35} />
      </button>

      {/* WhatsApp Chat Popup */}
      {showPopup && (
        <div
          style={{
            position: "fixed",
            bottom: "90px",
            left: "20px", // ✅ Adjusted popup position to left side
            width: "320px",
            backgroundColor: "#fff",
            borderRadius: "10px",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
            zIndex: 1000,
            fontFamily: "Arial, sans-serif",
          }}
        >
          {/* Header */}
          <div
            style={{
              backgroundColor: "#075E54",
              color: "#fff",
              padding: "12px",
              borderTopLeftRadius: "10px",
              borderTopRightRadius: "10px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontWeight: "bold",
            }}
          >
            <span>Realtra Spaces</span>
            <span onClick={() => setShowPopup(false)} style={{ cursor: "pointer", fontSize: "18px" }}>✖</span>
          </div>

          {/* Chat Body */}
          <div
            style={{
              padding: "12px",
              backgroundColor: "#ECE5DD",
              minHeight: "150px",
              maxHeight: "250px",
              overflowY: "auto",
            }}
          >
            <div
              style={{
                backgroundColor: "#DCF8C6",
                padding: "8px",
                borderRadius: "8px",
                maxWidth: "80%",
                marginBottom: "10px",
                fontSize: "14px",
                boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)",
              }}
            >
              Hey! 👋 Enter a message and send it to WhatsApp.
            </div>
          </div>

          {/* Chat Input */}
          <div
            style={{
              display: "flex",
              flexDirection: "row", // ✅ Changed to row layout
              alignItems: "center",
              gap: "8px",
              padding: "12px",
              backgroundColor: "#fff",
              borderBottomLeftRadius: "10px",
              borderBottomRightRadius: "10px",
            }}
          >
            {/* Message Input */}
            <input
              type="text"
              placeholder="Enter your message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{
                flex: 1,
                padding: "8px",
                borderRadius: "20px",
                border: "1px solid #ddd",
                outline: "none",
                fontSize: "14px",
              }}
            />

            {/* Send Button */}
            <button
              onClick={handleSendMessage}
              style={{
                backgroundColor: "#25D366",
                border: "none",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
              }}
            >
              <Image src={snd} alt="Send" width={20} height={20} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default WhatsAppPopup;