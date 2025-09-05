import React, { useState } from 'react';
import "../App.css";
import { executeSwap } from '../lib/api';
import { toast } from 'react-toastify';

const SwapTrading = () => {
    const [direction, setDirection] = useState("true");
    const [percentage, setPercentage] = useState(100);

    const handleSwap = async () => {
        try {
            await executeSwap(direction, percentage);
            toast.success("Swap executed successfully");
        }
        catch (e) {
            toast.error("Failed to swap");
        }
    }

    return (
        <>
            <div className="fancy-card manual-trade">
                <button className="manual-label">Swap</button>
                <div className="auto-toggle">
                    <button
                        className="save-btn"
                        onClick={handleSwap}
                    >
                        Swap
                    </button>
                </div>

                <div className="swap-form">
                    <label>Direction</label>
                    <select
                        className="form-input"
                        value={direction}
                        onChange={(e) => setDirection(e.target.value)}
                    >
                        <option value="true">USDT → SOL</option>
                        <option value="false">SOL → USDT</option>
                    </select>

                    <label>Percentage</label>
                    <input
                        type="number"
                        step="any"
                        className="form-input"
                        placeholder="e.g. 10"
                        value={percentage}
                        onChange={(e) => setPercentage(e.target.value)}
                    />
                </div>
            </div>
        </>
    );
}

export default SwapTrading;
