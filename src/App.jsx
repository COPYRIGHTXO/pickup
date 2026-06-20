import { useEffect, useMemo, useState, useCallback } from 'react';
import { useApi, postApi } from './hooks/useApi';

/* ── Static fallback data (used while API loads) ── */
const fallbackCreators = [
  { name: 'Maya Iyer', handle: '@mayaeats', niche: 'Food + Lifestyle', platform: 'Instagram', followers: '482K', engagement: '7.2%', match: 98, authenticity: 96, cost: '$9,400', region: 'Mumbai', costNum: 9400 },
  { name: 'Rohan Verma', handle: '@rohanlifts', niche: 'Fitness', platform: 'YouTube', followers: '310K', engagement: '6.4%', match: 91, authenticity: 94, cost: '$7,800', region: 'Delhi', costNum: 7800 },
  { name: 'Ananya Rao', handle: '@ananyaskin', niche: 'Clean Beauty', platform: 'TikTok', followers: '615K', engagement: '8.1%', match: 97, authenticity: 95, cost: '$12,200', region: 'Mumbai', costNum: 12200 },
  { name: 'Kavya Menon', handle: '@glowwithkavya', niche: 'Skincare', platform: 'Instagram', followers: '184K', engagement: '9.3%', match: 93, authenticity: 98, cost: '$5,600', region: 'Bangalore', costNum: 5600 },
];

function parseCost(cost, costNum) {
  if (costNum) return costNum;
  if (typeof cost === 'number') return cost;
  return Number(String(cost).replace(/[^0-9.]/g, '')) || 0;
}

const fallbackCampaigns = [
  { name: 'Glow Serum Launch', status: 'Active', budget: '$72K', creators: 12, roi: '3.8x', due: 'Jun 28' },
  { name: 'FlexFuel Summer', status: 'Negotiating', budget: '$48K', creators: 7, roi: '2.6x', due: 'Jul 04' },
  { name: 'Loop Apparel Drop', status: 'Reporting', budget: '$96K', creators: 18, roi: '4.9x', due: 'Done' },
];

const fallbackRoutes = [
  { path: '/', label: 'Home' },
  { path: '/creator-discovery', label: 'Creator Discovery' },
  { path: '/fraud-detection', label: 'Fraud Detection' },
  { path: '/campaign-management', label: 'Campaigns' },
  { path: '/roi-predictor', label: 'ROI Predictor' },
  { path: '/contact', label: 'Contact' },
  { path: '/settings', label: 'Settings' },
];

/* ── Routing helpers ── */

function pushRoute(path) {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function usePath() {
  const [path, setPath] = useState(window.location.pathname);
  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  return path;
}

/* ── Shared UI components ── */

function LoadingSkeleton({ lines = 3 }) {
  return (
    <div className="loading-skeleton">
      {Array.from({ length: lines }, (_, i) => (
        <div key={i} className="skeleton-line" style={{ width: `${80 - i * 15}%`, animationDelay: `${i * 0.1}s` }} />
      ))}
    </div>
  );
}

function SiteNav() {
  const path = usePath();
  return (
    <nav className="site-nav">
      <button className="logo nav-logo" onClick={() => pushRoute('/')}>
        <span className="dot" />PICKUP
      </button>
      <div className="nav-links product-nav-links">
        {fallbackRoutes.map((route) => (
          <button className={path === route.path ? 'active' : ''} key={route.path} onClick={() => pushRoute(route.path)}>
            {route.label}
          </button>
        ))}
      </div>
      <button className="btn btn-primary nav-demo" onClick={() => pushRoute('/contact')}>Book demo</button>
    </nav>
  );
}

function PageShell({ children }) {
  return (
    <>
      <SiteNav />
      <main className="page-shell">{children}</main>
      <Footer />
    </>
  );
}

function Footer() {
  return (
    <footer className="product-footer">
      <div className="wrap footer-bottom">
        <span>PickUP - AI campaign intelligence for modern brands.</span>
        <span>Discovery | Fraud Detection | Campaigns | ROI</span>
      </div>
    </footer>
  );
}

function PageHero({ eyebrow, title, body, children, ctaLeft, ctaRight }) {
  return (
    <section className="product-hero">
      <div className="wrap product-hero-grid">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="hero-sub">{body}</p>
          <div className="hero-ctas">
            {ctaLeft || <button className="btn btn-primary" onClick={() => pushRoute('/creator-discovery')}>Explore creators</button>}
            {ctaRight || <button className="btn btn-ghost" onClick={() => pushRoute('/roi-predictor')}>Predict ROI</button>}
          </div>
        </div>
        {children}
      </div>
    </section>
  );
}

function Card({ children, className = '', onClick }) {
  return <article className={`product-card ${className}`} onClick={onClick}>{children}</article>;
}

function Metric({ value, label }) {
  return (
    <Card className="metric-tile">
      <strong>{value}</strong>
      <span>{label}</span>
    </Card>
  );
}

function Progress({ value, color }) {
  return (
    <div className="progress-track">
      <i style={{ width: `${value}%`, ...(color && { background: color }) }} />
    </div>
  );
}

function StatusBadge({ status }) {
  const cls = status === 'Active' ? 'status-active' : status === 'Negotiating' ? 'status-warn' : status === 'Reporting' ? 'status-done' : 'status-default';
  return <span className={`status-badge ${cls}`}>{status}</span>;
}

function Toggle({ label, checked, onChange }) {
  return (
    <label className="toggle-row">
      <span>{label}</span>
      <div className={`toggle-switch ${checked ? 'on' : ''}`} onClick={() => onChange(!checked)}>
        <div className="toggle-thumb" />
      </div>
    </label>
  );
}

/* ═══════════════════════════════════════════════════════
   HOME PAGE — expanded with more content
   ═══════════════════════════════════════════════════════ */

function HomePage() {
  const { data: campaignData } = useApi('/api/campaigns', { fallback: null });
  const campaigns = campaignData?.campaigns || fallbackCampaigns;

  return (
    <PageShell>
      {/* Hero */}
      <PageHero
        eyebrow="AI-powered campaign intelligence"
        title="Discover, verify, manage, and forecast creator campaigns."
        body="PickUP turns creator marketing from a spreadsheet-heavy guessing game into a connected workspace for finding the right influencers, avoiding fraud, launching campaigns, and proving ROI."
      >
        <div className="hero-console">
          <div className="console-head"><span>Live campaign health</span><strong>87/100</strong></div>
          {campaigns.map((campaign) => (
            <div className="console-row" key={campaign.name}>
              <span>{campaign.name}</span>
              <strong>{campaign.roi}</strong>
            </div>
          ))}
        </div>
      </PageHero>

      {/* KPI strip */}
      <section className="wrap page-section">
        <div className="metric-strip">
          <Metric value="12.4K" label="Creators indexed" />
          <Metric value="94.2%" label="Fraud accuracy" />
          <Metric value="3.6x" label="Avg ROAS forecast" />
          <Metric value="48 hrs" label="Campaign setup" />
        </div>
      </section>

      {/* How it works */}
      <section className="wrap page-section">
        <div className="home-section-header">
          <p className="eyebrow">How it works</p>
          <h2>Four steps from brief to proven ROI.</h2>
          <p className="page-copy">PickUP replaces disconnected tools with one intelligent workflow. Every step feeds data into the next — so decisions compound, not fragment.</p>
        </div>
        <div className="steps-grid">
          {[
            { num: '01', title: 'Discover', desc: 'Enter your campaign brief — category, audience, budget, region. PickUP returns a ranked shortlist of creators scored on engagement, authenticity, and brand fit.', icon: '🔍' },
            { num: '02', title: 'Verify', desc: 'Before you sign anyone, run a fraud scan. PickUP checks bot ratios, suspicious engagement spikes, comment quality, and follower authenticity.', icon: '🛡️' },
            { num: '03', title: 'Launch', desc: 'Move creators through your pipeline — outreach, negotiation, approval, live — with deliverable tracking, timeline management, and payment coordination.', icon: '🚀' },
            { num: '04', title: 'Measure', desc: 'Model ROI before launch with three scenarios. After the campaign, get AI-generated performance reports with optimization recommendations for the next wave.', icon: '📊' },
          ].map((step) => (
            <div className="step-card" key={step.num}>
              <div className="step-num">{step.num}</div>
              <div className="step-icon">{step.icon}</div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About the platform */}
      <section className="wrap page-section">
        <div className="home-about-grid">
          <div className="home-section-header">
            <p className="eyebrow">What is PickUP</p>
            <h2>One workspace for the entire creator campaign lifecycle.</h2>
            <p className="page-copy">PickUP is built for brand marketing teams, growth leads, and agencies who run influencer programs at scale. Instead of juggling spreadsheets, DMs, and disconnected analytics tools, you get a single platform that connects discovery, vetting, execution, and measurement.</p>
          </div>
          <div className="home-about-cards">
            {[
              { title: 'For brand teams', desc: 'Launch product drops, seasonal campaigns, and always-on creator programs with confidence.', icon: '🏷️' },
              { title: 'For growth leads', desc: 'Forecast ROI before budget approval, track pipeline health, and prove impact to leadership.', icon: '📈' },
              { title: 'For agencies', desc: 'Manage multiple brand workspaces, share fraud reports, and deliver post-campaign intelligence faster.', icon: '🤝' },
            ].map((item) => (
              <div className="home-about-card" key={item.title}>
                <span className="home-about-icon">{item.icon}</span>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Before vs After comparison */}
      <section className="wrap page-section">
        <div className="home-section-header">
          <p className="eyebrow">Why PickUP</p>
          <h2>What changes when you switch.</h2>
          <p className="page-copy">See how each part of your creator workflow improves — side by side.</p>
        </div>
        <div className="home-compare-shell">
          <div className="home-compare-headers">
            <div className="home-compare-col-label">Capability</div>
            <div className="home-compare-col-label home-compare-col-old">Without PickUP</div>
            <div className="home-compare-col-label home-compare-col-new">With PickUP</div>
          </div>
          {[
            ['Discovery', 'Manual hashtag search, 2+ weeks', 'AI-matched shortlist in minutes'],
            ['Fraud Prevention', 'Eyeball follower counts', 'Automated authenticity scoring'],
            ['Campaign Tracking', 'Shared spreadsheets across 5 tabs', 'Visual pipeline, single source of truth'],
            ['ROI Forecasting', 'None — find out at the end', 'Modeled before launch, 3 scenarios'],
            ['Analytics', 'Fragmented across 4–5 tools', 'Unified dashboard, AI-generated insights'],
            ['Launch Speed', '3–4 weeks average', 'Under 48 hours'],
          ].map(([cap, old, fresh]) => (
            <div className="home-compare-row" key={cap}>
              <div className="compare-cap">{cap}</div>
              <div className="compare-old"><span className="compare-badge compare-badge-no">✗</span>{old}</div>
              <div className="compare-new"><span className="compare-badge compare-badge-yes">✓</span>{fresh}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features grid */}
      <section className="wrap page-section">
        <div className="home-section-header">
          <p className="eyebrow">Platform capabilities</p>
          <h2>Everything you need to run creator campaigns.</h2>
          <p className="page-copy">Six core modules work together so nothing falls through the cracks. Each page is functional — not a placeholder.</p>
        </div>
        <div className="features-grid-6">
          {[
            { title: 'AI Creator Discovery', desc: 'Search by category, audience, budget, region, objective, and platform. Get ranked results with match scores.', color: 'var(--coral)', link: '/creator-discovery' },
            { title: 'Fraud Detection', desc: 'Score authenticity, bot activity, comment quality, and red flags. Protect your budget from fake reach.', color: 'var(--violet)', link: '/fraud-detection' },
            { title: 'Campaign Management', desc: 'Kanban pipeline, deliverable tracking, team activity feed, and payment coordination in one view.', color: 'var(--lime)', link: '/campaign-management' },
            { title: 'ROI Predictor', desc: 'Model conservative, expected, and optimistic outcomes before spending. Walk into budget meetings with data.', color: 'var(--coral)', link: '/roi-predictor' },
            { title: 'Post-Campaign Intelligence', desc: 'AI-generated performance reports with creator-level ROI breakdown and optimization playbooks.', color: 'var(--violet)', link: '/roi-predictor' },
            { title: 'Workspace & Settings', desc: 'Manage team seats, integrations, AI preferences, billing, and notification rules for your workspace.', color: 'var(--lime)', link: '/settings' },
          ].map((f) => (
            <div className="feature-card-6" key={f.title} onClick={() => pushRoute(f.link)}>
              <div className="feature-dot" style={{ background: f.color }} />
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
              <span className="feature-arrow">→</span>
            </div>
          ))}
        </div>
      </section>

      {/* Social proof numbers */}
      <section className="wrap page-section">
        <div className="proof-strip">
          {[
            { num: '250+', label: 'Brands using PickUP' },
            { num: '$18M+', label: 'Campaign spend managed' },
            { num: '12,400', label: 'Creators indexed' },
            { num: '94.2%', label: 'Fraud detection accuracy' },
            { num: '3.6x', label: 'Average ROAS uplift' },
          ].map((s) => (
            <div className="proof-item" key={s.label}>
              <strong>{s.num}</strong>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="wrap page-section">
        <div className="home-section-header">
          <p className="eyebrow">What brands say</p>
          <h2>Trusted by growth teams that take creator marketing seriously.</h2>
        </div>
        <div className="testimonials-row">
          {[
            { quote: '"We cut creator vetting time from two weeks to about two hours. The fraud scoring alone paid for the platform in the first month."', name: 'Naina Kapoor', role: 'Head of Growth, Bloomvale Skincare' },
            { quote: '"The ROI predictor changed how we pitch budgets internally — we walk into planning meetings with scenarios, not hope."', name: 'Arjun Mehta', role: 'CMO, Northwind Foods' },
            { quote: '"Post-campaign reports used to take our team a full week. PickUP generates a sharper version in minutes."', name: 'Sara Thomas', role: 'Marketing Director, Loop Apparel' },
          ].map((t) => (
            <Card key={t.name} className="testimonial-card">
              <p className="testimonial-quote">{t.quote}</p>
              <div className="testimonial-person">
                <div className="testimonial-avatar">{t.name.split(' ').map(n => n[0]).join('')}</div>
                <div>
                  <strong>{t.name}</strong>
                  <span>{t.role}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="wrap page-section">
        <div className="home-section-header">
          <p className="eyebrow">Common questions</p>
          <h2>Everything you need to know before you start.</h2>
        </div>
        <div className="home-faq-grid">
          {[
            { q: 'Who is PickUP for?', a: 'Brand marketing teams, growth leads, and agencies running creator campaigns from $10K to $500K+ per month. If you manage more than a handful of influencers, PickUP saves time and reduces risk.' },
            { q: 'How does creator discovery work?', a: 'Enter your campaign brief — category, audience, budget, region, and objective. PickUP ranks creators by match score, engagement, authenticity, and cost fit so you start with a shortlist, not a blank search.' },
            { q: 'Can I forecast ROI before spending?', a: 'Yes. The ROI Predictor lets you enter creator count, fees, follower reach, product price, conversion rate, and campaign duration. You get conservative, expected, and optimistic scenarios before launch.' },
            { q: 'Does PickUP replace my existing tools?', a: 'PickUP connects to Instagram, YouTube, TikTok, Shopify, Google Analytics, and Slack. You can keep your stack — PickUP becomes the operational layer on top.' },
          ].map((item) => (
            <Card className="home-faq-card" key={item.q}>
              <h3>{item.q}</h3>
              <p>{item.a}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="wrap page-section">
        <div className="home-cta-banner">
          <h2>Ready to stop guessing?</h2>
          <p>Start with a free workspace. Discover creators, run fraud scans, and forecast ROI — no credit card required.</p>
          <div className="hero-ctas" style={{ justifyContent: 'center' }}>
            <button className="btn btn-primary" onClick={() => pushRoute('/contact')}>Get started free →</button>
            <button className="btn btn-ghost" onClick={() => pushRoute('/creator-discovery')}>Explore the platform</button>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

/* ═══════════════════════════════════════════════════════
   CREATOR DISCOVERY — fillable brief + fixed comparison
   ═══════════════════════════════════════════════════════ */

function CreatorDiscoveryPage() {
  const { data: apiData, loading } = useApi('/api/creators', { fallback: null });
  const creators = apiData?.creators || fallbackCreators;

  // Fillable discovery brief
  const [brief, setBrief] = useState({
    category: 'Clean beauty',
    audience: 'Women 18-34',
    budget: '75000',
    region: 'India + US',
    objective: 'Launch awareness',
    platform: 'Instagram',
    description: 'Launching a new vitamin C serum for clean beauty buyers. Need creators with strong skincare credibility, high authenticity scores, and audiences in India and the US.',
  });

  // Comparison list
  const [compareList, setCompareList] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (creators.length > 0 && !selected) setSelected(creators[0]);
  }, [creators, selected]);

  const currentSelected = selected || creators[0] || fallbackCreators[0];

  // Filter creators based on brief
  const filteredCreators = useMemo(() => {
    let result = [...creators];
    if (brief.platform && brief.platform !== 'All') {
      result = result.filter(c => c.platform.toLowerCase().includes(brief.platform.toLowerCase()));
    }
    if (brief.category) {
      const cat = brief.category.toLowerCase();
      result = result.filter(c =>
        c.niche.toLowerCase().includes(cat) ||
        cat.split(/\s+/).some(word => word.length > 3 && c.niche.toLowerCase().includes(word))
      );
    }
    const budgetNum = Number(brief.budget) || 0;
    if (budgetNum > 0) {
      result = result.filter(c => parseCost(c.cost, c.costNum) <= budgetNum * 1.2);
    }
    if (brief.region) {
      const regionLower = brief.region.toLowerCase();
      const cities = ['mumbai', 'delhi', 'bangalore', 'chennai', 'hyderabad', 'pune'];
      const matchedCity = cities.find(city => regionLower.includes(city));
      if (matchedCity) {
        result = result.filter(c => (c.region || '').toLowerCase().includes(matchedCity));
      }
    }
    return result.sort((a, b) => b.match - a.match);
  }, [creators, brief]);

  function toggleCompare(creator) {
    setCompareList(prev => {
      if (prev.find(c => c.handle === creator.handle)) {
        return prev.filter(c => c.handle !== creator.handle);
      }
      if (prev.length >= 4) return prev;
      return [...prev, creator];
    });
    setSelected(creator);
  }

  function removeFromCompare(handle) {
    setCompareList(prev => prev.filter(c => c.handle !== handle));
  }

  function updateBrief(field, value) {
    setBrief(prev => ({ ...prev, [field]: value }));
  }

  return (
    <PageShell>
      <PageHero
        eyebrow="Creator discovery"
        title="Find creators who match the audience, budget, and brand."
        body="Use AI-assisted filters to turn a messy creator search into a ranked shortlist with cost, authenticity, engagement, and fit signals."
        ctaLeft={<button className="btn btn-primary" onClick={() => document.getElementById('creator-results')?.scrollIntoView({ behavior: 'smooth' })}>Search creators</button>}
        ctaRight={<button className="btn btn-ghost" onClick={() => document.getElementById('comparison-section')?.scrollIntoView({ behavior: 'smooth' })}>Compare ({compareList.length})</button>}
      >
        {/* Fillable discovery brief */}
        <Card className="search-panel brief-form">
          <h3>Discovery brief</h3>
          <div className="brief-field">
            <label>Product category</label>
            <input value={brief.category} onChange={e => updateBrief('category', e.target.value)} placeholder="e.g. Clean beauty, Fitness..." />
          </div>
          <div className="brief-field">
            <label>Target audience</label>
            <input value={brief.audience} onChange={e => updateBrief('audience', e.target.value)} placeholder="e.g. Women 18-34" />
          </div>
          <div className="brief-field">
            <label>Campaign brief</label>
            <textarea
              value={brief.description}
              onChange={e => updateBrief('description', e.target.value)}
              placeholder="Describe your campaign goals, product, tone, deliverables, and any must-haves for creators..."
              rows={4}
            />
          </div>
          <div className="brief-row-2">
            <div className="brief-field">
              <label>Budget</label>
              <input type="number" value={brief.budget} onChange={e => updateBrief('budget', e.target.value)} placeholder="75000" />
            </div>
            <div className="brief-field">
              <label>Region</label>
              <input value={brief.region} onChange={e => updateBrief('region', e.target.value)} placeholder="India + US" />
            </div>
          </div>
          <div className="brief-row-2">
            <div className="brief-field">
              <label>Objective</label>
              <select value={brief.objective} onChange={e => updateBrief('objective', e.target.value)}>
                <option>Launch awareness</option>
                <option>Brand consideration</option>
                <option>Direct sales</option>
                <option>Community building</option>
              </select>
            </div>
            <div className="brief-field">
              <label>Platform</label>
              <select value={brief.platform} onChange={e => updateBrief('platform', e.target.value)}>
                <option>All</option>
                <option>Instagram</option>
                <option>YouTube</option>
                <option>TikTok</option>
              </select>
            </div>
          </div>
          <div className="brief-summary">
            Searching {brief.platform === 'All' ? 'all platforms' : brief.platform} • {brief.region} • ${Number(brief.budget).toLocaleString()} budget
          </div>
        </Card>
      </PageHero>

      {/* Creator results */}
      <section className="wrap page-section" id="creator-results">
        <div className="home-section-header" style={{ marginBottom: 32 }}>
          <p className="eyebrow">Results</p>
          <h2>{filteredCreators.length} creators found</h2>
        </div>
        {loading ? <LoadingSkeleton lines={4} /> : filteredCreators.length === 0 ? (
          <Card>
            <p className="compare-empty">No creators match your current brief. Try broadening the category, increasing budget, or selecting a different platform.</p>
          </Card>
        ) : (
          <div className="creator-directory">
            {filteredCreators.map((creator) => (
              <Card className={`creator-profile ${compareList.find(c => c.handle === creator.handle) ? 'in-compare' : ''}`} key={creator.handle}>
                <div className="avatar-badge">{creator.name.split(' ').map((n) => n[0]).join('')}</div>
                <h3>{creator.name}</h3>
                <p>{creator.handle} · {creator.niche}</p>
                <div className="pill-row"><span>{creator.platform}</span><span>{creator.followers}</span><span>{creator.cost}</span></div>
                <label>Match score <Progress value={creator.match} /></label>
                <label>Authenticity <Progress value={creator.authenticity} /></label>
                <button className={`btn ${compareList.find(c => c.handle === creator.handle) ? 'btn-primary' : 'btn-dark'}`} onClick={() => toggleCompare(creator)}>
                  {compareList.find(c => c.handle === creator.handle) ? '✓ Remove from compare' : 'Add to compare'}
                </button>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* AI recommendation */}
      <section className="wrap page-section">
        <Card className="selected-card ai-reco-card">
          <p className="eyebrow" style={{ color: 'var(--ink)' }}>AI recommendation</p>
          <h2>{currentSelected.name} is the strongest current fit.</h2>
          <p>Selected because the audience overlaps with {brief.category.toLowerCase()} buyers, engagement is above benchmark at {currentSelected.engagement}, and authenticity risk is low enough at {currentSelected.authenticity}% for a {brief.objective.toLowerCase()} campaign.{brief.description ? ` Brief: "${brief.description.slice(0, 120)}${brief.description.length > 120 ? '…' : ''}"` : ''}</p>
          <div className="pill-row" style={{ marginTop: 12 }}>
            <span>{currentSelected.match}% match</span>
            <span>{currentSelected.authenticity}% authentic</span>
            <span>{currentSelected.platform}</span>
            <span>{currentSelected.cost}</span>
          </div>
        </Card>
      </section>

      {/* Side-by-side comparison */}
      <section className="wrap page-section" id="comparison-section">
        <div className="home-section-header comparison-header">
          <div>
            <p className="eyebrow">Side-by-side comparison</p>
            <h2>Compare creators head to head.</h2>
          </div>
          {compareList.length > 0 && (
            <button className="btn btn-ghost" onClick={() => setCompareList([])}>Clear all</button>
          )}
        </div>
        {compareList.length === 0 ? (
          <Card>
            <p className="compare-empty">Click "Add to compare" on any creator above to start comparing. You can compare up to 4 creators side by side.</p>
          </Card>
        ) : (
          <>
            <div className="comparison-table-wrap">
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th className="compare-sticky-col">Attribute</th>
                    {compareList.map(c => (
                      <th key={c.handle}>
                        <div className="compare-th-content">
                          <div className="avatar-badge-sm">{c.name.split(' ').map(n => n[0]).join('')}</div>
                          <span>{c.name}</span>
                          <button type="button" className="compare-remove" aria-label={`Remove ${c.name}`} onClick={() => removeFromCompare(c.handle)}>✕</button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: 'Handle', get: c => c.handle },
                    { label: 'Platform', get: c => c.platform },
                    { label: 'Niche', get: c => c.niche },
                    { label: 'Followers', get: c => c.followers, highlight: true },
                    { label: 'Engagement', get: c => c.engagement },
                    { label: 'Match Score', get: c => `${c.match}%`, best: c => c.match, highlight: true },
                    { label: 'Authenticity', get: c => `${c.authenticity}%`, best: c => c.authenticity, highlight: true },
                    { label: 'Cost', get: c => c.cost },
                    { label: 'Region', get: c => c.region || '—' },
                  ].map(row => {
                    const bestVal = row.best ? Math.max(...compareList.map(row.best)) : null;
                    return (
                      <tr key={row.label}>
                        <td className="compare-sticky-col">{row.label}</td>
                        {compareList.map(c => {
                          const isBest = row.best && row.best(c) === bestVal && compareList.length > 1;
                          return (
                            <td key={c.handle} className={isBest ? 'compare-best' : ''}>
                              {row.highlight ? <strong className={isBest ? 'compare-highlight compare-winner' : ''}>{row.get(c)}</strong> : row.get(c)}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="comparison-cards-mobile">
              {compareList.map(c => (
                <Card className="comparison-mobile-card" key={c.handle}>
                  <div className="compare-mobile-head">
                    <div className="avatar-badge-sm">{c.name.split(' ').map(n => n[0]).join('')}</div>
                    <div>
                      <strong>{c.name}</strong>
                      <span>{c.handle}</span>
                    </div>
                    <button type="button" className="compare-remove" onClick={() => removeFromCompare(c.handle)}>✕</button>
                  </div>
                  <div className="compare-mobile-grid">
                    <div><span>Platform</span><strong>{c.platform}</strong></div>
                    <div><span>Match</span><strong className="compare-highlight">{c.match}%</strong></div>
                    <div><span>Authenticity</span><strong>{c.authenticity}%</strong></div>
                    <div><span>Followers</span><strong>{c.followers}</strong></div>
                    <div><span>Engagement</span><strong>{c.engagement}</strong></div>
                    <div><span>Cost</span><strong>{c.cost}</strong></div>
                    <div><span>Region</span><strong>{c.region || '—'}</strong></div>
                    <div><span>Niche</span><strong>{c.niche}</strong></div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
      </section>
    </PageShell>
  );
}

/* ═══════════════════════════════════════════════════════
   FRAUD DETECTION — mostly same, kept intact
   ═══════════════════════════════════════════════════════ */

function FraudDetectionPage() {
  const { data: fraudData, loading } = useApi('/api/fraud/signals', { fallback: null });
  const [scanResult, setScanResult] = useState(null);
  const [scanning, setScanning] = useState(false);

  const signals = fraudData?.signals || [
    { label: 'Fake followers', value: 7, note: 'Below category danger line' },
    { label: 'Suspicious engagement', value: 11, note: 'Two posts need review' },
    { label: 'Bot comment clusters', value: 4, note: 'Low automated language' },
    { label: 'Comment quality', value: 89, note: 'Strong purchase intent' },
  ];

  async function handleScan() {
    setScanning(true);
    try {
      const result = await postApi('/api/fraud/scan', { handle: '@mayamakes', url: 'https://instagram.com/mayamakes' });
      setScanResult(result.scan);
    } catch (err) { console.error('Scan failed:', err); }
    finally { setScanning(false); }
  }

  return (
    <PageShell>
      <PageHero
        eyebrow="AI fraud detection"
        title="Verify creator trust before the contract is signed."
        body="PickUP checks follower quality, suspicious engagement, growth spikes, bot patterns, and comment quality so brands can stop paying for fake reach."
      >
        <div className="trust-score">
          <span>Authenticity Score</span>
          <strong>{scanResult ? scanResult.authenticityScore : 94}</strong>
          <p>{scanResult ? scanResult.riskLevel : 'Low risk'} - verified audience and healthy growth.</p>
        </div>
      </PageHero>

      <section className="wrap page-section fraud-grid">
        <Card>
          <h3>Creator search</h3>
          <div className="form-stack">
            <input defaultValue="@mayamakes" aria-label="Creator handle" />
            <input defaultValue="https://instagram.com/mayamakes" aria-label="Creator URL" />
            <button className="btn btn-primary" onClick={handleScan} disabled={scanning}>
              {scanning ? 'Scanning...' : 'Run fraud scan'}
            </button>
          </div>
        </Card>
        <Card>
          <h3>AI verdict</h3>
          <p>{scanResult ? scanResult.verdict : 'Approve for premium tier. Audience growth is stable, comment quality is strong, and bot activity is well below the risk threshold.'}</p>
          <div className="pill-row">
            {(scanResult ? scanResult.badges : ['Verified', 'Low risk', 'Brand safe']).map((badge) => (
              <span key={badge}>{badge}</span>
            ))}
          </div>
        </Card>
      </section>

      <section className="wrap page-section signal-grid">
        {loading ? <LoadingSkeleton lines={4} /> : (
          (scanResult ? scanResult.signals : signals).map((signal) => (
            <Card key={signal.label}>
              <h3>{signal.label}</h3>
              <strong className="big-number">{signal.value}%</strong>
              <Progress value={signal.value} />
              <p>{signal.note}</p>
            </Card>
          ))
        )}
      </section>

      <section className="wrap page-section split-section">
        <Card><h3>Red flags</h3><p>{scanResult ? scanResult.redFlags : 'Recent giveaway spike, two repeated comment clusters, and weekend story completion dips.'}</p></Card>
        <Card><h3>Green signals</h3><p>{scanResult ? scanResult.greenSignals : 'Original comment language, stable posting cadence, strong save rate, and high audience overlap.'}</p></Card>
      </section>
    </PageShell>
  );
}

/* ═══════════════════════════════════════════════════════
   CAMPAIGNS — completely redesigned UI
   ═══════════════════════════════════════════════════════ */

function CampaignManagementPage() {
  const { data: campaignData, loading: campaignLoading } = useApi('/api/campaigns', { fallback: null });
  const { data: pipelineData, loading: pipelineLoading } = useApi('/api/campaigns/pipeline', { fallback: null });
  const [activeView, setActiveView] = useState('overview');

  const campaignsList = campaignData?.campaigns || fallbackCampaigns;
  const summary = campaignData?.summary || { active: 18, totalBudget: '$412K', deliverablesDue: 26, pendingPayments: '$88K' };
  const calendar = campaignData?.calendar || [
    { date: 'Jun 24', event: 'Maya draft review' },
    { date: 'Jun 28', event: 'First wave live' },
    { date: 'Jul 02', event: 'Finance approval' },
    { date: 'Jul 08', event: 'Final report' },
  ];
  const activity = campaignData?.activity || [
    'Avery moved Maya to Approved.',
    'Mina scheduled Ananya payment.',
    'Noah added fraud notes.',
    'Sam exported report draft.',
  ];
  const pipeline = pipelineData?.pipeline || [
    { stage: 'Recommended', items: ['Maya Iyer', 'Kavya Menon'] },
    { stage: 'Contacted', items: ['Rohan Verma'] },
    { stage: 'Negotiating', items: ['Ananya Rao'] },
    { stage: 'Approved', items: ['Devika Shetty'] },
    { stage: 'Live', items: ['Meera Joshi', 'Ishaan Kapoor'] },
  ];

  const totalCreators = campaignsList.reduce((sum, c) => sum + c.creators, 0);
  const stageColors = { Recommended: 'var(--violet)', Contacted: 'var(--coral)', Negotiating: '#f59e0b', Approved: 'var(--lime)', Live: '#22c55e' };
  const statusProgress = { Active: 72, Negotiating: 45, Reporting: 100 };

  return (
    <PageShell>
      <section className="product-hero camp-hero-v2">
        <div className="wrap">
          <div className="camp-hero-top">
            <div>
              <p className="eyebrow">Campaign management</p>
              <h1>Run influencer campaigns from shortlist to report.</h1>
              <p className="hero-sub">Track outreach, negotiations, deliverables, payments, and post-campaign reporting in one operational command center.</p>
            </div>
            <div className="camp-hero-actions">
              <button className="btn btn-primary">+ New campaign</button>
              <button className="btn btn-ghost">Export report</button>
            </div>
          </div>

          <div className="camp-stats-row">
            {[
              { icon: '📊', value: summary.active, label: 'Active campaigns', accent: 'var(--lime)' },
              { icon: '💰', value: summary.totalBudget, label: 'Total budget', accent: 'var(--coral)' },
              { icon: '📋', value: summary.deliverablesDue, label: 'Deliverables due', accent: 'var(--violet)' },
              { icon: '⏳', value: summary.pendingPayments, label: 'Pending payments', accent: '#f59e0b' },
              { icon: '👥', value: totalCreators, label: 'Total creators', accent: 'var(--cream)' },
            ].map((stat) => (
              <div className="camp-stat-pill" key={stat.label} style={{ '--stat-accent': stat.accent }}>
                <span className="camp-stat-pill-icon">{stat.icon}</span>
                <div>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="wrap page-section">
        <div className="camp-view-bar">
          {[
            { id: 'overview', label: 'Overview', icon: '◫' },
            { id: 'pipeline', label: 'Pipeline', icon: '▦' },
            { id: 'timeline', label: 'Timeline', icon: '◷' },
          ].map(tab => (
            <button key={tab.id} className={`camp-view-btn ${activeView === tab.id ? 'active' : ''}`} onClick={() => setActiveView(tab.id)}>
              <span className="camp-view-icon">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {activeView === 'overview' && (
          <div className="camp-grid">
            {campaignLoading ? <LoadingSkeleton lines={5} /> : campaignsList.map((campaign) => (
              <div className="camp-card" key={campaign.name}>
                <div className="camp-card-top">
                  <StatusBadge status={campaign.status} />
                  <span className="camp-card-due">Due {campaign.due}</span>
                </div>
                <h3>{campaign.name}</h3>
                <p className="camp-card-brand">{campaign.brand || 'Brand'} · {campaign.creators} creators</p>
                <div className="camp-card-metrics">
                  <div><span>Budget</span><strong>{campaign.budget}</strong></div>
                  <div><span>ROI</span><strong className="camp-roi">{campaign.roi}</strong></div>
                </div>
                <div className="camp-progress-wrap">
                  <div className="camp-progress-label">
                    <span>Campaign progress</span>
                    <span>{statusProgress[campaign.status] || 50}%</span>
                  </div>
                  <Progress value={statusProgress[campaign.status] || 50} color={campaign.status === 'Active' ? 'var(--lime)' : campaign.status === 'Negotiating' ? '#f59e0b' : 'var(--violet)'} />
                </div>
              </div>
            ))}
          </div>
        )}

        {activeView === 'pipeline' && (
          pipelineLoading ? <LoadingSkeleton lines={5} /> : (
            <div className="kanban-board camp-kanban-v2">
              {pipeline.map((column) => (
                <div className="kanban-column camp-kanban-col" key={column.stage} style={{ '--stage-color': stageColors[column.stage] }}>
                  <div className="kanban-col-header">
                    <span className="kanban-dot" style={{ background: stageColors[column.stage] }} />
                    <h3>{column.stage}</h3>
                    <span className="kanban-count">{column.items.length}</span>
                  </div>
                  {column.items.map((item) => (
                    <div className="camp-kanban-item" key={item}>
                      <div className="kanban-card-avatar">{item.split(' ').map(n => n[0]).join('')}</div>
                      <div>
                        <strong>{item}</strong>
                        <span>Glow Serum Launch</span>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )
        )}

        {activeView === 'timeline' && (
          <div className="camp-timeline-v2">
            <Card className="camp-timeline-card">
              <h3>📅 Campaign calendar</h3>
              <div className="camp-cal-list">
                {calendar.map((item, i) => (
                  <div className="camp-cal-item" key={i}>
                    <div className="camp-cal-date">{item.date}</div>
                    <div className="camp-cal-event">{item.event}</div>
                  </div>
                ))}
              </div>
            </Card>
            <Card className="camp-activity-card">
              <h3>⚡ Team activity</h3>
              <div className="activity-feed">
                {activity.map((item, i) => (
                  <div className="activity-item" key={i}>
                    <div className="activity-avatar">{item.charAt(0)}</div>
                    <p>{item}</p>
                    <span className="activity-time">{i === 0 ? '2m ago' : i === 1 ? '14m ago' : i === 2 ? '1h ago' : '3h ago'}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </section>
    </PageShell>
  );
}

/* ═══════════════════════════════════════════════════════
   ROI PREDICTOR — interactive fillable inputs
   ═══════════════════════════════════════════════════════ */

function RoiPredictorPage() {
  const { data: roiData, loading } = useApi('/api/roi/scenarios', { fallback: null });
  const [prediction, setPrediction] = useState(null);
  const [predicting, setPredicting] = useState(false);

  // Fillable ROI inputs
  const [inputs, setInputs] = useState({
    creators: 8,
    fees: 72000,
    followers: 3800000,
    productPrice: 48,
    conversionRate: 2.4,
    duration: 21,
  });

  function updateInput(field, value) {
    const num = value === '' ? '' : Number(value);
    setInputs(prev => ({ ...prev, [field]: num === '' ? '' : num }));
  }

  function resetInputs() {
    setInputs({ creators: 8, fees: 72000, followers: 3800000, productPrice: 48, conversionRate: 2.4, duration: 21 });
    setPrediction(null);
  }

  const scenarios = prediction?.scenarios || roiData?.scenarios || [
    { name: 'Conservative', reach: '4.8M', revenue: '$118K', roi: '2.1x' },
    { name: 'Expected', reach: '7.2M', revenue: '$214K', roi: '3.6x' },
    { name: 'Optimistic', reach: '10.6M', revenue: '$338K', roi: '5.2x' },
  ];

  const engine = prediction?.prediction || roiData?.predictionEngine || {
    reach: '7.2M', clicks: '184K', conversions: 4416, profit: '$142K', roas: '4.8x',
  };

  async function handlePredict() {
    setPredicting(true);
    try {
      const payload = {
        creators: Number(inputs.creators) || 0,
        fees: Number(inputs.fees) || 0,
        followers: Number(inputs.followers) || 0,
        productPrice: Number(inputs.productPrice) || 0,
        conversionRate: Number(inputs.conversionRate) || 0,
        duration: Number(inputs.duration) || 0,
      };
      const result = await postApi('/api/roi/predict', payload);
      setPrediction(result);
    } catch (err) { console.error('Prediction failed:', err); }
    finally { setPredicting(false); }
  }

  return (
    <PageShell>
      <PageHero
        eyebrow="ROI predictor"
        title="Forecast campaign performance before launch."
        body="Build a campaign model with creators, fees, followers, engagement rates, product price, conversion rate, and duration to see likely reach, revenue, profit, ROI, and ROAS."
        ctaLeft={<button className="btn btn-primary" onClick={handlePredict} disabled={predicting}>{predicting ? 'Calculating...' : 'Run prediction →'}</button>}
        ctaRight={<button className="btn btn-ghost" onClick={() => document.getElementById('roi-results')?.scrollIntoView({ behavior: 'smooth' })}>See results ↓</button>}
      >
        {/* Interactive campaign builder */}
        <Card className="roi-builder roi-form">
          <div className="roi-form-head">
            <h3>Campaign builder</h3>
            <button type="button" className="roi-reset-btn" onClick={resetInputs}>Reset</button>
          </div>
          <p className="roi-form-hint">Fill in your campaign details below, then run a prediction to see reach, revenue, and ROI scenarios.</p>
          <div className="roi-field">
            <label>Number of creators</label>
            <input type="number" value={inputs.creators} onChange={e => updateInput('creators', e.target.value)} min="1" max="100" placeholder="8" />
          </div>
          <div className="roi-field">
            <label>Total fees ($)</label>
            <input type="number" value={inputs.fees} onChange={e => updateInput('fees', e.target.value)} min="0" step="1000" placeholder="72000" />
          </div>
          <div className="roi-row-2">
            <div className="roi-field">
              <label>Combined followers</label>
              <input type="number" value={inputs.followers} onChange={e => updateInput('followers', e.target.value)} min="0" step="100000" placeholder="3800000" />
            </div>
            <div className="roi-field">
              <label>Product price ($)</label>
              <input type="number" value={inputs.productPrice} onChange={e => updateInput('productPrice', e.target.value)} min="0" step="1" placeholder="48" />
            </div>
          </div>
          <div className="roi-row-2">
            <div className="roi-field">
              <label>Conversion rate (%)</label>
              <input type="number" value={inputs.conversionRate} onChange={e => updateInput('conversionRate', e.target.value)} min="0" max="100" step="0.1" placeholder="2.4" />
            </div>
            <div className="roi-field">
              <label>Duration (days)</label>
              <input type="number" value={inputs.duration} onChange={e => updateInput('duration', e.target.value)} min="1" max="365" placeholder="21" />
            </div>
          </div>
          <div className="roi-input-summary">
            {inputs.creators || 0} creators · ${Number(inputs.fees || 0).toLocaleString()} spend · {((inputs.followers || 0) / 1000000).toFixed(1)}M followers · {inputs.duration || 0} days
          </div>
          <button className="btn btn-primary" onClick={handlePredict} disabled={predicting} style={{ width: '100%', justifyContent: 'center' }}>
            {predicting ? 'Calculating...' : '⚡ Run prediction'}
          </button>
        </Card>
      </PageHero>

      {/* Scenario results */}
      <section className="wrap page-section scenario-grid" id="roi-results">
        {loading ? <LoadingSkeleton lines={3} /> : scenarios.map((scenario) => (
          <Card className="scenario-card" key={scenario.name}>
            <span>{scenario.name}</span>
            <strong>{scenario.roi}</strong>
            <p>{scenario.reach} reach</p>
            <p>{scenario.revenue} revenue</p>
          </Card>
        ))}
      </section>

      {/* Prediction engine + recommendations */}
      <section className="wrap page-section split-section">
        <Card>
          <h3>Prediction engine</h3>
          <div className="mini-metrics">
            <span>Reach {engine.reach}</span>
            <span>Clicks {engine.clicks}</span>
            <span>Conversions {typeof engine.conversions === 'number' ? engine.conversions.toLocaleString() : engine.conversions}</span>
            <span>Profit {engine.profit}</span>
            <span>ROAS {engine.roas}</span>
          </div>
        </Card>
        <Card>
          <h3>AI recommendations</h3>
          <p>{prediction?.recommendations || roiData?.recommendations || 'Shift 20% of spend to the top two creators, launch on Thursday evening, and add one education-focused creator to increase purchase intent.'}</p>
        </Card>
      </section>
    </PageShell>
  );
}

/* ═══════════════════════════════════════════════════════
   CONTACT — same with minor polish
   ═══════════════════════════════════════════════════════ */

function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [email, setEmail] = useState('');
  const [goal, setGoal] = useState('');

  async function handleSubmit() {
    if (!email) return;
    setSubmitting(true);
    try {
      await postApi('/api/contact', { email, goal });
      setSubmitted(true);
    } catch (err) { console.error('Submit failed:', err); }
    finally { setSubmitting(false); }
  }

  return (
    <PageShell>
      <PageHero
        eyebrow="Contact"
        title="Talk to PickUP about your next creator campaign."
        body="Share your campaign goal, market, budget, and timeline. The team can help shape the right discovery, fraud detection, management, and ROI workflow."
      >
        <Card className="contact-card">
          <h3>{submitted ? '✓ Request sent!' : 'Demo request'}</h3>
          {submitted ? (
            <p>Our team will reach out within 24 hours.</p>
          ) : (
            <>
              <input value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" aria-label="Email" />
              <input value={goal} onChange={e => setGoal(e.target.value)} placeholder="e.g. Beauty launch in Q3" aria-label="Campaign goal" />
              <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting || !email}>
                {submitting ? 'Sending...' : 'Send request'}
              </button>
            </>
          )}
        </Card>
      </PageHero>

      <section className="wrap page-section contact-grid">
        <Card><h3>Sales</h3><p>For brand teams planning creator programs over $25K per month.</p><strong>sales@pickup.ai</strong></Card>
        <Card><h3>Support</h3><p>For workspace setup, integrations, reporting, and creator scan questions.</p><strong>support@pickup.ai</strong></Card>
        <Card><h3>Partnerships</h3><p>For agencies, creator platforms, and analytics partners.</p><strong>partners@pickup.ai</strong></Card>
      </section>
    </PageShell>
  );
}

/* ═══════════════════════════════════════════════════════
   SETTINGS — completely redesigned UI
   ═══════════════════════════════════════════════════════ */

function SettingsPage() {
  const { data: settingsData, loading } = useApi('/api/settings', { fallback: null });
  const [activeSection, setActiveSection] = useState('workspace');

  const groups = settingsData?.groups || [
    { title: 'Workspace', fields: ['Brand name: Bloomvale Skincare', 'Team seats: 12 active', 'Default market: India + US'] },
    { title: 'Integrations', fields: ['Instagram connected', 'YouTube connected', 'TikTok review required'] },
    { title: 'AI Preferences', fields: ['Prioritize ROI quality', 'Flag fraud above 18%', 'Auto-suggest replacements'] },
  ];
  const health = settingsData?.workspaceHealth || { plan: 'Scale', usage: '68%', seats: 12, alerts: 'On' };

  const [notifs, setNotifs] = useState({
    emailAlerts: true,
    fraudAlerts: true,
    campaignUpdates: true,
    weeklyDigest: false,
    slackIntegration: true,
    smsAlerts: false,
  });

  const sections = [
    { id: 'workspace', label: '🏢 Workspace', icon: '🏢' },
    { id: 'integrations', label: '🔗 Integrations', icon: '🔗' },
    { id: 'ai', label: '🤖 AI Preferences', icon: '🤖' },
    { id: 'notifications', label: '🔔 Notifications', icon: '🔔' },
    { id: 'billing', label: '💳 Billing & Usage', icon: '💳' },
    { id: 'team', label: '👥 Team', icon: '👥' },
  ];

  const integrations = [
    { name: 'Instagram', status: 'connected', color: '#E1306C' },
    { name: 'YouTube', status: 'connected', color: '#FF0000' },
    { name: 'TikTok', status: 'review required', color: '#000000' },
    { name: 'Shopify', status: 'not connected', color: '#96BF48' },
    { name: 'Google Analytics', status: 'connected', color: '#F9AB00' },
    { name: 'Slack', status: 'connected', color: '#4A154B' },
  ];

  const teamMembers = [
    { name: 'Avery Chen', role: 'Admin', status: 'Active' },
    { name: 'Mina Kapoor', role: 'Campaign Manager', status: 'Active' },
    { name: 'Noah Park', role: 'Fraud Analyst', status: 'Active' },
    { name: 'Sam Rivera', role: 'Reporting', status: 'Active' },
  ];

  const usagePercent = parseInt(health.usage) || 68;

  return (
    <PageShell>
      <section className="product-hero settings-hero-v2">
        <div className="wrap">
          <div className="settings-hero-row">
            <div>
              <p className="eyebrow">Settings</p>
              <h1>Configure your workspace.</h1>
              <p className="hero-sub">Manage workspace defaults, integrations, AI preferences, billing, team, and notification rules.</p>
            </div>
            <div className="settings-hero-card">
              <div className="settings-avatar">BS</div>
              <div>
                <strong>Bloomvale Skincare</strong>
                <span className="settings-plan-badge">{health.plan} Plan · {health.seats} seats</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="wrap page-section">
        {loading ? <LoadingSkeleton lines={8} /> : (
          <>
            <div className="settings-tabs-bar">
              {sections.map(s => (
                <button key={s.id} className={`settings-tab ${activeSection === s.id ? 'active' : ''}`} onClick={() => setActiveSection(s.id)}>
                  {s.label}
                </button>
              ))}
            </div>

            <div className="settings-panel-v2">
              {/* Workspace */}
              {activeSection === 'workspace' && (
                <div className="settings-section-card">
                  <div className="settings-section-head">
                    <h2>Workspace settings</h2>
                    <p className="settings-desc">Manage your brand workspace defaults and general preferences.</p>
                  </div>
                  <div className="settings-form settings-form-wide">
                    <div className="settings-field">
                      <label>Brand name</label>
                      <input defaultValue="Bloomvale Skincare" />
                    </div>
                    <div className="settings-field-row">
                      <div className="settings-field">
                        <label>Default market</label>
                        <select defaultValue="India + US">
                          <option>India + US</option>
                          <option>India</option>
                          <option>US</option>
                          <option>Global</option>
                          <option>Europe</option>
                          <option>Southeast Asia</option>
                        </select>
                      </div>
                      <div className="settings-field">
                        <label>Default currency</label>
                        <select defaultValue="USD">
                          <option>USD</option>
                          <option>INR</option>
                          <option>EUR</option>
                          <option>GBP</option>
                        </select>
                      </div>
                    </div>
                    <div className="settings-field">
                      <label>Workspace description</label>
                      <textarea defaultValue="Premium skincare brand focused on clean beauty products for the Indian and US markets." rows={3} />
                    </div>
                    <button className="btn btn-primary" style={{ marginTop: 12 }}>Save changes</button>
                  </div>
                </div>
              )}

              {/* Integrations */}
              {activeSection === 'integrations' && (
                <div className="settings-section-card">
                  <div className="settings-section-head">
                    <h2>Integrations</h2>
                    <p className="settings-desc">Connect your platforms and tools to sync creator data and campaign metrics.</p>
                  </div>
                  <div className="integration-grid">
                    {integrations.map(int => (
                      <div className={`integration-card ${int.status === 'connected' ? 'connected' : ''}`} key={int.name}>
                        <div className="integration-icon" style={{ background: int.color }}>{int.name.charAt(0)}</div>
                        <div className="integration-info">
                          <strong>{int.name}</strong>
                          <span className={`integration-status ${int.status === 'connected' ? 'is-connected' : int.status === 'review required' ? 'is-review' : 'is-disconnected'}`}>
                            {int.status === 'connected' ? '● Connected' : int.status === 'review required' ? '⟳ Review required' : '○ Not connected'}
                          </span>
                        </div>
                        <button className="btn btn-dark" style={{ padding: '8px 16px', fontSize: 12 }}>
                          {int.status === 'connected' ? 'Manage' : 'Connect'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Preferences */}
              {activeSection === 'ai' && (
                <div className="settings-section-card">
                  <div className="settings-section-head">
                    <h2>AI Preferences</h2>
                    <p className="settings-desc">Customize how PickUP's AI models rank creators, detect fraud, and generate recommendations.</p>
                  </div>
                  <div className="settings-form settings-form-wide">
                    <div className="settings-field">
                      <label>Creator ranking priority</label>
                      <select defaultValue="roi">
                        <option value="roi">Prioritize ROI quality</option>
                        <option value="engagement">Prioritize engagement rate</option>
                        <option value="authenticity">Prioritize authenticity score</option>
                        <option value="cost">Prioritize cost efficiency</option>
                      </select>
                    </div>
                    <div className="settings-field">
                      <label>Fraud flag threshold (%)</label>
                      <input type="number" defaultValue={18} min={5} max={50} />
                      <span className="field-hint">Flag creators with fraud scores above this percentage</span>
                    </div>
                    <Toggle label="Auto-suggest replacement creators" checked={true} onChange={() => {}} />
                    <Toggle label="Auto-generate post-campaign reports" checked={true} onChange={() => {}} />
                    <Toggle label="Include sentiment analysis in fraud scans" checked={false} onChange={() => {}} />
                    <button className="btn btn-primary" style={{ marginTop: 12 }}>Save preferences</button>
                  </div>
                </div>
              )}

              {/* Notifications */}
              {activeSection === 'notifications' && (
                <div className="settings-section-card">
                  <div className="settings-section-head">
                    <h2>Notification preferences</h2>
                    <p className="settings-desc">Control how and when you receive updates about campaigns, fraud alerts, and team activity.</p>
                  </div>
                  <div className="settings-form settings-form-wide">
                    <Toggle label="Email alerts for campaign updates" checked={notifs.emailAlerts} onChange={v => setNotifs(p => ({ ...p, emailAlerts: v }))} />
                    <Toggle label="Immediate fraud detection alerts" checked={notifs.fraudAlerts} onChange={v => setNotifs(p => ({ ...p, fraudAlerts: v }))} />
                    <Toggle label="Campaign milestone notifications" checked={notifs.campaignUpdates} onChange={v => setNotifs(p => ({ ...p, campaignUpdates: v }))} />
                    <Toggle label="Weekly performance digest" checked={notifs.weeklyDigest} onChange={v => setNotifs(p => ({ ...p, weeklyDigest: v }))} />
                    <Toggle label="Slack channel notifications" checked={notifs.slackIntegration} onChange={v => setNotifs(p => ({ ...p, slackIntegration: v }))} />
                    <Toggle label="SMS alerts for critical events" checked={notifs.smsAlerts} onChange={v => setNotifs(p => ({ ...p, smsAlerts: v }))} />
                    <button className="btn btn-primary" style={{ marginTop: 12 }}>Save notifications</button>
                  </div>
                </div>
              )}

              {/* Billing */}
              {activeSection === 'billing' && (
                <div className="settings-section-card">
                  <div className="settings-section-head">
                    <h2>Billing & Usage</h2>
                    <p className="settings-desc">Monitor your plan usage, manage billing, and review invoices.</p>
                  </div>
                  <div className="billing-card">
                    <div className="billing-plan-header">
                      <div>
                        <h3>Scale Plan</h3>
                        <span className="billing-price">$299<small>/month</small></span>
                      </div>
                      <button className="btn btn-dark" style={{ padding: '10px 20px', fontSize: 13 }}>Upgrade plan</button>
                    </div>
                    <div className="billing-usage-section">
                      <div className="billing-usage-item">
                        <div className="billing-usage-header">
                          <span>API calls</span><span>{usagePercent}% used</span>
                        </div>
                        <Progress value={usagePercent} />
                        <span className="field-hint">6,800 of 10,000 calls this month</span>
                      </div>
                      <div className="billing-usage-item">
                        <div className="billing-usage-header">
                          <span>Team seats</span><span>{health.seats} of 15</span>
                        </div>
                        <Progress value={(health.seats / 15) * 100} color="var(--violet)" />
                      </div>
                      <div className="billing-usage-item">
                        <div className="billing-usage-header">
                          <span>Fraud scans</span><span>42 of 100</span>
                        </div>
                        <Progress value={42} color="var(--lime)" />
                      </div>
                    </div>
                  </div>
                  <div className="billing-invoices">
                    <h3>Recent invoices</h3>
                    {[
                      { date: 'Jun 1, 2026', amount: '$299.00', status: 'Paid' },
                      { date: 'May 1, 2026', amount: '$299.00', status: 'Paid' },
                      { date: 'Apr 1, 2026', amount: '$199.00', status: 'Paid' },
                    ].map((inv, i) => (
                      <div className="invoice-row" key={i}>
                        <span>{inv.date}</span>
                        <strong>{inv.amount}</strong>
                        <span className="status-badge status-done">{inv.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Team */}
              {activeSection === 'team' && (
                <div className="settings-section-card">
                  <div className="settings-section-head">
                    <h2>Team management</h2>
                    <p className="settings-desc">Manage team members, roles, and access permissions for your workspace.</p>
                  </div>
                  <div className="team-grid">
                    {teamMembers.map(member => (
                      <div className="team-card" key={member.name}>
                        <div className="team-avatar">{member.name.split(' ').map(n => n[0]).join('')}</div>
                        <div className="team-info">
                          <strong>{member.name}</strong>
                          <span>{member.role}</span>
                        </div>
                        <StatusBadge status={member.status} />
                      </div>
                    ))}
                    <div className="team-card team-add">
                      <div className="team-avatar-add">+</div>
                      <strong>Invite team member</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </section>
    </PageShell>
  );
}

/* ═══════════════════════════════════════════════════════
   APP ROUTER
   ═══════════════════════════════════════════════════════ */

export default function App() {
  const path = usePath();
  const pages = {
    '/': <HomePage />,
    '/creator-discovery': <CreatorDiscoveryPage />,
    '/fraud-detection': <FraudDetectionPage />,
    '/campaign-management': <CampaignManagementPage />,
    '/roi-predictor': <RoiPredictorPage />,
    '/contact': <ContactPage />,
    '/settings': <SettingsPage />,
  };

  return pages[path] || <HomePage />;
}
