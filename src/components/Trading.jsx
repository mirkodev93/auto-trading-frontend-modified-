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
    globalTrend
}) => {
    const [isStart, setIsStart] = useState(true);

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
                        className={`tab ${mode === "Manual" ? "active" : ""}`}
                        onClick={() => switchMode("Manual")}
                        aria-pressed={mode === "Manual"}
                    >
                        Manual
                    </button>
                </div>
                {/* Global Trend Display */}
                <div style={{ textAlign: 'center', margin: "10px", color: "white" }}>
                    <span style={{ fontSize: '14px' }}>Global Trend: </span>
                    <span style={{ fontSize: '16px', fontWeight: 'bold' }}>
                        {globalTrend.charAt(0).toUpperCase() + globalTrend.slice(1)}
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
                    {mode === "Manual" ? (
                        <div>
                            <SwapTrading />
                            <ManualTrading manualTrade={manualTrade} setManualTrade={setManualTrade} handleSave={handleSave} />
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    )
}

export default Trading;