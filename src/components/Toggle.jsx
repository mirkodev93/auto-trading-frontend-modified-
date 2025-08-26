import { useState } from "react";
import "../App.css";

export default function Toggle({ isFuture, setIsFuture }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: "12px",
        marginTop: "50px",
      }}
    >
      {/* Toggle switch */}
      <div
        onClick={() => setIsFuture(!isFuture)}
        style={{
          width: "60px",
          height: "30px",
          background: isFuture ? "#aaffff" : "#4ade80",
          borderRadius: "9999px",
          position: "relative",
          cursor: "pointer",
          transition: "background 0.3s ease",
          boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "3px",
            left: isFuture ? "32px" : "3px",
            width: "24px",
            height: "24px",
            borderRadius: "50%",
            background: "white",
            transition: "left 0.3s ease",
            boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
          }}
        />
      </div>

      {/* Label */}
      <span
        style={{
          fontWeight: 600,
          fontSize: "16px",
          color: "#e5e7eb",
          letterSpacing: "0.3px",
          userSelect: "none",
        }}
      >
        Spot / Future
      </span>
    </div>
  );
}
