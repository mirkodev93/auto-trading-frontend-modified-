import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "../App.css";
import ManualTrading from "./ManualTrading";
import AutoTrading from "./AutoTrading";
import { getTradingStatus, updateTradingStatus } from "../lib/api";

const Trading = ({
    mode,
    setMode,
    manualTrade,
    setManualTrade,
    autoTrade,
    setAutoTrade,
    handleSave
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

    const handleSaveClick = async () => {
        // Validate Auto Trade settings
        if (autoTrade.time <= 0) {
            toast.error("The time must be bigger than 0");
            return;
        }
        if (autoTrade.minPrice > autoTrade.maxPrice) {
            toast.error("Please set price correctly (min price must be less than or equal to max price)");
            return;
        }

        // Validate Manual Trade settings
        let hasError = false;
        manualTrade.rules.forEach((rule, index) => {
            if (rule.percentage <= 0) {
                toast.error(`Rule ${index + 1}: Percentage must be bigger than 0`);
                hasError = true;
            }
            if (rule.setpoint == null || rule.setpoint === undefined || rule.setpoint === "") {
                toast.error(`Rule ${index + 1}: Setpoint can't be null`);
                hasError = true;
            }
        });
        if (hasError) return;

        try {
            await handleSave();
            toast.success("Settings saved successfully");
        } catch (err) {
            console.error(err);
            toast.error("Failed to save settings");
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
                    <button type="button" className="save-btn" onClick={handleSaveClick}>
                        Save
                    </button>
                </div>
            </div>
            {!isStart ? (
                <div style={{height: "600px", display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <button
                        onClick={() => handleStart(true)}
                        className="save-btn"
                    >
                        Start
                    </button>
                </div>
            ) : (
                <div className="tab-content">
                    {mode === "Trading" ? (
                        <div>
                            <AutoTrading autoTrade={autoTrade} setAutoTrade={setAutoTrade} handleSave={handleSave}/>
                            <ManualTrading manualTrade={manualTrade} setManualTrade={setManualTrade} handleSave={handleSave}/>
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    )
}

export default Trading;