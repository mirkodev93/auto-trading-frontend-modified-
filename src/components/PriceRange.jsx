import React from "react";
import "../App.css";

const PriceRange = () => {
    return (
        <div className="swap-form fancy-card price-range">
            <div className="form-row-inline">
                <label className="form-label-inline">Price Range:</label>

                <label className="form-label-inline">Min</label>
                <input type="number" step="any" className="form-input compact" />

                <label className="form-label-inline">Max</label>
                <input type="number" step="any" className="form-input compact" />
            </div>

            <div className="form-row-inline time-row">
                <label className="form-label-inline">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Time:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
                <input type="number" step="any" className="form-input compact" />
            </div>
        </div>
    );
};

export default PriceRange;
