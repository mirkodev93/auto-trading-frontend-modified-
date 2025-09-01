import { useState, useEffect } from "react";
import "../App.css";
import Rules from "./Rules";
import PriceRange from "./PriceRange";
import { getTradingStatus, updateTradingStatus } from "../lib/api";

export default function Trading({
    mode,
    setMode,
    manualTrade,
    setManualTrade,
    autoTrade,
    setAutoTrade,
    handleSave
}) {
    const [isStart, setIsStart] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getTradingStatus();
                setIsStart(data.isStart);
            } catch (err) {
                console.error(err);
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
        }
    }

    return (
        <div className="tabs-wrap fancy-card">
            <div className="tabs">
                <div>
                    <button
                        type="button"
                        className={`tab ${mode === "Trading" ? "active" : ""}`}
                        onClick={() => switchMode("Trading")}
                        aria-pressed={mode === "Trading"}
                    >
                        Trading
                    </button>
                    <button
                        type="button"
                        className={`tab ${mode === "Simulation" ? "active" : ""}`}
                        onClick={() => switchMode("Simulation")}
                        aria-pressed={mode === "Simulation"}
                    >
                        Simulation
                    </button>
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
                    <button type="button" className="save-btn" onClick={handleSave}>
                        Save
                    </button>
                </div>
            </div>
            {!isStart ? (
                <div>
                    <button
                        onClick={() => handleStart(true)}
                        style={{
                            width: "60px",
                            padding: "8px",
                            margin: "150px",
                            background: "#00FF00",
                            borderRadius: "10px",
                            cursor: "pointer"
                        }}
                    >
                        Start
                    </button>
                </div>
            ) : (
                <div className="tab-content">
                    {mode === "Trading" ? (
                        <div>
                            <PriceRange autoTrade={autoTrade} setAutoTrade={setAutoTrade} handleSave={handleSave}/>
                            <Rules manualTrade={manualTrade} setManualTrade={setManualTrade} handleSave={handleSave}/>
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    )
}
