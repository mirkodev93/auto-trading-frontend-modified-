import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "../App.css";
import ManualTrading from "./ManualTrading";
import AutoTrading from "./AutoTrading";
import SwapTrading from "./SwapTrading";
import { getTradingStatus, updateTradingStatus } from "../lib/api";

const Trading = ({
    mode,
    setMode,
    manualTrade,
    setManualTrade,
    autoTrade,
    setAutoTrade,
    handleSave,
    simulationProgress,
    globalTrend,
    technicalIndicators
}) => {
    const [isStart, setIsStart] = useState(true);

    const getGlobalTrendText = (trend) => {
        const trendMap = {
            'up': 'Up',
            'do': 'Down',
            'su': 'Strong Up',
            'sd': 'Strong Down',
            'am': 'Ambiguous'
        };
        return trendMap[trend] || 'Unknown';
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getTradingStatus();
                setIsStart(data.isStart);
            } catch (err) {
                console.error(err);
                toast.error("Failed to fetch trading status");
            }
        };
        fetchData();
    }, [])

    const switchMode = (next) => setMode && setMode(next);

    const handleStart = async (isStart) => {
        try {
            const data = await updateTradingStatus(isStart);
            setIsStart(data.isStart);
        } catch (err) {
            console.error(err);
            toast.error("Failed to update trading status");
        }
    }

    return (
        <div className="tabs-wrap fancy-card">
            <div className="tabs">
                <div>
                    <button
                        type="button"
                        className={`tab ${mode === "Auto" ? "active" : ""}`}
                        onClick={() => switchMode("Auto")}
                        aria-pressed={mode === "Auto"}
                    >
                        Auto
                    </button>
                    <button
                        type="button"
                        className={`tab ${mode === "Swap" ? "active" : ""}`}
                        onClick={() => switchMode("Swap")}
                        aria-pressed={mode === "Swap"}
                    >
                        Swap
                    </button>
                    <button
                        type="button"
                        className={`tab ${mode === "Set Point" ? "active" : ""}`}
                        onClick={() => switchMode("Set Point")}
                        aria-pressed={mode === "Set Point"}
                    >
                        Set Point
                    </button>
                </div>
                {/* Global Trend Display */}
                <div style={{ textAlign: 'center', margin: "10px", color: "white" }}>
                    <span style={{ fontSize: '14px' }}>Global Trend: </span>
                    <span style={{ fontSize: '16px', fontWeight: 'bold' }}>
                        {getGlobalTrendText(globalTrend)}
                    </span>
                </div>
                <div>
                    {isStart && (
                        <button
                            onClick={() => handleStart(false)}
                            className="save-btn stop-btn"
                        >
                            Stop
                        </button>
                    )}
                </div>
            </div>
            {!isStart ? (
                <div style={{ height: "500px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <button
                        onClick={() => handleStart(true)}
                        className="save-btn"
                    >
                        Start
                    </button>
                </div>
            ) : (
                <div className="tab-content">
                    {mode === "Auto" ? (
                        <div>
                            <AutoTrading autoTrade={autoTrade} setAutoTrade={setAutoTrade} handleSave={handleSave} simulationProgress={simulationProgress} />
                        </div>
                    ) : null}
                    {mode === "Swap" ? (
                        <div>
                            <SwapTrading />
                        </div>
                    ) : null}
                    {mode === "Set Point" ? (
                        <div>
                            {/* Technical Indicators Display */}
                            <div className="fancy-card manual-trade">
                                <div className="manual-label">Technical Indicators</div>
                                <div style={{ margin: "20px", fontSize: "18px" }}>
                                    <div className="form-row-inline balance-header">
                                        <span>RSI:</span>
                                        <span>{technicalIndicators.RSI?.toFixed(2) || '0.00'}</span>
                                    </div>
                                    <div className="form-row-inline balance-header">
                                        <span>MA5:</span>
                                        <span>{technicalIndicators.MA5?.toFixed(4) || '0.0000'}</span>
                                    </div>
                                    <div className="form-row-inline balance-header">
                                        <span>MA50:</span>
                                        <span>{technicalIndicators.MA50?.toFixed(4) || '0.0000'}</span>
                                    </div>
                                    <div className="form-row-inline balance-header">
                                        <span>MA200:</span>
                                        <span>{technicalIndicators.MA200?.toFixed(4) || '0.0000'}</span>
                                    </div>
                                    <div className="form-row-inline balance-header">
                                        <span>Slope MA5:</span>
                                        <span className={technicalIndicators.slopeMA5 >= 0 ? 'chip-value-positive' : 'chip-value-negative'}>
                                            {technicalIndicators.slopeMA5?.toFixed(6) || '0.000000'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <ManualTrading manualTrade={manualTrade} setManualTrade={setManualTrade} handleSave={handleSave} />
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    )
}

export default Trading;