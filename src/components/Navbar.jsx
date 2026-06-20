/* Navbar — fixed glass-blur top bar */
import { navLinks } from "../data/siteData";

export default function Navbar() {
  return (
    <nav className="comic-outline">
      <div className="logo">
        <span className="dot comic-text" />
        PICKUP
      </div>

      <div className="nav-links">
        {navLinks.map((l) => (
          <a key={l.href} href={l.href}>
            {l.label}
          </a>
        ))}
      </div>

      <div className="nav-cta">
        <a href="#" className="btn btn-ghost comic-btn">
          Sign in
        </a>
        <a href="#cta" className="btn btn-primary comic-btn">
          Get a demo
        </a>
      </div>
    </nav>
  );
}
