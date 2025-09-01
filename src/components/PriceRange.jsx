import React from "react";
import { useState, useEffect } from "react";
import {toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../App.css";

const PriceRange = ({ autoTrade, setAutoTrade, handleSave }) => {
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(0);
    const [time, setTime] = useState(0);

    useEffect(() => {
        setMinPrice(autoTrade.minPrice);
        setMaxPrice(autoTrade.maxPrice);
        setTime(autoTrade.time);
    }, [autoTrade.minPrice, autoTrade.maxPrice, autoTrade.time]);

    const handleChange = (field, value) => {

        if (field === "minPrice") {
            setMinPrice(value);
            setAutoTrade(prev => ({ ...prev, minPrice: value }));
        }
        if (field === "maxPrice") {
            setMaxPrice(maxPrice);
            setAutoTrade(prev => ({ ...prev, maxPrice: value }));
        }
        if (field === "time") {
            setTime(value);
            setAutoTrade(prev => ({ ...prev, time: value }));
        }
    };

    const handleAuto = (status) => {
        if(time<=0) {
            toast.error("The time must be bigger than 0");
            return;
        }
        if(minPrice > maxPrice){
            toast.error("Please set price correctly")
            return;
        }
        setAutoTrade(prev => ({ ...prev, isEnabled: status }));
        handleSave();
    }


    return (
        <div className="fancy-card auto-trade">
            <button className="auto-label">Auto</button>
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

export default PriceRange;
