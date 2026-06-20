import { Router } from 'express';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_PATH = join(__dirname, '..', 'data', 'settings.json');

function loadSettings() {
  return JSON.parse(readFileSync(DATA_PATH, 'utf-8'));
}

function saveSettings(data) {
  writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

const router = Router();

/**
 * GET /api/settings
 * Get all workspace settings
 */
router.get('/', (req, res) => {
  const data = loadSettings();
  res.json({ success: true, ...data });
});

/**
 * PUT /api/settings/:group
 * Update a specific settings group
 * Body: { fields: [...] } or { emailAlerts, fraudAlerts, campaignUpdates }
 */
router.put('/:group', (req, res) => {
  const data = loadSettings();
  const groupName = req.params.group.toLowerCase();

  // Handle notification preferences
  if (groupName === 'notifications') {
    data.notifications = { ...data.notifications, ...req.body };
    saveSettings(data);
    return res.json({ success: true, notifications: data.notifications });
  }

  // Handle settings groups
  const groupIdx = data.groups.findIndex(
    (g) => g.title.toLowerCase() === groupName
  );

  if (groupIdx === -1) {
    return res.status(404).json({
      success: false,
      error: `Settings group "${req.params.group}" not found`,
    });
  }

  if (req.body.fields) {
    data.groups[groupIdx].fields = req.body.fields;
  }

  saveSettings(data);
  res.json({ success: true, group: data.groups[groupIdx] });
});

export default router;
