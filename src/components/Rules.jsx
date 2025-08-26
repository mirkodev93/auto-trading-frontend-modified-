import React, { useEffect } from 'react';
import "../App.css";
import { getRules, createRule, clearRules } from "../lib/api.js";

function Rules({ rules, setRules }) {
  useEffect(() => {
    (async () => {
      try {
        const fetchedRules = await getRules();
        setRules(fetchedRules);
      } catch (error) {
        console.error("Error fetching rules:", error);
      }
    })();
  }, [setRules]);

  const addRule = () => {
    const newRule = {
      id: (rules.at(-1)?.id ?? 0) + 1,
      setpoint: null,
      side: 0,
      percentage: null
    };
    setRules([...rules, newRule]);
  };

  const deleteRule = (id) => {
    setRules(rules.filter(rule => rule.id !== id));
  };

  const handleChange = (id, field, value) => {
    setRules(rules.map(rule => (rule.id === id ? { ...rule, [field]: value } : rule)));
  };

  const saveRule = () => {
    (async () => {
      try {
        const _rules = rules;
        await clearRules();
        for (const r of _rules) {
          await createRule(r);
        }
      } catch (error) {
        console.error("Error saving rules:", error);
      }
    })();
  };

  return (
    <div className="rules-wrap">
      {/* Only this list becomes scrollable */}
      <div className="rules-scroll" role="region" aria-label="Trading rules">
        {rules.map((r) => (
          <div className="swap-form fancy-card" id={`rule-${r.id}`} key={r.id}>
            <button
              className="delete-button pretty"
              onClick={() => deleteRule(r.id)}
              aria-label={`Delete rule ${r.id}`}
              title="Delete"
            >
              ×
            </button>

            <div className="form-row">
              <div className="form-group">
                <label>Set Point</label>
                <input
                  type="number"
                  step="any"
                  className="form-input"
                  placeholder="e.g. 175.20"
                  onChange={(e) => handleChange(r.id, 'setpoint', parseFloat(e.target.value))}
                  value={r.setpoint ?? ""}
                />
              </div>

              <div className="form-group">
                <label>Direction</label>
                <select
                  className="form-input"
                  value={r.side ? 1 : 0}
                  onChange={(e) => handleChange(r.id, 'side', parseInt(e.target.value))}
                >
                  <option value={0}>USDT → SOL</option>
                  <option value={1}>SOL → USDT</option>
                </select>
              </div>

              <div className="form-group">
                <label>Percentage</label>
                <input
                  type="number"
                  step="any"
                  className="form-input"
                  value={r.percentage ?? ""}
                  placeholder="e.g. 10"
                  onChange={(e) => handleChange(r.id, 'percentage', parseFloat(e.target.value))}
                />
              </div>
            </div>
          </div>
        ))}

        {rules.length === 0 && (
          <div className="empty-state" style={{ marginTop: 8 }}>
            No rules yet. Click “Add Rule” to create one.
          </div>
        )}
      </div>
      
      <div className="panel-actions">
        <button className="add-button gradient" onClick={addRule}>
          + Add Rule
        </button>
      </div>
    </div>
  );
}

export default Rules;
