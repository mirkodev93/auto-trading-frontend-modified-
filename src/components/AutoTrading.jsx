import React from "react";
import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../App.css";

const AutoTrading = ({ autoTrade, setAutoTrade, handleSave }) => {
    const [maCount, setMaCount] = useState(5);
    const [interval, setInterval] = useState(1);
    const [maRamda, setMaRamda] = useState(0);
    const [priceDelta, setPriceDelta] = useState(0.5);
    const shouldSaveRef = useRef(false);

    useEffect(() => {
        setMaCount(autoTrade.maCount);
        setInterval(autoTrade.interval);
        setMaRamda(autoTrade.maRamda);
        setPriceDelta(autoTrade.priceDelta);
    }, [autoTrade.maCount, autoTrade.interval, autoTrade.maRamda, autoTrade.priceDelta]);

    useEffect(() => {
        if (shouldSaveRef.current) {
            handleSave();
            shouldSaveRef.current = false;
        }
    }, [autoTrade.isEnabled, handleSave]);

    const handleChange = (field, value) => {

        if (field === "maCount") {
            setAutoTrade(prev => ({ ...prev, maCount: value }));
        }
        if (field === "interval") {
            setAutoTrade(prev => ({ ...prev, interval: value }));
        }
        if (field === "maRamda") {
            setAutoTrade(prev => ({ ...prev, maRamda: value }));
        }
        if (field === "priceDelta") {
            setAutoTrade(prev => ({ ...prev, priceDelta: value }));
        }
    };

    const handleAuto = (status) => {
        if (maCount <= 0) {
            toast.error("MA count must be bigger than 0");
            return;
        }
        if (interval <= 0) {
            toast.error("Interval must be bigger than 0");
            return;
        }
        if (maRamda < 0) {
            toast.error("MA ramda must be greater than or equal to 0");
            return;
        }
        if (priceDelta <= 0) {
            toast.error("Price delta must be bigger than 0");
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
                <label className="form-label-inline">MA count</label>
                <input
                    disabled={autoTrade.isEnabled}
                    type="number"
                    step="any"
                    className={`form-input compact`}
                    value={maCount} onChange={(e) => handleChange("maCount", e.target.value)}
                />

                <label className="form-label-inline">Candle interval (m)</label>
                <input
                    disabled={autoTrade.isEnabled}
                    type="number"
                    step="any"
                    className={`form-input compact`}
                    value={interval} onChange={(e) => handleChange("interval", e.target.value)}
                />
            </div>
            <div className="form-row-inline" style={{ opacity: autoTrade.isEnabled ? "50%" : "" }}>
                <label className="form-label-inline">MA ramda</label>
                <input
                    disabled={autoTrade.isEnabled}
                    type="number"
                    step="any"
                    className={`form-input compact form-input-time`}
                    value={maRamda} onChange={(e) => handleChange("maRamda", e.target.value)}
                />

                <label className="form-label-inline">Price delta</label>
                <input
                    disabled={autoTrade.isEnabled}
                    type="number"
                    step="any"
                    className={`form-input compact form-input-time`}
                    value={priceDelta} onChange={(e) => handleChange("priceDelta", e.target.value)}
                />
            </div>
        </div>
    );
};

export default AutoTrading;
