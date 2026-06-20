export const routes = [
  { path: '/', label: 'Home' },
  { path: '/creator-discovery', label: 'Creator Discovery' },
  { path: '/fraud-detection', label: 'Fraud Detection' },
  { path: '/campaign-management', label: 'Campaigns' },
  { path: '/roi-predictor', label: 'ROI Predictor' },
  { path: '/contact', label: 'Contact' },
  { path: '/settings', label: 'Settings' },
];

export const creators = [
  { name: 'Maya Iyer', handle: '@mayaeats', niche: 'Food + Lifestyle', platform: 'Instagram', followers: '482K', engagement: '7.2%', match: 98, authenticity: 96, cost: '$9,400' },
  { name: 'Rohan Verma', handle: '@rohanlifts', niche: 'Fitness', platform: 'YouTube', followers: '310K', engagement: '6.4%', match: 91, authenticity: 94, cost: '$7,800' },
  { name: 'Ananya Rao', handle: '@ananyaskin', niche: 'Clean Beauty', platform: 'TikTok', followers: '615K', engagement: '8.1%', match: 97, authenticity: 95, cost: '$12,200' },
  { name: 'Kavya Menon', handle: '@glowwithkavya', niche: 'Skincare', platform: 'Instagram', followers: '184K', engagement: '9.3%', match: 93, authenticity: 98, cost: '$5,600' },
];

export const campaigns = [
  { name: 'Glow Serum Launch', status: 'Active', budget: '$72K', creators: 12, roi: '3.8x', due: 'Jun 28' },
  { name: 'FlexFuel Summer', status: 'Negotiating', budget: '$48K', creators: 7, roi: '2.6x', due: 'Jul 04' },
  { name: 'Loop Apparel Drop', status: 'Reporting', budget: '$96K', creators: 18, roi: '4.9x', due: 'Done' },
];

export const fraudSignals = [
  { label: 'Fake followers', value: 7, note: 'Below category danger line' },
  { label: 'Suspicious engagement', value: 11, note: 'Two posts need review' },
  { label: 'Bot comment clusters', value: 4, note: 'Low automated language' },
  { label: 'Comment quality', value: 89, note: 'Strong purchase intent' },
];

export const roiScenarios = [
  { name: 'Conservative', reach: '4.8M', revenue: '$118K', roi: '2.1x' },
  { name: 'Expected', reach: '7.2M', revenue: '$214K', roi: '3.6x' },
  { name: 'Optimistic', reach: '10.6M', revenue: '$338K', roi: '5.2x' },
];

export const pipeline = [
  { stage: 'Recommended', items: ['Maya Iyer', 'Kavya Menon'] },
  { stage: 'Contacted', items: ['Rohan Verma'] },
  { stage: 'Negotiating', items: ['Ananya Rao'] },
  { stage: 'Approved', items: ['Devika Shetty'] },
  { stage: 'Live', items: ['Meera Joshi', 'Ishaan Kapoor'] },
];

export const settingsGroups = [
  { title: 'Workspace', fields: ['Brand name: Bloomvale Skincare', 'Team seats: 12 active', 'Default market: India + US'] },
  { title: 'Integrations', fields: ['Instagram connected', 'YouTube connected', 'TikTok review required'] },
  { title: 'AI Preferences', fields: ['Prioritize ROI quality', 'Flag fraud above 18%', 'Auto-suggest replacements'] },
];
