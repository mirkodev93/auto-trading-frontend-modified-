import React from 'react';
import "../App.css";

function Rules({ rules, setRules }) {
  const addRule = () => {
    const newRule = {
      id: (rules.at(-1)?.id ?? 0) + 1,
      setpoint: null,
      side: 0,
      percentage: 100
    };
    setRules([...rules, newRule]);
  };

  const deleteRule = (id) => {
    setRules(rules.filter(rule => rule.id !== id));
  };

  const handleChange = (id, field, value) => {
    setRules(rules.map(rule => (rule.id === id ? { ...rule, [field]: value } : rule)));
  };

  return (
    <>
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
                    value={r.side ? 'true' : 'false'}
                    onChange={(e) => handleChange(r.id, 'side', e.target.value === 'true')}
                  >
                    <option value="true">USDT → SOL</option>
                    <option value="false">SOL → USDT</option>
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
    </>
  );
}

export default Rules;
