import { Router } from 'express';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_PATH = join(__dirname, '..', 'data', 'creators.json');

function loadCreators() {
  return JSON.parse(readFileSync(DATA_PATH, 'utf-8'));
}

function saveCreators(data) {
  writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

const router = Router();

/**
 * GET /api/creators
 * List all creators, with optional query filters:
 *   ?niche=Fitness  ?platform=Instagram  ?minMatch=90
 */
router.get('/', (req, res) => {
  const { niche, platform, minMatch } = req.query;
  let { creators } = loadCreators();

  if (niche) {
    creators = creators.filter(
      (c) => c.niche.toLowerCase().includes(niche.toLowerCase())
    );
  }
  if (platform) {
    creators = creators.filter(
      (c) => c.platform.toLowerCase() === platform.toLowerCase()
    );
  }
  if (minMatch) {
    creators = creators.filter((c) => c.match >= Number(minMatch));
  }

  res.json({ success: true, count: creators.length, creators });
});

/**
 * GET /api/creators/:handle
 * Get a single creator by handle (with or without @)
 */
router.get('/:handle', (req, res) => {
  const handle = req.params.handle.startsWith('@')
    ? req.params.handle
    : `@${req.params.handle}`;

  const { creators } = loadCreators();
  const creator = creators.find(
    (c) => c.handle.toLowerCase() === handle.toLowerCase()
  );

  if (!creator) {
    return res.status(404).json({ success: false, error: 'Creator not found' });
  }

  res.json({ success: true, creator });
});

/**
 * POST /api/creators
 * Add a new creator
 * Body: { name, handle, niche, platform, followers, engagement, match, authenticity, cost, region }
 */
router.post('/', (req, res) => {
  const { name, handle, niche, platform } = req.body;

  if (!name || !handle || !niche || !platform) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields: name, handle, niche, platform',
    });
  }

  const data = loadCreators();
  const existing = data.creators.find(
    (c) => c.handle.toLowerCase() === handle.toLowerCase()
  );

  if (existing) {
    return res.status(409).json({
      success: false,
      error: `Creator with handle ${handle} already exists`,
    });
  }

  const newCreator = {
    id: name.toLowerCase().replace(/\s+/g, '-'),
    name,
    handle,
    niche,
    platform,
    followers: req.body.followers || '0',
    followersNum: req.body.followersNum || 0,
    engagement: req.body.engagement || '0%',
    match: req.body.match || 0,
    authenticity: req.body.authenticity || 0,
    cost: req.body.cost || '$0',
    region: req.body.region || 'Unknown',
    tags: req.body.tags || [],
    gradient: req.body.gradient || 'linear-gradient(135deg,#ff6b6b,#a855f7)',
  };

  data.creators.push(newCreator);
  saveCreators(data);

  res.status(201).json({ success: true, creator: newCreator });
});

export default router;
