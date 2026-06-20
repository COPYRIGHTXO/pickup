import { Router } from 'express';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SUBMISSIONS_PATH = join(__dirname, '..', 'data', 'contact-submissions.json');

function loadSubmissions() {
  if (!existsSync(SUBMISSIONS_PATH)) return [];
  return JSON.parse(readFileSync(SUBMISSIONS_PATH, 'utf-8'));
}

function saveSubmissions(data) {
  writeFileSync(SUBMISSIONS_PATH, JSON.stringify(data, null, 2));
}

const router = Router();

/**
 * POST /api/contact
 * Submit a demo request / contact form
 * Body: { email, goal, name?, company?, message? }
 */
router.post('/', (req, res) => {
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

  const submission = {
    id: `contact-${Date.now()}`,
    email,
    goal: goal || '',
    name: req.body.name || '',
    company: req.body.company || '',
    message: req.body.message || '',
    submittedAt: new Date().toISOString(),
    status: 'new',
  };

  const submissions = loadSubmissions();
  submissions.push(submission);
  saveSubmissions(submissions);

  res.status(201).json({
    success: true,
    message: 'Demo request received. Our team will reach out within 24 hours.',
    submission,
  });
});

/**
 * GET /api/contact/submissions
 * List all contact submissions
 */
router.get('/submissions', (req, res) => {
  const submissions = loadSubmissions();
  res.json({ success: true, count: submissions.length, submissions });
});

export default router;
