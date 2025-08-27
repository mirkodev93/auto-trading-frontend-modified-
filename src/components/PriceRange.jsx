import React from "react";
import "../App.css";

const PriceRange = ({ minPrice, setMinPrice, maxPrice, setMaxPrice, time, setTime }) => {
    return (
        <div className="swap-form fancy-card price-range">
            <div className="form-row-inline">
                <label className="form-label-inline">Price Range:</label>

                <label className="form-label-inline">Min</label>
                <input type="number" step="any" className="form-input compact" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />

                <label className="form-label-inline">Max</label>
                <input type="number" step="any" className="form-input compact" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}/>
            </div>

            <div className="form-row-inline time-row">
                <label className="form-label-inline">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Period:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
                <input type="number" step="any" className="form-input compact" value={time} onChange={(e) => setTime(e.target.value)}/>
            </div>
        </div>
    );
};

export default PriceRange;
