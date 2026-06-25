import { Router } from 'express';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { loadJson, saveJson } from '../utils/dataStore.js';
import { supabase } from '../utils/supabase.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SUBMISSIONS_PATH = join(__dirname, '..', 'data', 'contact-submissions.json');

function loadSubmissions() {
  const data = loadJson(SUBMISSIONS_PATH, []);
  // Ensure we always return an array (guard against corrupt data)
  return Array.isArray(data) ? data : [];
}

function saveSubmissions(data) {
  return saveJson(SUBMISSIONS_PATH, data);
}

function mapSubmissionDbToFrontend(s) {
  return {
    id: s.id,
    email: s.email,
    goal: s.goal,
    name: s.name,
    company: s.company,
    message: s.message,
    submittedAt: s.submitted_at,
    status: s.status,
  };
}

const router = Router();

/**
 * POST /api/contact
 * Submit a demo request / contact form
 * Body: { email, goal, name?, company?, message? }
 */
router.post('/', async (req, res, next) => {
  try {
    const { email, goal } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: email',
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format',
      });
    }

    const subId = `contact-${Date.now()}`;
    const record = {
      id: subId,
      email,
      goal: goal || '',
      name: req.body.name || '',
      company: req.body.company || '',
      message: req.body.message || '',
      submitted_at: new Date().toISOString(),
      status: 'new',
    };

    if (supabase) {
      const { error } = await supabase
        .from('contact_submissions')
        .insert([record]);

      if (!error) {
        return res.status(201).json({
          success: true,
          message: 'Demo request received. Our team will reach out within 24 hours.',
          submission: mapSubmissionDbToFrontend(record),
        });
      }
      console.error('[Supabase] Failed to save submission, falling back:', error.message);
    }

    // JSON fallback
    const submissions = loadSubmissions();
    const submission = {
      id: subId,
      email,
      goal: goal || '',
      name: req.body.name || '',
      company: req.body.company || '',
      message: req.body.message || '',
      submittedAt: record.submitted_at,
      status: 'new',
    };
    submissions.push(submission);

    if (!saveSubmissions(submissions)) {
      return res.status(500).json({ success: false, error: 'Failed to save submission' });
    }

    res.status(201).json({
      success: true,
      message: 'Demo request received. Our team will reach out within 24 hours.',
      submission,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/contact/submissions
 * List all contact submissions
 */
router.get('/submissions', async (req, res, next) => {
  try {
    if (supabase) {
      const { data: submissions, error } = await supabase
        .from('contact_submissions')
        .select('*');

      if (!error && submissions) {
        return res.json({
          success: true,
          count: submissions.length,
          submissions: submissions.map(mapSubmissionDbToFrontend),
        });
      }
      console.error('[Supabase] Failed to fetch submissions, falling back:', error?.message);
    }

    // JSON fallback
    const submissions = loadSubmissions();
    res.json({ success: true, count: submissions.length, submissions });
  } catch (err) {
    next(err);
  }
});

export default router;
