import React from "react";
import "../App.css";

const Toggle = ({ isFuture, setIsFuture, selectedToken = "sol", setSelectedToken }) => {

  const handleChange = (e) => {
    setSelectedToken?.(e.target.value);
  };

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

      <div className="token">
        <div className="form-group">
          {/* <label>Token</label> */}
          <select
            className="form-input"
            value={selectedToken}
            onChange={handleChange}
          >
            <option value={"eth"}>ETH</option>
            <option value={"sol"}>SOL</option>
            <option value={"xrp"}>XRP</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default Toggle;
