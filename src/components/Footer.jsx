/* Footer — 4-column grid + bottom bar */
import { footerColumns } from "../siteData";

export default function Footer() {
  return (
    <footer className="comic-outline comic-halftone">
      <div className="wrap">
        <div className="footer-grid">
          {/* ── Brand blurb ── */}
          <div>
            <div className="logo comic-text" style={{ marginBottom: 14 }}>
              <span className="dot" />
              PICKUP
            </div>
            <p
              style={{
                opacity: 0.6,
                fontSize: 14,
                maxWidth: 280,
                lineHeight: 1.6,
              }}
            >
              The AI-native influencer marketing operating system — discovery to
              ROI, in one workspace.
            </p>
          </div>

          {/* ── Link columns ── */}
          {footerColumns.map((col) => (
            <div key={col.title}>
              <h5>{col.title}</h5>
              {col.links.map((l) => (
                <a key={l.label} href={l.href}>
                  {l.label}
                </a>
              ))}
            </div>
          ))}
        </div>

        <div className="footer-bottom">
          <span className="comic-text">
            © 2026 PickUP. All rights reserved.
          </span>
          <span>Built with Claude API · Supabase · Next.js</span>
        </div>
      </div>
    </footer>
  );
}
