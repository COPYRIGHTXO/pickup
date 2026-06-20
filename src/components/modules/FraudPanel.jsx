/* FraudPanel — creator scan + trust score + red/green flags */
import { useState } from 'react';

export default function FraudPanel() {
  const [btnText, setBtnText] = useState('✦ Run fraud analysis');

  const handleClick = () => {
    setBtnText('✦ Scanning...');
    setTimeout(() => setBtnText('✦ Run fraud analysis'), 900);
  };

  return (
    <>
      {/* ── Scan form ── */}
      <div className="brief-card reveal">
        <h4>🔍 Creator Scan</h4>
        <div className="form-row"><label>Creator Handle</label><div className="fake-input">@growth.guru21</div></div>
        <div className="form-row"><label>Platform</label><div className="fake-input">Instagram</div></div>
        <button className="run-ai-btn" onClick={handleClick}>{btnText}</button>
        <p style={{ fontSize: 12, opacity: 0.5, marginTop: 14, lineHeight: 1.5 }}>
          AI checks follower authenticity, bot ratios, comment quality, and growth pattern anomalies against industry benchmarks.
        </p>
      </div>

      {/* ── Fraud result ── */}
      <div className="fraud-meter-wrap reveal">
        <div className="fraud-score-row">
          <div className="fraud-ring"><span>38</span><small>TRUST</small></div>
          <div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 11, opacity: 0.55, marginBottom: 6 }}>RISK LEVEL: HIGH</div>
            <div className="verdict-pill" style={{ background: '#fbe3df', borderColor: '#c4392b', color: '#c4392b' }}>⚠ Not recommended</div>
          </div>
        </div>
        <div className="flag-grid">
          <div className="flag-box green">
            <h5>Green Flags</h5>
            <ul><li>Consistent posting cadence</li><li>Verified brand partnerships disclosed</li></ul>
          </div>
          <div className="flag-box red">
            <h5>Red Flags</h5>
            <ul><li>62% suspected bot followers</li><li>Sudden 40K follower spike in 9 days</li><li>Comment-to-like ratio far below benchmark</li></ul>
          </div>
        </div>
      </div>
    </>
  );
}
