import React from "react";
import "../App.css";
import Rules from "./Rules";
import PriceRange from "./PriceRange";

export default function TradeModeTabs({
    mode,
    onModeChange,
    rules,
    setRules,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    time,
    setTime,
}) {
    const switchMode = (next) => onModeChange && onModeChange(next);

    return (
        <div className="tabs-wrap fancy-card">
            <div className="tabs">
                <button
                    type="button"
                    className={`tab ${mode === "Manual" ? "active" : ""}`}
                    onClick={() => switchMode("Manual")}
                    aria-pressed={mode === "Manual"}
                >
                    Manual
                </button>
                <button
                    type="button"
                    className={`tab ${mode === "Auto" ? "active" : ""}`}
                    onClick={() => switchMode("Auto")}
                    aria-pressed={mode === "Auto"}
                >
                    Auto
                </button>
            </div>

            <div className="tab-content">
                {mode === "Manual"
                    ? <Rules rules={rules} setRules={setRules} />
                    : (
                        <PriceRange
                            minPrice={minPrice}
                            setMinPrice={setMinPrice}
                            maxPrice={maxPrice}
                            setMaxPrice={setMaxPrice}
                            time={time}
                            setTime={setTime}
                        />
                    )
                }
            </div>
        </div>
    );
}
