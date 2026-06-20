/* MarketOpportunity — chart + stats + comparison table */
import { useEffect, useRef } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import SectionHeader from './ui/SectionHeader';
import { marketChartData, marketYears, marketStats, compareRows } from '../data/siteData';

/* ── Draw SVG bar chart ── */
function drawChart(svg) {
  const data = marketChartData;
  const w = 560, h = 260, pad = 30, maxV = 260;
  const step = (w - pad * 2) / (data.length - 1);
  let bars = '', pts = [];

  data.forEach((v, i) => {
    const x = pad + i * step;
    const barH = (v / maxV) * (h - pad * 2);
    const y = h - pad - barH;
    const last = i === data.length - 1;
    bars += `<rect x="${x - 16}" y="${y}" width="32" height="${barH}" rx="8"
      fill="${last ? 'var(--coral)' : 'rgba(247,239,228,0.15)'}"
      stroke="${last ? '#161019' : 'none'}" stroke-width="2"/>`;
    pts.push(`${x},${y}`);
  });

  svg.innerHTML = bars +
    `<polyline points="${pts.join(' ')}" fill="none" stroke="#C8FF4D"
      stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
}

export default function MarketOpportunity() {
  const ref = useScrollReveal();
  const svgRef = useRef(null);

  useEffect(() => { if (svgRef.current) drawChart(svgRef.current); }, []);

  return (
    <section className="section-pad" id="market" ref={ref}>
      <div className="wrap">
        <SectionHeader
          tag="MARKET OPPORTUNITY"
          title="A $250B INDUSTRY<br/>STILL RUNS ON<br/>GUESSWORK"
          desc="The creator economy is compounding fast — and almost none of the tooling has kept pace with the budget flowing into it."
        />

        {/* ── Chart + stat pills ── */}
        <div className="market-grid">
          <div className="market-chart-card reveal">
            <svg ref={svgRef} viewBox="0 0 560 260" width="100%" style={{ overflow: 'visible' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, fontFamily: 'var(--mono)', fontSize: 11, opacity: 0.55 }}>
              {marketYears.map((y) => <span key={y}>{y}</span>)}
            </div>
          </div>
          <div className="market-stat-stack">
            {marketStats.map((s, i) => (
              <div className={`stat-pill ${s.cls} reveal`} key={i}>
                <div className="big">{s.value}</div>
                <div className="lab">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Comparison table ── */}
        <div className="reveal">
          <span className="num-tag" style={{ marginTop: 60, display: 'block' }}>TRADITIONAL VS PICKUP</span>
          <table className="compare-table">
            <thead><tr><th>Capability</th><th>Traditional Workflow</th><th>PickUP</th></tr></thead>
            <tbody>
              {compareRows.map((r, i) => (
                <tr key={i}>
                  <td>{r.cap}</td>
                  <td className="cell-old"><span className="x">✕</span> {r.old}</td>
                  <td className="cell-new"><span className="tick">✓</span> {r.new}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
