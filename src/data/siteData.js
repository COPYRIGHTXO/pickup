/**
 * ═══════════════════════════════════════════
 *  SITE DATA — All text, numbers & content
 *  Edit content here, not in components.
 * ═══════════════════════════════════════════
 */

// ── NAV ──
export const navLinks = [
  { label: 'Overview', href: '#overview' },
  { label: 'Market', href: '#market' },
  { label: 'Modules', href: '#modules' },
  { label: 'Insights', href: '#insights' },
  { label: 'Customers', href: '#testimonials' },
];

// ── HERO ──
export const heroTrust = [
  { value: '12,400+', label: 'creators indexed' },
  { value: '94.2%', label: 'fraud detection accuracy' },
  { value: '3.1x', label: 'avg ROAS uplift' },
];

export const heroCards = [
  {
    cls: 'card-a',
    name: 'Maya Iyer',
    handle: '@mayaeats · Food & Lifestyle',
    scoreText: '98% MATCH',
    scoreStyle: {},
    bars: [
      { label: 'Authenticity', value: '96', width: '96%' },
      { label: 'Audience Fit', value: '91', width: '91%' },
    ],
  },
  {
    cls: 'card-b',
    name: 'Rohan Verma',
    handle: '@rohanlifts · Fitness',
    scoreText: '91% MATCH',
    scoreStyle: { background: 'var(--ink)', color: 'var(--lime)' },
    bars: [
      { label: 'Engagement', value: '88', width: '88%', color: 'var(--lime)' },
      { label: 'Risk', value: 'Low', width: '14%', color: 'var(--lime)' },
    ],
  },
  {
    cls: 'card-c',
    name: '@growth.guru21',
    handle: 'Suspicious follower spike',
    scoreText: 'FLAGGED',
    scoreStyle: { background: 'var(--ink)', color: 'var(--coral)' },
    bars: [
      { label: 'Bot ratio', value: '62%', width: '62%', color: 'var(--ink)' },
    ],
  },
];

// ── MARQUEE ──
export const marqueeItems = [
  'DISCOVERY', '·', 'FRAUD DETECTION', '·', 'CAMPAIGN MANAGEMENT', '·',
  'ROI PREDICTION', '·', 'POST-CAMPAIGN INTELLIGENCE', '·',
];

// ── PAIN POINTS ──
export const painCards = [
  { id: '01', title: 'Manual creator discovery', desc: "Hours of scrolling hashtags and guessing who's actually relevant to your audience." },
  { id: '02', title: 'Fake followers & bots', desc: 'Up to a third of "engagement" on mid-tier creators can be inflated or purchased.' },
  { id: '03', title: 'Spreadsheet workflows', desc: 'Outreach, contracts, deliverables and payments tracked across five disconnected tabs.' },
  { id: '04', title: 'No ROI forecasting', desc: 'Budgets get approved on vibes, not modeled outcomes — so failure is a surprise.' },
];

export const workflowSteps = [
  'BRAND', 'MANUAL CREATOR SEARCH', 'SPREADSHEET MGMT',
  'COLD OUTREACH', 'MANUAL TRACKING', 'DELAYED REPORTING',
];

// ── KPIs ──
export const kpis = [
  { label: 'Active Campaigns', val: '18', delta: '↑ 4 this month', type: 'up' },
  { label: 'Total Reach', val: '42.6M', delta: '↑ 12.3% vs last qtr', type: 'up' },
  { label: 'Avg Engagement Rate', val: '5.8%', delta: '↑ 0.6pt', type: 'up' },
  { label: 'Overall ROI', val: '3.4x', delta: '↑ 0.4x vs target', type: 'up' },
];

// ── MARKET ──
export const marketChartData = [62, 78, 98, 128, 165, 210, 250];
export const marketYears = ['2021', '2022', '2023', '2024', '2025', '2026', '2027P'];

export const marketStats = [
  { value: '$250B', label: 'Global influencer marketing spend by 2027', cls: '' },
  { value: '29% CAGR', label: 'Industry compound annual growth rate', cls: 'alt' },
  { value: '<9%', label: 'Brands using AI in creator selection today', cls: 'alt2' },
];

export const compareRows = [
  { cap: 'Discovery', old: 'Manual hashtag search', new: 'AI-matched in seconds' },
  { cap: 'Fraud Prevention', old: 'Eyeballed follower counts', new: 'Automated authenticity scoring' },
  { cap: 'Campaign Tracking', old: 'Shared spreadsheets', new: 'Visual pipeline, single source of truth' },
  { cap: 'ROI Forecasting', old: 'None — find out at the end', new: 'Modeled before launch, 3 scenarios' },
  { cap: 'Analytics', old: 'Fragmented across 4–5 tools', new: 'Unified, AI-generated insights' },
  { cap: 'Launch Speed', old: '3–4 weeks average', new: 'Under 48 hours' },
];

// ── MODULES: Discovery ──
export const discoveryCreators = [
  {
    name: 'Ananya Rao', handle: '@ananyaskin · 184K followers · Mumbai',
    tags: ['Skincare', '96% Authentic', 'High Brand Affinity'],
    score: 97, gradient: 'linear-gradient(135deg,var(--coral),var(--violet))',
  },
  {
    name: 'Kavya Menon', handle: '@glowwithkavya · 92K followers · Bengaluru',
    tags: ['Clean Beauty', '91% Authentic', 'Strong Engagement'],
    score: 93, gradient: 'linear-gradient(135deg,var(--lime),var(--coral))',
  },
  {
    name: 'Devika Shetty', handle: '@devikatalks · 310K followers · Pune',
    tags: ['Lifestyle', '88% Authentic', 'Niche Trust'],
    score: 89, gradient: 'linear-gradient(135deg,var(--violet),var(--lime))',
  },
];

// ── MODULES: Pipeline ──
export const pipelineColumns = [
  { title: 'Recommended', count: 4, cards: [{ name: 'Ishaan Kapoor', meta: 'Tech · 240K · ₹45K' }, { name: 'Priya Nair', meta: 'Beauty · 88K · ₹22K' }] },
  { title: 'Contacted', count: 3, cards: [{ name: 'Ananya Rao', meta: 'Skincare · Sent brief Jun 12' }] },
  { title: 'Negotiating', count: 2, cards: [{ name: 'Devika Shetty', meta: 'Countered ₹38K' }] },
  { title: 'Active', count: 5, cards: [{ name: 'Kavya Menon', meta: '2 of 3 deliverables done' }, { name: 'Rohan Verma', meta: 'Live since Jun 9' }] },
  { title: 'Completed', count: 12, cards: [{ name: 'Meera Joshi', meta: 'Final report ready' }] },
];

// ── MODULES: ROI ──
export const roiScenarios = [
  { cls: 'cons', title: 'Conservative', num: '2.1x', sub: '₹8.4L revenue on ₹4L spend' },
  { cls: 'real', title: 'Realistic', num: '3.6x', sub: '₹14.4L revenue on ₹4L spend' },
  { cls: 'opt', title: 'Optimistic', num: '5.2x', sub: '₹20.8L revenue on ₹4L spend' },
];

// ── MODULES: Insights ──
export const insightCards = [
  { title: 'Performance Summary', body: 'Actual reach beat prediction by 14%, but conversions landed 6% under forecast — engagement quality outpaced purchase intent this cycle.' },
  { title: 'Top Performer', body: 'Ananya Rao drove 38% of campaign revenue from 19% of spend — clear candidate to rehire with an expanded content mix.' },
  { title: 'Content Intelligence', body: 'Reels posted between 7–9PM IST outperformed static posts 3:1 on saves and outperformed morning slots by 2.4x on watch time.' },
  { title: 'Audience Intelligence', body: '62% of engaged audience clustered in Tier-1 metros, skewing 24–29 — narrower than the original 22–34 brief assumed.' },
  { title: 'Next Campaign Plan', body: 'Rehire 2 creators, replace 1 underperformer, shift 20% budget to Reels, and launch the next wave on a Thursday evening slot.' },
  { title: 'Export', body: 'Full PDF report includes executive summary, creator-level ROI breakdown, and an optimization playbook for your next brief.' },
];

// ── TESTIMONIALS ──
export const testimonials = [
  { quote: '"We cut creator vetting time from two weeks to about two hours. The fraud scoring alone paid for the platform in the first month."', name: 'Naina Kapoor', role: 'Head of Growth, Bloomvale Skincare' },
  { quote: '"The ROI predictor changed how we pitch budgets internally — we walk into planning meetings with scenarios, not hope."', name: 'Arjun Mehta', role: 'CMO, Northwind Foods' },
  { quote: '"Post-campaign reports used to take our team a full week. PickUP generates a sharper version in minutes."', name: 'Sara Thomas', role: 'Marketing Director, Loop Apparel' },
];

// ── FOOTER ──
export const footerColumns = [
  { title: 'Product', links: [{ label: 'Discovery', href: '#modules' }, { label: 'Fraud Detection', href: '#modules' }, { label: 'ROI Predictor', href: '#modules' }, { label: 'AI Insights', href: '#modules' }] },
  { title: 'Company', links: [{ label: 'About', href: '#' }, { label: 'Market', href: '#market' }, { label: 'Careers', href: '#' }, { label: 'Contact', href: '#' }] },
  { title: 'Resources', links: [{ label: 'Docs', href: '#' }, { label: 'API', href: '#' }, { label: 'Status', href: '#' }, { label: 'Support', href: '#' }] },
];
