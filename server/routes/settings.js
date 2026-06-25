import { Router } from 'express';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { loadJson, saveJson } from '../utils/dataStore.js';
import { supabase } from '../utils/supabase.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_PATH = join(__dirname, '..', 'data', 'settings.json');

const EMPTY_SETTINGS = { groups: [], notifications: {}, workspaceHealth: {} };

function loadSettings() {
  return loadJson(DATA_PATH, EMPTY_SETTINGS);
}

function saveSettings(data) {
  return saveJson(DATA_PATH, data);
}

const router = Router();

/**
 * GET /api/settings
 * Get all workspace settings
 */
router.get('/', async (req, res, next) => {
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('settings')
        .select('*');

      if (!error && data) {
        const groups = data.find((s) => s.key === 'groups')?.value || [];
        const notifications = data.find((s) => s.key === 'notifications')?.value || {};
        const workspaceHealth = data.find((s) => s.key === 'workspaceHealth')?.value || {};

        return res.json({
          success: true,
          groups,
          notifications,
          workspaceHealth,
        });
      }
      console.error('[Supabase] Failed to fetch settings, falling back:', error?.message);
    }

    // JSON fallback
    const data = loadSettings();
    res.json({ success: true, ...data });
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/settings/:group
 * Update a specific settings group
 * Body: { fields: [...] } or { emailAlerts, fraudAlerts, campaignUpdates }
 */
router.put('/:group', async (req, res, next) => {
  try {
    const groupName = req.params.group.toLowerCase();

    if (supabase) {
      if (groupName === 'notifications') {
        const { data: current, error: getErr } = await supabase
          .from('settings')
          .select('*')
          .eq('key', 'notifications')
          .maybeSingle();

        const currentVal = current?.value || {};
        const newVal = { ...currentVal, ...req.body };

        const { error: setErr } = await supabase
          .from('settings')
          .upsert({ key: 'notifications', value: newVal });

        if (!setErr) {
          return res.json({ success: true, notifications: newVal });
        }
        console.error('[Supabase] Failed to save notifications, falling back:', setErr.message);
      } else {
        const { data: current, error: getErr } = await supabase
          .from('settings')
          .select('*')
          .eq('key', 'groups')
          .maybeSingle();

        const groups = current?.value || [];
        const groupIdx = groups.findIndex(
          (g) => g.title.toLowerCase() === groupName
        );

        if (groupIdx !== -1) {
          if (req.body.fields) {
            groups[groupIdx].fields = req.body.fields;
          }

          const { error: setErr } = await supabase
            .from('settings')
            .upsert({ key: 'groups', value: groups });

          if (!setErr) {
            return res.json({ success: true, group: groups[groupIdx] });
          }
          console.error('[Supabase] Failed to save setting groups, falling back:', setErr.message);
        }
      }
    }

    // JSON fallback
    const data = loadSettings();

    // Handle notification preferences
    if (groupName === 'notifications') {
      data.notifications = { ...data.notifications, ...req.body };
      if (!saveSettings(data)) {
        return res.status(500).json({ success: false, error: 'Failed to save settings' });
      }
      return res.json({ success: true, notifications: data.notifications });
    }

    // Handle settings groups
    const groups = data.groups || [];
    const groupIdx = groups.findIndex(
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

    if (!saveSettings(data)) {
      return res.status(500).json({ success: false, error: 'Failed to save settings' });
    }

    res.json({ success: true, group: data.groups[groupIdx] });
  } catch (err) {
    next(err);
  }
});

export default router;
