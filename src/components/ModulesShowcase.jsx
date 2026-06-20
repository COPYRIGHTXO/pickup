/* ModulesShowcase — tab switcher that loads the active panel */
import { useState } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import SectionHeader from './ui/SectionHeader';

import DiscoveryPanel from './modules/DiscoveryPanel';
import FraudPanel from './modules/FraudPanel';
import PipelinePanel from './modules/PipelinePanel';
import RoiPanel from './modules/RoiPanel';
import InsightsPanel from './modules/InsightsPanel';

const tabs = [
  { key: 'discovery', label: 'Discovery', Panel: DiscoveryPanel },
  { key: 'fraud',     label: 'Fraud Detection', Panel: FraudPanel },
  { key: 'pipeline',  label: 'Campaign Management', Panel: PipelinePanel },
  { key: 'roi',       label: 'ROI Predictor', Panel: RoiPanel },
  { key: 'insights',  label: 'AI Insights', Panel: InsightsPanel },
];

export default function ModulesShowcase() {
  const [active, setActive] = useState('discovery');
  const ref = useScrollReveal([active]);
  const { Panel } = tabs.find((t) => t.key === active);

  return (
    <section className="section-pad" id="modules" style={{ background: 'var(--ink-soft)' }} ref={ref}>
      <div className="wrap">
        <SectionHeader
          tag="PRODUCT"
          title="FIVE AI ENGINES.<br/>ONE WORKSPACE."
          desc="Every module below is powered by Claude, returning structured intelligence — not just dashboards, but decisions."
        />

        {/* ── Tab bar ── */}
        <div className="tabbar reveal">
          {tabs.map((t) => (
            <button key={t.key} className={`tabbtn ${active === t.key ? 'active' : ''}`} onClick={() => setActive(t.key)}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Active panel ── */}
        <div className="module-panel active">
          <Panel />
        </div>
      </div>
    </section>
  );
}
