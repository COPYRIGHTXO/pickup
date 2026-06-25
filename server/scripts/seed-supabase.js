import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { supabase } from '../utils/supabase.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

function readJsonFile(fileName) {
  const filePath = join(__dirname, '..', 'data', fileName);
  if (!existsSync(filePath)) {
    console.error(`[Seed] File not found: ${filePath}`);
    return null;
  }
  return JSON.parse(readFileSync(filePath, 'utf-8'));
}

async function seed() {
  if (!supabase) {
    console.error('[Seed] Error: Supabase client is not initialized. Please verify SUPABASE_URL and SUPABASE_ANON_KEY in your .env file.');
    process.exit(1);
  }

  console.log('[Seed] Starting Supabase database seeding...');

  try {
    // 1. Seed creators
    const creatorsData = readJsonFile('creators.json');
    if (creatorsData && creatorsData.creators) {
      console.log(`[Seed] Uploading ${creatorsData.creators.length} creators...`);
      for (const creator of creatorsData.creators) {
        // Map database fields
        const record = {
          id: creator.id,
          name: creator.name,
          handle: creator.handle,
          niche: creator.niche,
          platform: creator.platform,
          followers: creator.followers,
          followers_num: creator.followersNum || 0,
          engagement: creator.engagement,
          match: creator.match || 0,
          authenticity: creator.authenticity || 0,
          cost: creator.cost,
          region: creator.region,
          tags: creator.tags || [],
          gradient: creator.gradient,
        };

        const { error } = await supabase.from('creators').upsert(record);
        if (error) {
          console.error(`[Seed] Error seeding creator ${creator.handle}:`, error.message);
        }
      }
    }

    // 2. Seed campaigns
    const campaignsData = readJsonFile('campaigns.json');
    if (campaignsData) {
      if (campaignsData.campaigns) {
        console.log(`[Seed] Uploading ${campaignsData.campaigns.length} campaigns...`);
        for (const camp of campaignsData.campaigns) {
          const record = {
            id: camp.id,
            name: camp.name,
            status: camp.status || 'Active',
            budget: camp.budget,
            budget_num: camp.budgetNum || 0,
            creators: camp.creators || 0,
            roi: camp.roi || 'Pending',
            due: camp.due || 'TBD',
            brand: camp.brand || 'Unknown',
            created_at: camp.createdAt || new Date().toISOString().split('T')[0],
          };

          const { error } = await supabase.from('campaigns').upsert(record);
          if (error) {
            console.error(`[Seed] Error seeding campaign ${camp.name}:`, error.message);
          }
        }
      }

      // Seed campaigns metadata (calendar, activity, summary)
      console.log('[Seed] Uploading campaigns metadata (calendar, activity, summary)...');
      if (campaignsData.calendar) {
        await supabase.from('campaigns_metadata').upsert({ key: 'calendar', value: campaignsData.calendar });
      }
      if (campaignsData.activity) {
        await supabase.from('campaigns_metadata').upsert({ key: 'activity', value: campaignsData.activity });
      }
      if (campaignsData.summary) {
        await supabase.from('campaigns_metadata').upsert({ key: 'summary', value: campaignsData.summary });
      }
    }

    // 3. Seed pipeline
    const pipelineData = readJsonFile('pipeline.json');
    if (pipelineData && pipelineData.pipeline) {
      console.log('[Seed] Uploading pipeline stages...');
      let order = 0;
      for (const stage of pipelineData.pipeline) {
        const { error } = await supabase.from('pipeline').upsert({
          stage: stage.stage,
          items: stage.items || [],
          display_order: order++,
        });
        if (error) {
          console.error(`[Seed] Error seeding pipeline stage ${stage.stage}:`, error.message);
        }
      }
    }

    // 4. Seed contact submissions
    const submissionsData = readJsonFile('contact-submissions.json');
    if (submissionsData && Array.isArray(submissionsData)) {
      console.log(`[Seed] Uploading ${submissionsData.length} contact submissions...`);
      for (const sub of submissionsData) {
        const { error } = await supabase.from('contact_submissions').upsert({
          id: sub.id,
          email: sub.email,
          goal: sub.goal || '',
          name: sub.name || '',
          company: sub.company || '',
          message: sub.message || '',
          submitted_at: sub.submittedAt || new Date().toISOString(),
          status: sub.status || 'new',
        });
        if (error) {
          console.error(`[Seed] Error seeding submission ${sub.email}:`, error.message);
        }
      }
    }

    // 5. Seed settings
    const settingsData = readJsonFile('settings.json');
    if (settingsData) {
      console.log('[Seed] Uploading settings data...');
      if (settingsData.groups) {
        await supabase.from('settings').upsert({ key: 'groups', value: settingsData.groups });
      }
      if (settingsData.notifications) {
        await supabase.from('settings').upsert({ key: 'notifications', value: settingsData.notifications });
      }
      if (settingsData.workspaceHealth) {
        await supabase.from('settings').upsert({ key: 'workspaceHealth', value: settingsData.workspaceHealth });
      }
    }

    // 6. Seed fraud signals
    const fraudData = readJsonFile('fraud.json');
    if (fraudData) {
      console.log('[Seed] Uploading fraud signal data...');
      if (fraudData.signals) {
        await supabase.from('fraud').upsert({ key: 'signals', value: fraudData.signals });
      }
      if (fraudData.redFlags) {
        await supabase.from('fraud').upsert({ key: 'redFlags', value: fraudData.redFlags });
      }
      if (fraudData.greenSignals) {
        await supabase.from('fraud').upsert({ key: 'greenSignals', value: fraudData.greenSignals });
      }
      if (fraudData.verdictTemplates) {
        await supabase.from('fraud').upsert({ key: 'verdictTemplates', value: fraudData.verdictTemplates });
      }
    }

    // 7. Seed ROI data
    const roiData = readJsonFile('roi.json');
    if (roiData) {
      console.log('[Seed] Uploading ROI prediction data...');
      if (roiData.scenarios) {
        await supabase.from('roi').upsert({ key: 'scenarios', value: roiData.scenarios });
      }
      if (roiData.defaultInputs) {
        await supabase.from('roi').upsert({ key: 'defaultInputs', value: roiData.defaultInputs });
      }
      if (roiData.predictionEngine) {
        await supabase.from('roi').upsert({ key: 'predictionEngine', value: roiData.predictionEngine });
      }
      if (roiData.recommendations) {
        await supabase.from('roi').upsert({ key: 'recommendations', value: roiData.recommendations });
      }
    }

    // 8. Seed site content
    const siteData = readJsonFile('site.json');
    if (siteData) {
      console.log('[Seed] Uploading site landing content...');
      if (siteData.heroTrust) {
        await supabase.from('site').upsert({ key: 'heroTrust', value: siteData.heroTrust });
      }
      if (siteData.kpis) {
        await supabase.from('site').upsert({ key: 'kpis', value: siteData.kpis });
      }
      if (siteData.marketStats) {
        await supabase.from('site').upsert({ key: 'marketStats', value: siteData.marketStats });
      }
      if (siteData.testimonials) {
        await supabase.from('site').upsert({ key: 'testimonials', value: siteData.testimonials });
      }
    }

    console.log('[Seed] Seeding completed successfully!');
  } catch (err) {
    console.error('[Seed] Seeding failed with error:', err.message);
  }
}

seed();
