/* RoiPanel — ROI predictor with 3 scenario cards */
import { useState } from 'react';
import { roiScenarios } from '../../data/siteData';

export default function RoiPanel() {
  const [btnText, setBtnText] = useState('✦ Predict ROI');

  const handleClick = () => {
    setBtnText('✦ Forecasting...');
    setTimeout(() => setBtnText('✦ Predict ROI'), 900);
  };

  return (
    <>
      {/* ── Builder form ── */}
      <div className="brief-card reveal">
        <h4>📈 Campaign Builder</h4>
        <div className="form-row"><label>Creators Selected</label><div className="fake-input">4 creators · 612K combined reach</div></div>
        <div className="form-row"><label>Product Price</label><div className="fake-input">₹1,299</div></div>
        <div className="form-row"><label>Est. Conversion Rate</label><div className="fake-input">1.8%</div></div>
        <button className="run-ai-btn" onClick={handleClick}>{btnText}</button>
      </div>

      {/* ── Scenario cards ── */}
      <div>
        <div className="roi-grid">
          {roiScenarios.map((s, i) => (
            <div className={`scenario-card ${s.cls} reveal`} key={i}>
              <h5>{s.title}</h5>
              <div className="roi-num">{s.num}</div>
              <div className="roi-sub">{s.sub}</div>
            </div>
          ))}
        </div>
        <p style={{ fontFamily: 'var(--mono)', fontSize: 12, opacity: 0.5, marginTop: 18 }}>
          Optimization tip: shifting 20% of budget from static posts to Reels lifts the realistic scenario to ~4.1x based on this creator mix.
        </p>
      </div>
    </>
  );
}
