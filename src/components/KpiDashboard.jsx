/* KpiDashboard — live stat cards on light background */
import { useScrollReveal } from "../hooks/useScrollReveal";
import SectionHeader from "./ui/SectionHeader";
import { kpis } from "../data/siteData";

export default function KpiDashboard() {
  const ref = useScrollReveal();

  return (
    <section
      className="section-pad light-bg comic-outline comic-halftone"
      ref={ref}
    >
      <div className="wrap">
        <SectionHeader
          tag="EXECUTIVE OVERVIEW"
          title="YOUR CAMPAIGNS,<br/>AT A GLANCE"
          desc="Live KPIs across every active campaign — the dashboard your CMO actually opens every morning."
        />
        <div className="kpi-grid">
          {kpis.map((k, i) => (
            <div className="kpi-card reveal comic-outline" key={i}>
              <div className="kpi-label">{k.label}</div>
              <div className="kpi-val">{k.val}</div>
              <div className={`kpi-delta ${k.type}`}>{k.delta}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
