import React from "react";
import "../App.css"

export default function AutoTrading({ isAuto, setIsAuto }) {
    return (
        <div className="auto-trading-box">
            <label>
                <input
                    type="checkbox"
                    checked={isAuto}
                    onChange={(e) => setIsAuto(e.target.checked)}
                />
                Auto Trading
            </label>
        </div>
    );
}
