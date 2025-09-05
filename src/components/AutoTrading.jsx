import React from "react";
import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../App.css";

const AutoTrading = ({ autoTrade, setAutoTrade, handleSave }) => {
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(0);
    const [time, setTime] = useState(0);
    const shouldSaveRef = useRef(false);

    useEffect(() => {
        setMinPrice(autoTrade.minPrice);
        setMaxPrice(autoTrade.maxPrice);
        setTime(autoTrade.time);
    }, [autoTrade.minPrice, autoTrade.maxPrice, autoTrade.time]);

    useEffect(() => {
        if (shouldSaveRef.current) {
            handleSave();
            shouldSaveRef.current = false;
        }
    }, [autoTrade.isEnabled, handleSave]);

    const handleChange = (field, value) => {

        if (field === "minPrice") {
            setAutoTrade(prev => ({ ...prev, minPrice: value }));
        }
        if (field === "maxPrice") {
            setAutoTrade(prev => ({ ...prev, maxPrice: value }));
        }
        if (field === "time") {
            setAutoTrade(prev => ({ ...prev, time: value }));
        }
    };

    const handleAuto = (status) => {
        if (time <= 0) {
            toast.error("The time must be bigger than 0");
            return;
        }
        if (minPrice > maxPrice) {
            toast.error("Please set price correctly")
            return;
        }

        shouldSaveRef.current = true;
        setAutoTrade(prev => ({ ...prev, isEnabled: status }));
    }


    return (
        <div className="fancy-card auto-trade">
            <button className="manual-label">Auto</button>
            <div className="auto-toggle">
                <button
                    className={`save-btn ${autoTrade.isEnabled ? "stop-btn" : ""}`}
                    onClick={() => handleAuto(!autoTrade.isEnabled)}
                >
                    {autoTrade.isEnabled ? "Stop" : "Start"}
                </button>
            </div>

            <div className="form-row-inline" style={{ opacity: autoTrade.isEnabled ? "50%" : "" }}>
                <label className="form-label-inline">Price Range ($):</label>

                <label className="form-label-inline">Min</label>
                <input
                    disabled={autoTrade.isEnabled}
                    type="number"
                    step="any"
                    className={`form-input compact`}
                    value={minPrice} onChange={(e) => handleChange("minPrice", e.target.value)}
                />

                <label className="form-label-inline">Max</label>
                <input
                    disabled={autoTrade.isEnabled}
                    type="number"
                    step="any"
                    className={`form-input compact`}
                    value={maxPrice} onChange={(e) => handleChange("maxPrice", e.target.value)}
                />
            </div>
            <div className="form-row-inline" style={{ opacity: autoTrade.isEnabled ? "50%" : "" }}>
                <label className="form-label-inline">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Period (h):&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
                <input
                    disabled={autoTrade.isEnabled}
                    type="number"
                    step="any"
                    className={`form-input compact form-input-time`}
                    value={time} onChange={(e) => handleChange("time", e.target.value)}
                />
            </div>
        </div>
    );
};

export default AutoTrading;
