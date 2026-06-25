import { Router } from 'express';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { loadJson, saveJson } from '../utils/dataStore.js';
import { supabase } from '../utils/supabase.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_PATH = join(__dirname, '..', 'data', 'creators.json');

const EMPTY_DATA = { creators: [] };

function loadCreators() {
  return loadJson(DATA_PATH, EMPTY_DATA);
}

function saveCreators(data) {
  return saveJson(DATA_PATH, data);
}

function mapCreatorDbToFrontend(c) {
  return {
    id: c.id,
    name: c.name,
    handle: c.handle,
    niche: c.niche,
    platform: c.platform,
    followers: c.followers,
    followersNum: c.followers_num,
    engagement: c.engagement,
    match: c.match,
    authenticity: c.authenticity,
    cost: c.cost,
    region: c.region,
    tags: c.tags,
    gradient: c.gradient,
  };
}

const router = Router();

/**
 * GET /api/creators
 * List all creators, with optional query filters:
 *   ?niche=Fitness  ?platform=Instagram  ?minMatch=90
 */
router.get('/', async (req, res, next) => {
  try {
    const { niche, platform, minMatch } = req.query;

    if (supabase) {
      let query = supabase.from('creators').select('*');

      if (niche) {
        query = query.ilike('niche', `%${niche}%`);
      }
      if (platform) {
        query = query.eq('platform', platform);
      }
      if (minMatch) {
        query = query.gte('match', Number(minMatch));
      }

      const { data: creators, error } = await query;
      if (!error && creators) {
        return res.json({
          success: true,
          count: creators.length,
          creators: creators.map(mapCreatorDbToFrontend),
        });
      }
      console.error('[Supabase] Failed to fetch creators, falling back:', error?.message);
    }

    // JSON fallback
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
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/creators/:handle
 * Get a single creator by handle (with or without @)
 */
router.get('/:handle', async (req, res, next) => {
  try {
    const handle = req.params.handle.startsWith('@')
      ? req.params.handle
      : `@${req.params.handle}`;

    if (supabase) {
      const { data: creator, error } = await supabase
        .from('creators')
        .select('*')
        .ilike('handle', handle)
        .maybeSingle();

      if (!error && creator) {
        return res.json({ success: true, creator: mapCreatorDbToFrontend(creator) });
      }
      if (error) {
        console.error('[Supabase] Failed to fetch creator by handle:', error.message);
      }
    }

    // JSON fallback
    const { creators } = loadCreators();
    const creator = creators.find(
      (c) => c.handle.toLowerCase() === handle.toLowerCase()
    );

    if (!creator) {
      return res.status(404).json({ success: false, error: 'Creator not found' });
    }

    res.json({ success: true, creator });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/creators
 * Add a new creator
 * Body: { name, handle, niche, platform, followers, engagement, match, authenticity, cost, region }
 */
router.post('/', async (req, res, next) => {
  try {
    const { name, handle, niche, platform } = req.body;

    if (!name || !handle || !niche || !platform) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: name, handle, niche, platform',
      });
    }

    const creatorId = name.toLowerCase().replace(/\s+/g, '-');

    if (supabase) {
      // Check existing creator
      const { data: existing, error: checkError } = await supabase
        .from('creators')
        .select('handle')
        .ilike('handle', handle)
        .maybeSingle();

      if (!checkError && existing) {
        return res.status(409).json({
          success: false,
          error: `Creator with handle ${handle} already exists`,
        });
      }

      const record = {
        id: creatorId,
        name,
        handle,
        niche,
        platform,
        followers: req.body.followers || '0',
        followers_num: req.body.followersNum || 0,
        engagement: req.body.engagement || '0%',
        match: req.body.match || 0,
        authenticity: req.body.authenticity || 0,
        cost: req.body.cost || '$0',
        region: req.body.region || 'Unknown',
        tags: req.body.tags || [],
        gradient: req.body.gradient || 'linear-gradient(135deg,#ff6b6b,#a855f7)',
      };

      const { data: inserted, error: insertError } = await supabase
        .from('creators')
        .insert([record])
        .select()
        .single();

      if (!insertError && inserted) {
        return res.status(201).json({ success: true, creator: mapCreatorDbToFrontend(inserted) });
      }
      console.error('[Supabase] Failed to insert creator, falling back:', insertError?.message);
    }

    // JSON fallback
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
      id: creatorId,
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

    if (!saveCreators(data)) {
      return res.status(500).json({ success: false, error: 'Failed to save creator data' });
    }

    res.status(201).json({ success: true, creator: newCreator });
  } catch (err) {
    next(err);
  }
});

export default router;
