import { Router } from 'express';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_PATH = join(__dirname, '..', 'data', 'site.json');

function loadSite() {
  return JSON.parse(readFileSync(DATA_PATH, 'utf-8'));
}

const router = Router();

/**
 * GET /api/site
 * Get all landing page content data
 */
router.get('/', (req, res) => {
  const data = loadSite();
  res.json({ success: true, ...data });
});

export default router;
