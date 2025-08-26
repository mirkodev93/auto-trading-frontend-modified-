import { useState } from "react";
import "../App.css";

export default function Toggle() {
  const [enabled, setEnabled] = useState(false);

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
        onClick={() => setEnabled(!enabled)}
        style={{
          width: "60px",
          height: "30px",
          background: enabled ? "#4ade80" : "#d1d5db", // green / gray
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
            left: enabled ? "32px" : "3px",
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
        Future / Spot
      </span>
    </div>
  );
}
