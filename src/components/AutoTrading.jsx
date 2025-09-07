import React from "react";
import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../App.css";
import { openLog } from "../lib/api";

const AutoTrading = ({ autoTrade, setAutoTrade, handleSave, simulationProgress }) => {
    const [maCount, setMaCount] = useState(5);
    const [interval, setInterval] = useState(1);
    const [maRamda, setMaRamda] = useState(0);
    const [priceDeltaBuy, setPriceDeltaBuy] = useState(0.5);
    const [priceDeltaSell, setPriceDeltaSell] = useState(0.5);
    const [isSimulation, setIsSimulation] = useState(false);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const shouldSaveRef = useRef(false);

    useEffect(() => {
        setMaCount(autoTrade.maCount);
        setInterval(autoTrade.interval);
        setMaRamda(autoTrade.maRamda);
        setPriceDeltaBuy(autoTrade.priceDeltaBuy);
        setPriceDeltaSell(autoTrade.priceDeltaSell);
        setIsSimulation(autoTrade.isSimulation || false);
        setStartTime(autoTrade.startTime || '');
        setEndTime(autoTrade.endTime || '');
    }, [autoTrade.maCount, autoTrade.interval, autoTrade.maRamda, autoTrade.priceDeltaBuy, autoTrade.priceDeltaSell, autoTrade.isSimulation, autoTrade.startTime, autoTrade.endTime]);

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
        if (field === "priceDeltaBuy") {
            setAutoTrade(prev => ({ ...prev, priceDeltaBuy: value }));
        }
        if (field === "priceDeltaSell") {
            setAutoTrade(prev => ({ ...prev, priceDeltaSell: value }));
        }
        if (field === "isSimulation") {
            setAutoTrade(prev => ({ ...prev, isSimulation: value }));
        }
        if (field === "startTime") {
            setAutoTrade(prev => ({ ...prev, startTime: value }));
        }
        if (field === "endTime") {
            setAutoTrade(prev => ({ ...prev, endTime: value }));
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
        if (priceDeltaSell < 0) {
            toast.error("Price delta sell must be greater than or equal to 0");
            return;
        }
        if (isSimulation && !startTime) {
            toast.error("Start time is required when simulation is enabled");
            return;
        }
        if (isSimulation && !endTime) {
            toast.error("End time is required when simulation is enabled");
            return;
        }
        if (isSimulation && startTime && endTime && new Date(startTime) >= new Date(endTime)) {
            toast.error("Start time must be before end time");
            return;
        }

        shouldSaveRef.current = true;
        setAutoTrade(prev => ({ ...prev, isEnabled: status }));
    }

    const handleOpenLog = async () => {
        try {
            await openLog();
        } catch (error) {
            console.error("Failed to open log:", error);
            toast.error(error.message || "Failed to open log file");
        }
    }

    const handleOpenAutoLog = async () => {
        try {
            await openLog('auto');
        } catch (error) {
            console.error("Failed to open auto log:", error);
            toast.error(error.message || "Failed to open auto log file");
        }
    }


    return (
        <div className="fancy-card auto-trade">
            <button className="manual-label">Auto</button>
            <div className="auto-toggle">
                <button
                    className="save-btn open-log-btn"
                    onClick={handleOpenLog}
                >
                    Open Simulation Log
                </button>
                <button
                    className="save-btn open-log-btn"
                    style={{ marginRight: "auto" }}
                    onClick={handleOpenAutoLog}
                >
                    Open Auto Log
                </button>
                <div className="simulation-checkbox">
                    <input
                        type="checkbox"
                        id="simulation"
                        disabled={autoTrade.isEnabled}
                        checked={isSimulation}
                        onChange={(e) => {
                            handleChange("isSimulation", e.target.checked);
                        }}
                    />
                    <label htmlFor="simulation">Simulation</label>
                </div>
                <button
                    className={`save-btn ${autoTrade.isEnabled ? "stop-btn" : ""}`}
                    onClick={() => handleAuto(!autoTrade.isEnabled)}
                >
                    {autoTrade.isEnabled ? "Stop" : "Start"}
                </button>
            </div>

            {/* Simulation Progress Display */}
            {isSimulation && autoTrade.isEnabled && (
                <div className="simulation-progress-container">
                    <div className="simulation-progress-label">
                        Simulation Progress: {simulationProgress.toFixed(1)}%
                    </div>
                    <div className="simulation-progress-bar">
                        <div
                            className="simulation-progress-fill"
                            style={{ width: `${simulationProgress}%` }}
                        ></div>
                    </div>
                </div>
            )}

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
                <div className="form-row-inline-price-delta">
                    <label className="form-label-inline">Buy</label>
                    <input
                        disabled={autoTrade.isEnabled}
                        type="number"
                        step="any"
                        className={`form-input compact form-input-time`}
                        value={priceDeltaBuy} onChange={(e) => handleChange("priceDeltaBuy", e.target.value)}
                    />
                    <label className="form-label-inline">Sell</label>
                    <input
                        disabled={autoTrade.isEnabled}
                        type="number"
                        step="any"
                        className={`form-input compact form-input-time`}
                        value={priceDeltaSell} onChange={(e) => handleChange("priceDeltaSell", e.target.value)}
                    />
                </div>
            </div>

            {isSimulation && (
                <>
                    <div className="form-row-inline form-row-inline-simulation" style={{ opacity: autoTrade.isEnabled ? "50%" : "" }}>
                        <label className="form-label-inline">Start time</label>
                        <input
                            disabled={autoTrade.isEnabled}
                            type="datetime-local"
                            className="form-input compact"
                            value={startTime}
                            onChange={(e) => {
                                handleChange("startTime", e.target.value);
                            }}
                        />
                    </div>

                    <div className="form-row-inline form-row-inline-simulation" style={{ opacity: autoTrade.isEnabled ? "50%" : "" }}>
                        <label className="form-label-inline">End time</label>
                        <input
                            disabled={autoTrade.isEnabled}
                            type="datetime-local"
                            className="form-input compact"
                            value={endTime}
                            onChange={(e) => {
                                handleChange("endTime", e.target.value);
                            }}
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default AutoTrading;
