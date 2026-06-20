/* DiscoveryPanel — campaign brief + AI-matched creator results */
import { useState } from 'react';
import { discoveryCreators } from '../../data/siteData';

export default function DiscoveryPanel() {
  const [btnText, setBtnText] = useState('✦ Find matching creators');

  const handleClick = () => {
    setBtnText('✦ Matching...');
    setTimeout(() => setBtnText('✦ Find matching creators'), 900);
  };

  return (
    <>
      {/* ── Brief form ── */}
      <div className="brief-card reveal">
        <h4>🎯 Campaign Brief</h4>
        <FormRow label="Product Category" value="Skincare — clean beauty" />
        <FormRow label="Target Audience" value="Women, 22–34, urban India" />
        <FormRow label="Budget" value="₹6,00,000" />
        <FormRow label="Platform" value="Instagram Reels + YouTube Shorts" />
        <button className="run-ai-btn" onClick={handleClick}>{btnText}</button>
      </div>

      {/* ── Creator results ── */}
      <div className="result-stack">
        {discoveryCreators.map((c, i) => (
          <div className="creator-result reveal" key={i}>
            <div className="av" style={{ background: c.gradient }} />
            <div>
              <div className="nm">{c.name}</div>
              <div className="hd">{c.handle}</div>
              <div className="tags">{c.tags.map((t, j) => <span key={j}>{t}</span>)}</div>
            </div>
            <div className="match-badge">{c.score}<small>MATCH</small></div>
          </div>
        ))}
      </div>
    </>
  );
}

/* tiny helper — avoids repeating form markup */
function FormRow({ label, value }) {
  return (
    <div className="form-row">
      <label>{label}</label>
      <div className="fake-input">{value}</div>
    </div>
  );
}
