import React, { useEffect } from 'react';
import '../App.css';
import { getBalances } from '../lib/api';

const Balance = ({ price, setPrice, balanceArr, setBalanceArr, selectedToken = "sol" }) => {
    useEffect(() => {
        const fetchBalances = async () => {
            try {
                const res = await getBalances();
                setBalanceArr(res);
            } catch (error) {
                console.error("Error fetching balances:", error);
            }
        };
        fetchBalances();
    }, []);

    const solItem = balanceArr.find(b => String(b?.token).toLowerCase() === selectedToken.toLowerCase());
    const usdtItem = balanceArr.find(b => String(b?.token).toLowerCase() === "usdt");

    const sol = Number(solItem?.value) || 0;
    const usdt = Number(usdtItem?.value) || 0;
    const px = Number(price) || 0;

    const total = sol * px + usdt;
    const wanted = new Set([selectedToken?.toLowerCase(), 'usdt']);
    const visibleBalances = balanceArr.filter(
        (b) => b && wanted.has(String(b.token).toLowerCase())
    ).sort((a, b) => {
        const aKey = String(a.token).toLowerCase();
        const bKey = String(b.token).toLowerCase();
        if (aKey === selectedToken && bKey === 'usdt') return -1;
        if (aKey === 'usdt' && bKey === selectedToken) return 1;
        return 0;
    });

    return (
        <div className="balance-panel fancy-card">
            <div className="balance-header">
                <div className="balance-title">
                    <span className="live-dot" aria-hidden="true"></span>
                    Current Price
                </div>
            </div>

            {/* Second line: four columns */}
            <div className="balance-line">
                <div className="col price-col">{Number(price).toFixed(2)}</div>
                {visibleBalances.map((b, i) => (
                    <div className="col token-col fancy-card" key={b?.token ?? i}>
                        <span className="chip-value">{(b?.value ?? 0).toFixed(b.token === 'sol' ? 6 : 2)}</span>
                        <span className="balance-col-title">{(b?.token ?? '—').toUpperCase()}</span>
                    </div>
                ))}
                <div className="col total-col fancy-card">
                    Total: {Number.isFinite(total) ? total.toFixed(2) : '—'} USDT
                </div>
            </div>
        </div>
    );
}

export default Balance;
