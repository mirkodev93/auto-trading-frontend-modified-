import React from "react";
import "../App.css";

function Token({ selectedToken = "sol", setSelectedToken }) {
    const handleChange = (e) => {
        setSelectedToken?.(e.target.value);
    };

    return (
        <>
            <div className="swap-form token-form">
                <div className="form-group">
                    {/* <label>Token</label> */}
                    <select
                        className="form-input"
                        value={selectedToken}
                        onChange={handleChange}
                    >
                        <option value={"eth"}>ETH</option>
                        <option value={"sol"}>SOL</option>
                        <option value={"xrp"}>XRP</option>
                    </select>
                </div>
            </div>
        </>
    );
}

export default Token;
