import { useScrollReveal } from '../hooks/useScrollReveal';

export default function FinalCta() {
  const sectionRef = useScrollReveal();

  return (
    <section className="section-pad" id="cta" ref={sectionRef}>
      <div className="final-cta reveal">
        <span className="eyebrow" style={{ color: 'var(--ink)' }}>
          No credit card · Demo mode included
        </span>
        <h2>READY TO<br />PICK UP?</h2>
        <p>
          Drop into Demo Mode and explore every module — discovery, fraud detection,
          ROI prediction, and AI insights — pre-loaded with sample campaigns.
        </p>
        <a href="#" className="btn btn-primary">Launch Demo Mode →</a>
      </div>
    </section>
  );
}
