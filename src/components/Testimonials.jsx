/* Testimonials — 3 styled quote cards */
import { useScrollReveal } from '../hooks/useScrollReveal';
import SectionHeader from './ui/SectionHeader';
import { testimonials } from '../data/siteData';

export default function Testimonials() {
  const ref = useScrollReveal();

  return (
    <section className="section-pad" id="testimonials" ref={ref}>
      <div className="wrap">
        <SectionHeader
          tag="CUSTOMERS"
          title="BRANDS THAT<br/>STOPPED GUESSING"
          desc="Marketing teams running leaner campaigns with sharper outcomes."
        />
        <div className="testi-grid">
          {testimonials.map((t, i) => (
            <div className="testi-card reveal" key={i}>
              <div className="testi-quote">{t.quote}</div>
              <div className="testi-person">
                <div className="av" />
                <div><div className="nm">{t.name}</div><div className="rl">{t.role}</div></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
