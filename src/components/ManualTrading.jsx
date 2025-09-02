import React from 'react';
import { useState, useEffect, useRef } from 'react';
import "../App.css";
import { toast } from 'react-toastify';

const Rules = ({ manualTrade, setManualTrade, handleSave }) => {
  const [forms, setForms] = useState(manualTrade.rules || []);
  const shouldSaveRef = useRef(false);

  useEffect(() => {
    setForms(manualTrade.rules || []);
  }, [manualTrade.rules]);

  useEffect(() => {
    setManualTrade(prev => ({ ...prev, rules: forms }));
  }, [forms, setManualTrade]);

  // Save to database when isEnabled changes
  useEffect(() => {
    if (shouldSaveRef.current) {
      handleSave();
      shouldSaveRef.current = false;
    }
  }, [manualTrade.isEnabled, handleSave]);

  const addRule = () => {
    if (forms.length > 0) {
      if(forms.at(-1)?.percentage == 0){
        toast.error("Percentage must be bigger than 0");
        return;
      }
      if(forms.at(-1)?.setpoint == null) {
        toast.error("Setpoint can't be null");
        return;
      }
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
      if (field === 'setpoint' || field === 'percentage') {
        if (value === '' || value === null || value === undefined) {
          v = null;
        } else {
          const numValue = Number(value);
          v = isNaN(numValue) ? null : numValue;
        }
      }
      return { ...rule, [field]: v };
    }));
  };

  const handleManual = async (status) => {
    let error = null;
    forms.map((form, index) => {
      if(form.percentage == 0){
        toast.error(`Rule ${index + 1}: Percentage must be bigger than 0`);
        error = true;
        return;
      }
      if(form.setpoint == null) {
        toast.error(`Rule ${index + 1}: Setpoint can't be null`);
        error = true;
        return;
      }
    })
    if(error) return;
    
    shouldSaveRef.current = true;
    setManualTrade(prev => ({ ...prev, isEnabled: status }));
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
                    onChange={(e) => handleChange(r.id, 'setpoint', e.target.value)}
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
                    onChange={(e) => handleChange(r.id, 'percentage', e.target.value)}
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
