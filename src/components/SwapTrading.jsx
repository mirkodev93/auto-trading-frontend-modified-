import React, { useState, useEffect } from 'react';
import "../App.css";
import { executeSwap } from '../lib/api';
import { toast } from 'react-toastify';

const SwapTrading = ({ price, balanceArr }) => {
    const [direction, setDirection] = useState("true");
    const [percentage, setPercentage] = useState(100);
    const [usdtAmount, setUsdtAmount] = useState(0);
    const [solAmount, setSolAmount] = useState(0);
    const [isManualUsdtEdit, setIsManualUsdtEdit] = useState(false);
    const [isManualSolEdit, setIsManualSolEdit] = useState(false);

    // Get current price and USDT balance from props
    const currentPrice = Number(price) || 0;
    const usdtItem = balanceArr?.find(b => String(b?.token).toLowerCase() === "usdt");
    const solItem = balanceArr?.find(b => String(b?.token).toLowerCase() === "sol");
    const totalUsdt = Number(usdtItem?.value) || 0;
    const totalSol = Number(solItem?.value) || 0;

    // Calculate amounts based on percentage and direction
    useEffect(() => {
        const calculateAmounts = () => {
            const percentageValue = parseFloat(percentage) || 0;

            if (direction === "true") { // USDT → SOL
                if (!isManualUsdtEdit) {
                    // Calculate USDT amount from percentage
                    const usdtToSwap = (percentageValue / 100) * totalUsdt;
                    const solToReceive = usdtToSwap / currentPrice;
                    setUsdtAmount(usdtToSwap);
                    setSolAmount(solToReceive);
                } else {
                    // Calculate SOL amount from current USDT amount
                    const solToReceive = usdtAmount / currentPrice;
                    setSolAmount(solToReceive);
                }
            } else { // SOL → USDT
                if (!isManualSolEdit) {
                    // Calculate SOL amount from percentage
                    const solToSwap = (percentageValue / 100) * totalSol;
                    const usdtToReceive = solToSwap * currentPrice;
                    setSolAmount(solToSwap);
                    setUsdtAmount(usdtToReceive);
                } else {
                    // Calculate USDT amount from current SOL amount
                    const usdtToReceive = solAmount * currentPrice;
                    setUsdtAmount(usdtToReceive);
                }
            }
        };

        calculateAmounts();
    }, [percentage, direction, currentPrice, totalUsdt, totalSol, usdtAmount, solAmount, isManualUsdtEdit, isManualSolEdit]);

    // Reset manual edit flags when direction changes
    useEffect(() => {
        setIsManualUsdtEdit(false);
        setIsManualSolEdit(false);
    }, [direction]);

    // Handle percentage change
    const handlePercentageChange = (e) => {
        setIsManualUsdtEdit(false);
        setIsManualSolEdit(false);
        setPercentage(e.target.value);
    };

    // Handle USDT amount change (only for USDT -> SOL direction)
    const handleUsdtAmountChange = (e) => {
        if (direction === "true") {
            const newUsdtAmount = parseFloat(e.target.value) || 0;
            setUsdtAmount(newUsdtAmount);
            setIsManualUsdtEdit(true);

            // Calculate percentage based on USDT amount
            if (totalUsdt > 0) {
                const newPercentage = (newUsdtAmount / totalUsdt) * 100;
                setPercentage(newPercentage.toFixed(2));
            } else {
                // If total USDT is 0, set percentage to 0
                setPercentage("0");
            }
        }
    };

    // Handle SOL amount change (only for SOL -> USDT direction)
    const handleSolAmountChange = (e) => {
        if (direction === "false") {
            const newSolAmount = parseFloat(e.target.value) || 0;
            setSolAmount(newSolAmount);
            setIsManualSolEdit(true);

            // Calculate percentage based on SOL amount
            if (totalSol > 0) {
                const newPercentage = (newSolAmount / totalSol) * 100;
                setPercentage(newPercentage.toFixed(2));
            } else {
                // If total SOL is 0, set percentage to 0
                setPercentage("0");
            }
        }
    };

    const handleSwap = async () => {
        // Create confirmation message based on direction
        const directionText = direction === "true" ? "USDT → SOL" : "SOL → USDT";
        const fromAmount = direction === "true" ? `${usdtAmount.toFixed(2)} USDT` : `${solAmount.toFixed(4)} SOL`;
        const toAmount = direction === "true" ? `${solAmount.toFixed(4)} SOL` : `${usdtAmount.toFixed(2)} USDT`;

        const confirmMessage = `Are you sure you want to swap?\n\n${directionText}\n${fromAmount} → ${toAmount}`;

        if (window.confirm(confirmMessage)) {
            try {
                await executeSwap(direction, percentage);
                toast.success("Swap executed successfully");
            }
            catch (e) {
                toast.error("Failed to swap");
            }
        }
    }

    return (
        <>
            <div className="fancy-card manual-trade">
                <button className="manual-label">Swap</button>

                <div>
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
                            onChange={handlePercentageChange}
                        />
                    </div>
                    <div className="swap-form">
                        {direction === "true" ? (
                            <>
                                <input
                                    type="number"
                                    step="any"
                                    className="form-input"
                                    placeholder="e.g. 100"
                                    value={usdtAmount}
                                    onChange={handleUsdtAmountChange}
                                />
                                <label>USDT</label>
                                <label>{" => "}</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    placeholder="e.g. 10"
                                    value={solAmount.toFixed(4)}
                                    readOnly={true}
                                />
                                <label>SOL</label>
                            </>
                        ) : (
                            <>
                                <input
                                    type="number"
                                    step="any"
                                    className="form-input"
                                    placeholder="e.g. 10"
                                    value={solAmount}
                                    onChange={handleSolAmountChange}
                                />
                                <label>SOL</label>
                                <label>{" => "}</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    placeholder="e.g. 100"
                                    value={usdtAmount.toFixed(2)}
                                    readOnly={true}
                                />
                                <label>USDT</label>
                            </>
                        )}

                        <button
                            className="save-btn"
                            onClick={handleSwap}
                        >
                            Swap
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SwapTrading;
