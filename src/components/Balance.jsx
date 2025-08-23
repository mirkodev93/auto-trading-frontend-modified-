import React, { useRef, useEffect, useState } from 'react';
import "../lib/api"
import '../App.css';
import { getBalances } from '../lib/api';

function Balance({ price, setPrice, balanceArr, setBalanceArr }) {

    const wsRef = useRef(null);
    const pingRef = useRef(null);
    const retryRef = useRef(0);

    const SYMBOL = "SOL_USDT";
    const WS_URL = "wss://contract.mexc.com/edge";
    const REST_URL = `https://contract.mexc.com/api/v1/contract/ticker?symbol=${SYMBOL}`;

    const fetchPrice = async () => {
        try {
            // Call the REST API endpoint on MEXC
            const res = await fetch(REST_URL, { cache: "no-store" });

            // Parse the response body as JSON
            const data = await res.json();

            // Extract the SOL/USDT price from JSON
            const p = parseFloat(data?.data?.lastPrice);

            // If it's a valid number, update React state
            if (Number.isFinite(p)) setPrice(p.toFixed(2));
        } catch (e) {
            console.warn("REST fallback failed", e);
        }
    };

    // WebSocket setup
    const connectWs = () => {
        const ws = new WebSocket(WS_URL);
        wsRef.current = ws;

        ws.onopen = () => {
            retryRef.current = 0;
            console.log("WebSocket connected");
            ws.send(JSON.stringify({ method: "sub.deal", param: { symbol: SYMBOL } }));

            // send ping every 15s
            pingRef.current = setInterval(() => {
                try {
                    ws.send(JSON.stringify({ method: "ping" }));
                } catch { }
            }, 3000);
        };

        ws.onmessage = (ev) => {
            try {
                const msg = JSON.parse(ev.data);
                if (msg?.channel === "push.deal" && msg?.data) {
                    const p = parseFloat(msg.data.p ?? msg.data.price);
                    if (Number.isFinite(p)) setPrice(p.toFixed(2));
                }
            } catch (e) {
                console.warn("WS message error", e);
            }
        };

        ws.onerror = () => {
            console.warn("WebSocket error");
            ws.close();
        };

        ws.onclose = () => {
            console.warn("WebSocket closed");
            if (pingRef.current) clearInterval(pingRef.current);
            wsRef.current = null;

            // reconnect with backoff
            retryRef.current += 1;
            const delay = Math.min(1000 * 2 ** retryRef.current, 3000);
            setTimeout(connectWs, delay);

            // keep updating price with REST until WS is back
            fetchPrice();
        };
    };

    useEffect(() => {
        connectWs();
        const poll = setInterval(fetchPrice, 5000); // REST backup every 5s
        return () => {
            if (wsRef.current) wsRef.current.close();
            if (pingRef.current) clearInterval(pingRef.current);
            clearInterval(poll);
        };
    }, []);

    useEffect(() => {
        (async () => {
            try {
                const res = await getBalances();
                setBalanceArr(res);
            } catch (error) {
                console.error("Error fetching balances:", error);
            }
        })();
    }, []);

    const total = price * balanceArr[2]?.value + balanceArr[3]?.value;

    return (
        <div className="balance-panel fancy-card">
            <div className="balance-header">
                <div className="balance-title">
                    <span className="live-dot" aria-hidden="true"></span>
                    SOL Price
                </div>
                <div className="total-overlay" title="Total (USDT)">
                    {total.toFixed(2)} USDT
                </div>
            </div>
            <div className="balance-row">
                <div className="balance-price">{price}</div>
                {
                    balanceArr.map((b) => {
                        return <div className="balance-chip">
                            <span className="chip-value">{b.value.toFixed(2)}</span>
                            <div className="balance-col-title">{b.token}</div>
                        </div>
                    })
                }
            </div>
        </div>
    );
}

export default Balance;
