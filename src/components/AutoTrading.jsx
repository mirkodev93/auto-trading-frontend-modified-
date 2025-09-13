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
    const [isSimulation, setIsSimulation] = useState(false);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');

    // Up Trend state
    const [upTrendUseMAHigh, setUpTrendUseMAHigh] = useState(false);
    const [upTrendMaCount, setUpTrendMaCount] = useState(50);
    const [upTrendContinuousCount, setUpTrendContinuousCount] = useState(3);
    const [upTrendContinuousRamda, setUpTrendContinuousRamda] = useState(0.5);
    const [upTrendPriceDeltaBuy, setUpTrendPriceDeltaBuy] = useState(10000);
    const [upTrendPriceDeltaSell, setUpTrendPriceDeltaSell] = useState(0.1);

    // Down Trend state
    const [downTrendUseMAHigh, setDownTrendUseMAHigh] = useState(false);
    const [downTrendMaCount, setDownTrendMaCount] = useState(50);
    const [downTrendContinuousCount, setDownTrendContinuousCount] = useState(3);
    const [downTrendContinuousRamda, setDownTrendContinuousRamda] = useState(0.5);
    const [downTrendPriceDeltaBuy, setDownTrendPriceDeltaBuy] = useState(-0.1);
    const [downTrendPriceDeltaSell, setDownTrendPriceDeltaSell] = useState(-10000);

    const shouldSaveRef = useRef(false);

    useEffect(() => {
        setMaCount(autoTrade.maCount || 5);
        setInterval(autoTrade.interval || 1);
        setMaRamda(autoTrade.maRamda || 0);
        setIsSimulation(autoTrade.isSimulation || false);
        setStartTime(autoTrade.startTime || '');
        setEndTime(autoTrade.endTime || '');

        // Initialize Up Trend settings
        setUpTrendUseMAHigh(autoTrade.upTrend?.useMAHigh || false);
        setUpTrendMaCount(autoTrade.upTrend?.maCount || 50);
        setUpTrendContinuousCount(autoTrade.upTrend?.continuousUp?.count || 3);
        setUpTrendContinuousRamda(autoTrade.upTrend?.continuousUp?.ramda || 0.5);
        setUpTrendPriceDeltaBuy(autoTrade.upTrend?.priceDelta?.buy || 10000);
        setUpTrendPriceDeltaSell(autoTrade.upTrend?.priceDelta?.sell || 0.1);

        // Initialize Down Trend settings
        setDownTrendUseMAHigh(autoTrade.downTrend?.useMAHigh || false);
        setDownTrendMaCount(autoTrade.downTrend?.maCount || 50);
        setDownTrendContinuousCount(autoTrade.downTrend?.continuousDown?.count || 3);
        setDownTrendContinuousRamda(autoTrade.downTrend?.continuousDown?.ramda || 0.5);
        setDownTrendPriceDeltaBuy(autoTrade.downTrend?.priceDelta?.buy || -0.1);
        setDownTrendPriceDeltaSell(autoTrade.downTrend?.priceDelta?.sell || -10000);
    }, [autoTrade]);

    useEffect(() => {
        if (shouldSaveRef.current) {
            handleSave();
            shouldSaveRef.current = false;
        }
    }, [autoTrade.isEnabled, handleSave]);

    // Helper function to update nested object properties
    const updateNestedProperty = (obj, path, value) => {
        const keys = path.split('.');
        const result = { ...obj };
        let current = result;

        for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];
            current[key] = { ...current[key] };
            current = current[key];
        }

        current[keys[keys.length - 1]] = value;
        return result;
    };

    const handleChange = (field, value) => {
        // Field mapping for direct properties
        const directFields = {
            maCount: 'maCount',
            interval: 'interval',
            maRamda: 'maRamda',
            isSimulation: 'isSimulation',
            startTime: 'startTime',
            endTime: 'endTime'
        };

        // Field mapping for nested properties
        const nestedFields = {
            upTrendUseMAHigh: 'upTrend.useMAHigh',
            upTrendMaCount: 'upTrend.maCount',
            upTrendContinuousCount: 'upTrend.continuousUp.count',
            upTrendContinuousRamda: 'upTrend.continuousUp.ramda',
            upTrendPriceDeltaBuy: 'upTrend.priceDelta.buy',
            upTrendPriceDeltaSell: 'upTrend.priceDelta.sell',
            downTrendUseMAHigh: 'downTrend.useMAHigh',
            downTrendMaCount: 'downTrend.maCount',
            downTrendContinuousCount: 'downTrend.continuousDown.count',
            downTrendContinuousRamda: 'downTrend.continuousDown.ramda',
            downTrendPriceDeltaBuy: 'downTrend.priceDelta.buy',
            downTrendPriceDeltaSell: 'downTrend.priceDelta.sell'
        };

        setAutoTrade(prev => {
            // Handle direct properties
            if (directFields[field]) {
                return { ...prev, [directFields[field]]: value };
            }

            // Handle nested properties
            if (nestedFields[field]) {
                return updateNestedProperty(prev, nestedFields[field], value);
            }

            // Return unchanged if field not found
            return prev;
        });
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

        // Validate Up Trend settings
        if (upTrendMaCount <= 0) {
            toast.error("Up Trend MA count must be bigger than 0");
            return;
        }
        if (upTrendContinuousCount <= 0) {
            toast.error("Up Trend continuous count must be bigger than 0");
            return;
        }
        if (upTrendContinuousRamda < 0) {
            toast.error("Up Trend continuous ramda must be greater than or equal to 0");
            return;
        }

        // Validate Down Trend settings
        if (downTrendMaCount <= 0) {
            toast.error("Down Trend MA count must be bigger than 0");
            return;
        }
        if (downTrendContinuousCount <= 0) {
            toast.error("Down Trend continuous count must be bigger than 0");
            return;
        }
        if (downTrendContinuousRamda < 0) {
            toast.error("Down Trend continuous ramda must be greater than or equal to 0");
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
        <div className="fancy-card manual-trade">
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
                    min="1"
                    className={`form-input compact`}
                    value={maCount} onChange={(e) => handleChange("maCount", e.target.value)}
                />

                <label className="form-label-inline">Candle interval (m)</label>
                <input
                    disabled={autoTrade.isEnabled}
                    type="number"
                    step="any"
                    min="1"
                    className={`form-input compact`}
                    value={interval} onChange={(e) => handleChange("interval", e.target.value)}
                />
                <label className="form-label-inline">MA ramda</label>
                <input
                    disabled={autoTrade.isEnabled}
                    type="number"
                    step="any"
                    min="0"
                    className={`form-input compact`}
                    value={maRamda} onChange={(e) => handleChange("maRamda", e.target.value)}
                />
            </div>
            <div className="form-row-inline" style={{ opacity: autoTrade.isEnabled ? "50%" : "" }}>
                <div className="form-row-trend fancy-card">
                    <label className="form-label-inline form-label-inline-bold">Up Trend</label>
                    <div className="form-row-flex">
                        <div>
                            <input
                                type="checkbox"
                                id="upTrendUseMAHigh"
                                disabled={autoTrade.isEnabled}
                                checked={upTrendUseMAHigh}
                                onChange={(e) => {
                                    handleChange("upTrendUseMAHigh", e.target.checked);
                                }}
                            />
                            <label htmlFor="upTrendUseMAHigh">Use MA High</label>
                            <div className="form-row-inline">
                                <label className="form-label-inline">MA Count</label>
                                <input
                                    disabled={autoTrade.isEnabled}
                                    type="number"
                                    step="any"
                                    min="1"
                                    className={`form-input compact`}
                                    value={upTrendMaCount}
                                    onChange={(e) => handleChange("upTrendMaCount", e.target.value)}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="form-label-inline">Continuous Up</label>
                            <div className="form-row-inline">
                                <label className="form-label-inline">Count</label>
                                <input
                                    disabled={autoTrade.isEnabled}
                                    type="number"
                                    step="any"
                                    min="1"
                                    className={`form-input compact`}
                                    value={upTrendContinuousCount}
                                    onChange={(e) => handleChange("upTrendContinuousCount", e.target.value)}
                                />
                            </div>
                            <div className="form-row-inline">
                                <label className="form-label-inline">Ramda</label>
                                <input
                                    disabled={autoTrade.isEnabled}
                                    type="number"
                                    step="any"
                                    min="0"
                                    className={`form-input compact`}
                                    value={upTrendContinuousRamda}
                                    onChange={(e) => handleChange("upTrendContinuousRamda", e.target.value)}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="form-label-inline">Price delta</label>
                            <div className="form-row-inline">
                                <label className="form-label-inline">Buy</label>
                                <input
                                    disabled={autoTrade.isEnabled}
                                    type="number"
                                    step="any"
                                    className={`form-input compact`}
                                    value={upTrendPriceDeltaBuy}
                                    onChange={(e) => handleChange("upTrendPriceDeltaBuy", e.target.value)}
                                />
                            </div>
                            <div className="form-row-inline">
                                <label className="form-label-inline">Sell</label>
                                <input
                                    disabled={autoTrade.isEnabled}
                                    type="number"
                                    step="any"
                                    className={`form-input compact`}
                                    value={upTrendPriceDeltaSell}
                                    onChange={(e) => handleChange("upTrendPriceDeltaSell", e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="form-row-trend fancy-card">
                    <label className="form-label-inline form-label-inline-bold">Down Trend</label>
                    <div className="form-row-flex">
                        <div>
                            <input
                                type="checkbox"
                                id="downTrendUseMAHigh"
                                disabled={autoTrade.isEnabled}
                                checked={downTrendUseMAHigh}
                                onChange={(e) => {
                                    handleChange("downTrendUseMAHigh", e.target.checked);
                                }}
                            />
                            <label htmlFor="downTrendUseMAHigh">Use MA High</label>
                            <div className="form-row-inline">
                                <label className="form-label-inline">MA Count</label>
                                <input
                                    disabled={autoTrade.isEnabled}
                                    type="number"
                                    step="any"
                                    min="1"
                                    className={`form-input compact`}
                                    value={downTrendMaCount}
                                    onChange={(e) => handleChange("downTrendMaCount", e.target.value)}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="form-label-inline">Continuous Down</label>
                            <div className="form-row-inline">
                                <label className="form-label-inline">Count</label>
                                <input
                                    disabled={autoTrade.isEnabled}
                                    type="number"
                                    step="any"
                                    min="1"
                                    className={`form-input compact`}
                                    value={downTrendContinuousCount}
                                    onChange={(e) => handleChange("downTrendContinuousCount", e.target.value)}
                                />
                            </div>
                            <div className="form-row-inline">
                                <label className="form-label-inline">Ramda</label>
                                <input
                                    disabled={autoTrade.isEnabled}
                                    type="number"
                                    step="any"
                                    min="0"
                                    className={`form-input compact`}
                                    value={downTrendContinuousRamda}
                                    onChange={(e) => handleChange("downTrendContinuousRamda", e.target.value)}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="form-label-inline">Price delta</label>
                            <div className="form-row-inline">
                                <label className="form-label-inline">Buy</label>
                                <input
                                    disabled={autoTrade.isEnabled}
                                    type="number"
                                    step="any"
                                    className={`form-input compact`}
                                    value={downTrendPriceDeltaBuy}
                                    onChange={(e) => handleChange("downTrendPriceDeltaBuy", e.target.value)}
                                />
                            </div>
                            <div className="form-row-inline">
                                <label className="form-label-inline">Sell</label>
                                <input
                                    disabled={autoTrade.isEnabled}
                                    type="number"
                                    step="any"
                                    className={`form-input compact`}
                                    value={downTrendPriceDeltaSell}
                                    onChange={(e) => handleChange("downTrendPriceDeltaSell", e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
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
