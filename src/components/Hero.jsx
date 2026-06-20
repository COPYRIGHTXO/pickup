import { heroTrust, heroCards } from "../data/siteData";

/* ── Small sub-component: one floating match card ── */
function MatchCard({ card }) {
  return (
    <div className={`match-card ${card.cls} comic-outline`}>
      <div className="mc-top">
        <div className="avatar" />
        <div className="score" style={card.scoreStyle}>
          {card.scoreText}
        </div>
      </div>
      <div className="name">{card.name}</div>
      <div className="handle">{card.handle}</div>
      {card.bars.map((b, i) => (
        <div key={i}>
          <div className="bar-row">
            <span>{b.label}</span>
            <span>{b.value}</span>
          </div>
          <div className="bar">
            <i style={{ width: b.width, background: b.color }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Hero() {
  return (
    <header className="hero comic-outline comic-halftone" id="overview">
      <div className="wrap">
        <div className="hero-grid">
          {/* ── Left: copy ── */}
          <div>
            <span
              className="eyebrow comic-text"
              style={{ color: "var(--lime)" }}
            >
              AI campaign intelligence, live
            </span>
            <h1 className="comic-text" style={{ marginTop: 18 }}>
              STOP
              <br />
              <span className="stroke">GUESSING.</span>
              <br />
              <em>START</em> MATCHING.
            </h1>
            <p className="hero-sub">
              PickUP replaces spreadsheets, cold DMs, and guesswork with one
              AI-native workspace — discover creators, verify they&apos;re real,
              forecast ROI before you spend a rupee, and know exactly what
              worked when the campaign ends.
            </p>
            <div className="hero-ctas">
              <a href="#cta" className="btn btn-primary comic-btn">
                Launch demo mode →
              </a>
              <a href="#modules" className="btn btn-ghost comic-btn">
                See the 8 modules
              </a>
            </div>
            <div className="hero-trust">
              {heroTrust.map((t, i) => (
                <div key={i}>
                  <strong>{t.value}</strong>
                  {t.label}
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: floating cards ── */}
          <div className="match-stage">
            {heroCards.map((card) => (
              <MatchCard key={card.cls} card={card} />
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
