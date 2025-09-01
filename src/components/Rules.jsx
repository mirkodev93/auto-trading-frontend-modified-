import React from 'react';
import { useState, useEffect } from 'react';
import "../App.css";
import { toast } from 'react-toastify';

function Rules({ manualTrade, setManualTrade, handleSave }) {
  const [forms, setForms] = useState(manualTrade.rules || []);

  useEffect(() => {
    setForms(manualTrade.rules || []);
  }, [manualTrade.rules]);

  useEffect(() => {
    setManualTrade(prev => ({ ...prev, rules: forms }));
  }, [forms, setManualTrade]);

  const addRule = () => {
    if(forms.at(-1)?.percentage == 0){
      toast.error("Percentage must be bigger than 0");
      return;
    }
    if(forms.at(-1)?.setpoint == null) {
      toast.error("Setpoint can't be null");
      return;
    }
    const nextId = (forms.at?.(-1)?.id ?? forms[forms.length - 1]?.id ?? 0) + 1;
    const newRule = {
      id: nextId,
      setpoint: null,
      side: false,
      percentage: 100,
      isSwapped: false,
    };
    setForms([...forms, newRule]);
    setManualTrade(prev => ({ ...prev, rules: forms }));
  };

  const deleteRule = (id) => {
    setForms(forms.filter(rule => rule.id !== id));
  };

  const handleChange = (id, field, value) => {
    setForms(forms.map(rule => {
      if (rule.id !== id) return rule;
      let v = value;
      if (field === 'side') v = (value === true || value === 'true' || value === 1 || value === '1');
      if (field === 'setpoint' || field === 'percentage') v = Number(value) || 0;
      return { ...rule, [field]: v };
    }));
  };

  const handleManual = (status) => {
    let error = null;
    forms.map(form => {
      if(form.percentage == 0){
        toast.error("Percentage must be bigger than 0");
        error = true;
        return;
      }
      if(form.setpoint == null) {
        toast.error("Setpoint can't be null");
        error = true;
        return;
      }
    })
    if(error) return;
    setManualTrade(prev => ({ ...prev, isEnabled: status }));
    handleSave();
  };

  return (
    <>
      <div className="rules-wrap fancy-card manual-trade">
        {/* Only this list becomes scrollable */}
        <button className="manual-label">Force</button>

        <div className="munual-toggle">
          {manualTrade.isEnabled ?
            <button className="save-btn stop-btn" onClick={() => handleManual(false)}>Stop</button> :
            <button className="save-btn " onClick={() => handleManual(true)}>Start</button>
          }
        </div>

        <div className="rules-scroll" role="region" aria-label="Trading rules">
          {forms.map((r) => (
            <div className="swap-form fancy-card" id={`rule-${r.id}`} key={r.id} style={{ opacity: manualTrade.isEnabled ? "50%" : "" }}>
              <button
                disabled={manualTrade.isEnabled}
                className="delete-button pretty"
                onClick={() => deleteRule(r.id)}
                aria-label={`Delete rule ${r.id}`}
                title="Delete"
              >
                ×
              </button>

              <div className="tick">
                <label>&nbsp;</label>
                <div className="pix">{r.isSwapped ? "✅" : null}</div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Set Point</label>
                  <input
                    type="number"
                    step="any"
                    disabled={manualTrade.isEnabled}
                    className="form-input"
                    placeholder="e.g. 175.20"
                    onChange={(e) => handleChange(r.id, 'setpoint', parseFloat(e.target.value))}
                    value={r.setpoint ?? ""}
                  />
                </div>

                <div className="form-group">
                  <label>Direction</label>
                  <select
                    disabled={manualTrade.isEnabled}
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
                    disabled={manualTrade.isEnabled}
                    className="form-input"
                    value={r.percentage ?? ""}
                    placeholder="e.g. 10"
                    onChange={(e) => handleChange(r.id, 'percentage', parseFloat(e.target.value))}
                  />
                </div>
              </div>
            </div>
          ))}

          {forms.length === 0 && (
            <div className="empty-state" style={{ marginTop: 8 }}>
              No rules yet. Click “Add Rule” to create one.
            </div>
          )}
        </div>

        <div className="panel-actions">
          <button disabled={manualTrade.isEnabled} className="add-button gradient" onClick={addRule}>
            + Add Rule
          </button>
        </div>
      </div>
    </>
  );
}

export default Rules;
