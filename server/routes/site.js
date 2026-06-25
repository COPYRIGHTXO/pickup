import { Router } from 'express';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { loadJson } from '../utils/dataStore.js';
import { supabase } from '../utils/supabase.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_PATH = join(__dirname, '..', 'data', 'site.json');

const EMPTY_SITE = { heroTrust: [], kpis: [], marketStats: [], testimonials: [] };

function loadSite() {
  return loadJson(DATA_PATH, EMPTY_SITE);
}

const router = Router();

/**
 * GET /api/site
 * Get all landing page content data
 */
router.get('/', async (req, res, next) => {
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('site')
        .select('*');

      if (!error && data) {
        const heroTrust = data.find((s) => s.key === 'heroTrust')?.value || [];
        const kpis = data.find((s) => s.key === 'kpis')?.value || [];
        const marketStats = data.find((s) => s.key === 'marketStats')?.value || [];
        const testimonials = data.find((s) => s.key === 'testimonials')?.value || [];

        return res.json({
          success: true,
          heroTrust,
          kpis,
          marketStats,
          testimonials,
        });
      }
      console.error('[Supabase] Failed to fetch site content, falling back:', error?.message);
    }

    // JSON fallback
    const data = loadSite();
    res.json({ success: true, ...data });
  } catch (err) {
    next(err);
  }
});

export default router;
