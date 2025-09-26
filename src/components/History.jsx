import React, { useEffect, useMemo, useState } from 'react';
import { getHistories, clearHistories } from '../lib/api';
import "../App.css";

const History = ({ histories, setHistories }) => {
  const [expanded, setExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [pendingQuery, setPendingQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getHistories();
        setHistories(data);
      } catch (e) {
        console.error("Failed to fetch histories", e);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const prev = document.body.style.overflow;
    if (expanded) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = prev || '';
    return () => { document.body.style.overflow = prev || ''; };
  }, [expanded]);

  const handleToggleExpand = () => setExpanded((e) => !e);

  const handleClear = async () => {
    try {
      const fetchData = async () => {
        try {
          const data = await clearHistories();
          setHistories([]);
        } catch (e) {
          console.error("Failed to clear histories", e);
        }
      };
      fetchData();
    } catch (e) {
      console.error("Failed to clear history", e);
    }
  };

  const applySearch = () => {
    setSearchQuery(pendingQuery.trim());
  };

  const onKeyDownSearch = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      applySearch();
    }
  };

  const filteredHistories = useMemo(() => {
    const q = searchQuery.toLowerCase();
    if (!q) return histories;
    return histories.filter((entry) => {
      try {
        const s = [
          entry.time,
          entry.swapmode ? "sol->usdt" : "usdt->sol",
          entry.changed_price,
          entry.changed_sol,
          entry.changed_usdt,
          entry.total,
          entry.fee,
          ...(Array.isArray(entry.balance)
            ? entry.balance.flatMap(b => [b?.token, b?.value])
            : [])
        ].join(" ").toLowerCase();
        return s.includes(q);
      } catch {
        return false;
      }
    });
  }, [histories, searchQuery]);

  return (
    <div className={`trade-history${expanded ? ' expanded' : ''}`}>
      <div className="history-header">
        <h4>Trade History</h4>

        <div className="history-actions">
          {expanded && (
            <>
              <input
                className="form-input history-search-input"
                type="text"
                value={pendingQuery}
                onChange={(e) => setPendingQuery(e.target.value)}
                onKeyDown={onKeyDownSearch}
              />
              <button
                className="history-btn primary"
                onClick={applySearch}
                title="Filter by query"
              >
                Search
              </button>
            </>
          )}

          <button
            className={`history-btn ${expanded ? '' : 'primary'}`}
            onClick={handleToggleExpand}
          >
            {expanded ? 'Close' : 'Show detail'}
          </button>

          <button
            className="history-btn danger"
            onClick={handleClear}
            title="Remove all history entries (local list)"
          >
            Clear History
          </button>
        </div>
      </div>

      <div className="trade-log">
        {(filteredHistories.length ? filteredHistories : []).map((entry, index) => {
          const pastEntry = filteredHistories[index + 1];
          const changedUsdt = Math.abs(entry.changed_usdt).toFixed(2);
          const changedSol = Math.abs(entry.changed_sol).toFixed(6);
          const changedPrice = entry.changed_price.toFixed(2);
          const message = entry.message || '';
          const solBalance = (entry.balance?.find(b => b?.token === "sol")?.value ?? 0).toFixed(6);
          const usdtBalance = (entry.balance?.find(b => b?.token === "usdt")?.value ?? 0).toFixed(2);
          const pastSolBalance = (pastEntry?.balance?.find(b => b?.token === "sol")?.value ?? 0).toFixed(6);
          const pastUsdtBalance = (pastEntry?.balance?.find(b => b?.token === "usdt")?.value ?? 0).toFixed(2);
          const actualPrice = Math.abs((parseFloat(usdtBalance) - parseFloat(pastUsdtBalance)) / (parseFloat(solBalance) - parseFloat(pastSolBalance))).toFixed(2);
          const total = entry.total?.toFixed?.(2) ?? "0.00";
          const fee = entry.fee?.toFixed?.(2) ?? "0.00";
          const actionClass = expanded ? "trade-action-expanded" : "trade-action";

          return (
            <div className="trade-entry" key={index}>
              <div className="trade-time">{entry.time}</div>
              {entry.swapmode ? (
                <div className={actionClass}>
                  <span>[{message}]</span>
                  <span>At {`${actualPrice}(${changedPrice})`}, Swapped {changedUsdt} USDT to {changedSol} SOL</span>
                  <span>New balance: {solBalance}({changedSol}) SOL</span>
                  <span>{usdtBalance} USDT</span>
                  <span>total: {total}, fee: {fee}</span>
                </div>
              ) : (
                <div className={actionClass}>
                  <span>[{message}]</span>
                  <span>At {`${actualPrice}(${changedPrice})`}, Swapped {changedSol} SOL to {changedUsdt} USDT</span>
                  <span>New balance: {solBalance} SOL</span>
                  <span>{usdtBalance}({changedUsdt}) USDT</span>
                  <span>total: {total}, fee: {fee}</span>
                </div>
              )}
            </div>
          );
        })}
        {filteredHistories.length === 0 && (
          <div className="empty-state" style={{ marginTop: 8 }}>
            No trades match “{searchQuery}”.
          </div>
        )}
      </div>
    </div>
  );
}

export default History;
