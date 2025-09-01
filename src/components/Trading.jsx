import { useState, useEffect } from "react";
import "../App.css";
import Rules from "./Rules";
import PriceRange from "./PriceRange";

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
                const res = await fetch("http://localhost:4000/api/trading/start");
                const data = await res.json();
                setIsStart(data.isStart);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, [])

    const switchMode = (next) => setMode && setMode(next);

    const handleStart = async (isStart) => {
        const res = await fetch(`http://localhost:4000/api/trading/start`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isStart: isStart }),
        });
        const data = await res.json();
        setIsStart(data.isStart);
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
