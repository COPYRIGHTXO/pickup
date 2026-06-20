/* InsightsPanel — 6 AI-generated insight cards */
import { insightCards } from '../../data/siteData';

export default function InsightsPanel() {
  return (
    <div className="insight-grid" style={{ gridColumn: '1 / -1' }}>
      {insightCards.map((ins, i) => (
        <div className="insight-card reveal" key={i}>
          <h5>{ins.title}</h5>
          <p>{ins.body}</p>
        </div>
      ))}
    </div>
  );
}
