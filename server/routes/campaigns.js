import { Router } from 'express';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { loadJson, saveJson } from '../utils/dataStore.js';
import { supabase } from '../utils/supabase.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CAMPAIGN_PATH = join(__dirname, '..', 'data', 'campaigns.json');
const PIPELINE_PATH = join(__dirname, '..', 'data', 'pipeline.json');

const EMPTY_CAMIGNS = { campaigns: [], calendar: [], activity: [], summary: {} };
const EMPTY_PIPELINE = { pipeline: [] };

function loadCampaigns() {
  return loadJson(CAMPAIGN_PATH, EMPTY_CAMIGNS);
}

function saveCampaigns(data) {
  return saveJson(CAMPAIGN_PATH, data);
}

function loadPipeline() {
  return loadJson(PIPELINE_PATH, EMPTY_PIPELINE);
}

function mapCampaignDbToFrontend(c) {
  return {
    id: c.id,
    name: c.name,
    status: c.status,
    budget: c.budget,
    budgetNum: c.budget_num,
    creators: c.creators,
    roi: c.roi,
    due: c.due,
    brand: c.brand,
    createdAt: c.created_at,
  };
}

const router = Router();

/**
 * GET /api/campaigns
 * List all campaigns
 */
router.get('/', async (req, res, next) => {
  try {
    if (supabase) {
      const { data: campaigns, error: campError } = await supabase
        .from('campaigns')
        .select('*');

      const { data: metadata, error: metaError } = await supabase
        .from('campaigns_metadata')
        .select('*');

      if (!campError && campaigns && !metaError && metadata) {
        const calendar = metadata.find((m) => m.key === 'calendar')?.value || [];
        const activity = metadata.find((m) => m.key === 'activity')?.value || [];
        const summary = metadata.find((m) => m.key === 'summary')?.value || {};

        return res.json({
          success: true,
          campaigns: campaigns.map(mapCampaignDbToFrontend),
          calendar,
          activity,
          summary,
        });
      }
      console.error('[Supabase] Failed to fetch campaigns or metadata, falling back:', campError?.message || metaError?.message);
    }

    // JSON fallback
    const data = loadCampaigns();
    res.json({ success: true, ...data });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/campaigns/pipeline
 * Get the Kanban pipeline data
 */
router.get('/pipeline', async (req, res, next) => {
  try {
    if (supabase) {
      const { data: pipeline, error } = await supabase
        .from('pipeline')
        .select('*')
        .order('display_order', { ascending: true });

      if (!error && pipeline) {
        return res.json({
          success: true,
          pipeline: pipeline.map((p) => ({
            stage: p.stage,
            items: p.items || [],
          })),
        });
      }
      console.error('[Supabase] Failed to fetch pipeline, falling back:', error?.message);
    }

    // JSON fallback
    const data = loadPipeline();
    res.json({ success: true, ...data });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/campaigns/:id
 * Get a single campaign by ID
 */
router.get('/:id', async (req, res, next) => {
  try {
    if (supabase) {
      const { data: campaign, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('id', req.params.id)
        .maybeSingle();

      if (!error && campaign) {
        return res.json({ success: true, campaign: mapCampaignDbToFrontend(campaign) });
      }
      if (error) {
        console.error('[Supabase] Failed to fetch campaign, falling back:', error.message);
      }
    }

    // JSON fallback
    const data = loadCampaigns();
    const campaign = data.campaigns.find((c) => c.id === req.params.id);

    if (!campaign) {
      return res.status(404).json({ success: false, error: 'Campaign not found' });
    }

    res.json({ success: true, campaign });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/campaigns
 * Create a new campaign
 * Body: { name, budget, creators, brand }
 */
router.post('/', async (req, res, next) => {
  try {
    const { name, budget, brand } = req.body;

    if (!name || !budget) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: name, budget',
      });
    }

    const campaignId = name.toLowerCase().replace(/\s+/g, '-');
    const budgetNum = parseInt(budget.replace(/[^0-9]/g, ''), 10) || 0;
    const creatorsCount = req.body.creators || 0;
    const dueField = req.body.due || 'TBD';
    const brandField = brand || 'Unknown';
    const today = new Date().toISOString().split('T')[0];

    if (supabase) {
      const record = {
        id: campaignId,
        name,
        status: 'Active',
        budget,
        budget_num: budgetNum,
        creators: creatorsCount,
        roi: 'Pending',
        due: dueField,
        brand: brandField,
        created_at: today,
      };

      const { data: inserted, error } = await supabase
        .from('campaigns')
        .insert([record])
        .select()
        .single();

      if (!error && inserted) {
        return res.status(201).json({ success: true, campaign: mapCampaignDbToFrontend(inserted) });
      }
      console.error('[Supabase] Failed to insert campaign, falling back:', error?.message);
    }

    // JSON fallback
    const data = loadCampaigns();

    const newCampaign = {
      id: campaignId,
      name,
      status: 'Active',
      budget,
      budgetNum,
      creators: creatorsCount,
      roi: 'Pending',
      due: dueField,
      brand: brandField,
      createdAt: today,
    };

    data.campaigns.push(newCampaign);

    if (!saveCampaigns(data)) {
      return res.status(500).json({ success: false, error: 'Failed to save campaign data' });
    }

    res.status(201).json({ success: true, campaign: newCampaign });
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/campaigns/:id
 * Update a campaign's status or other fields
 * Body: any campaign fields to update (id cannot be changed)
 */
router.put('/:id', async (req, res, next) => {
  try {
    const { id: _discardedId, ...updateFields } = req.body;

    if (supabase) {
      // Map update fields to database fields
      const record = {};
      if (updateFields.name !== undefined) record.name = updateFields.name;
      if (updateFields.status !== undefined) record.status = updateFields.status;
      if (updateFields.budget !== undefined) {
        record.budget = updateFields.budget;
        record.budget_num = parseInt(updateFields.budget.replace(/[^0-9]/g, ''), 10) || 0;
      }
      if (updateFields.budgetNum !== undefined) record.budget_num = updateFields.budgetNum;
      if (updateFields.creators !== undefined) record.creators = updateFields.creators;
      if (updateFields.roi !== undefined) record.roi = updateFields.roi;
      if (updateFields.due !== undefined) record.due = updateFields.due;
      if (updateFields.brand !== undefined) record.brand = updateFields.brand;
      if (updateFields.createdAt !== undefined) record.created_at = updateFields.createdAt;

      const { data: updated, error } = await supabase
        .from('campaigns')
        .update(record)
        .eq('id', req.params.id)
        .select()
        .single();

      if (!error && updated) {
        return res.json({ success: true, campaign: mapCampaignDbToFrontend(updated) });
      }
      console.error('[Supabase] Failed to update campaign, falling back:', error?.message);
    }

    // JSON fallback
    const data = loadCampaigns();
    const idx = data.campaigns.findIndex((c) => c.id === req.params.id);

    if (idx === -1) {
      return res.status(404).json({ success: false, error: 'Campaign not found' });
    }

    data.campaigns[idx] = { ...data.campaigns[idx], ...updateFields };

    if (!saveCampaigns(data)) {
      return res.status(500).json({ success: false, error: 'Failed to save campaign data' });
    }

    res.json({ success: true, campaign: data.campaigns[idx] });
  } catch (err) {
    next(err);
  }
});

export default router;
