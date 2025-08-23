import React from 'react';
import { useEffect, useState } from 'react';
import { getHistories } from '../lib/api';
import "../App.css";

function History({ histories, setHistories }) {
    useEffect(() => {
        const fetchData = async () => {
            const data = await getHistories();
            setHistories(data);
        };
        fetchData();
    }, []);

    return (
        <div className="trade-history">
            <h4>Trade History</h4>
            <div className="trade-log">
                {
                    histories.map((entry, index) => (
                        <div className="trade-entry" key={index}>
                            <div className="trade-time">{entry.time}</div>
                            {
                                entry.swapmode ? <div className="trade-action">Swapped {Math.abs(entry.changed_usdt).toFixed(2)} USDT to {Math.abs(entry.changed_sol).toFixed(2)} SOL at {entry.changed_price.toFixed(2)}, current balance: {entry.balance[2].value.toFixed(2)} SOL, {entry.balance[3].value.toFixed(2)} USDT, total: {entry.total.toFixed(2)}, fee: {entry.fee.toFixed(2)}</div> : <div className="trade-action">Swapped {Math.abs(entry.changed_sol).toFixed(2)} SOL to {Math.abs(entry.changed_usdt).toFixed(2)} USDT at {entry.changed_price.toFixed(2)}, current balance: {entry.balance[2].value.toFixed(2)} SOL, {entry.balance[3].value.toFixed(2)} USDT, total: {entry.total.toFixed(2)}, fee: {entry.fee.toFixed(2)} </div>
                            }
                        </div>
                    ))}
            </div>
        </div>
    );
}

export default History;
