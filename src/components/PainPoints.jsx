/* PainPoints — problem cards + old-vs-new workflow */
import { useScrollReveal } from '../hooks/useScrollReveal';
import SectionHeader from './ui/SectionHeader';
import { painCards, workflowSteps } from '../data/siteData';

export default function PainPoints() {
  const ref = useScrollReveal();

  return (
    <section className="section-pad" ref={ref}>
      <div className="wrap">
        <SectionHeader
          tag="THE PROBLEM"
          title="FIVE WAYS<br/>CAMPAIGNS<br/>BLEED MONEY"
          desc="Influencer marketing grew up fast and skipped the tooling. Most brands still run six-figure campaigns out of a shared Google Sheet."
        />

        {/* ── Problem cards ── */}
        <div className="pain-grid">
          {painCards.map((c) => (
            <div className="pain-card reveal" key={c.id}>
              <div className="ic">{c.id}</div>
              <h4>{c.title}</h4>
              <p>{c.desc}</p>
            </div>
          ))}
        </div>

        {/* ── Old workflow vs PickUP ── */}
        <div className="reveal" style={{ marginTop: 60 }}>
          <span className="num-tag">THE OLD WAY</span>
          <div className="workflow-old">
            {workflowSteps.map((step, i) => (
              <span key={i}>
                <div className="wf-step">{step}</div>
                {i < workflowSteps.length - 1 && <div className="wf-arrow">→</div>}
              </span>
            ))}
          </div>
          <div className="wf-flip">
            <span className="pickup-pill">⚡ WITH PICKUP</span>
            <span className="arrow-big">→</span>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 13, opacity: 0.7 }}>
              Discover → Validate → Manage → Predict → Optimize, in one workspace
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
