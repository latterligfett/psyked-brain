/**
 * PSYKED — email signup → MailerLite
 *
 * Receives { email, source, results } from the quiz or homepage form.
 * Upserts the subscriber in MailerLite with their quiz results as custom
 * fields, including a ready-made link to their personalized plan page.
 * A MailerLite automation (triggered on group join) sends the email.
 *
 * Required env vars (set in Netlify → Site settings → Environment variables):
 *   MAILERLITE_API_KEY             — API token from MailerLite
 *   MAILERLITE_QUIZ_GROUP_ID       — group ID for quiz leads
 *   MAILERLITE_NEWSLETTER_GROUP_ID — group ID for the general newsletter/guide
 *
 * Until the API key is set, the function succeeds gracefully (so the live
 * site keeps working) and simply skips the MailerLite call.
 */

const ML_API = 'https://connect.mailerlite.com/api/subscribers';
const SITE = 'https://psyked.netlify.app';

// Valid quiz region keys (matches quiz.html + my-plan.html)
const VALID_REGIONS = new Set([
  'PFC', 'Amygdala', 'Hippocampus', 'Cerebellum', 'ACC',
  'BrainStem', 'BasalGanglia', 'Temporal', 'Thalamus',
]);

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Method not allowed' });
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return json(400, { error: 'Invalid JSON body' });
  }

  const email = String(body.email || '').trim().toLowerCase();
  if (!EMAIL_RE.test(email)) {
    return json(400, { error: 'Invalid email address' });
  }
  const source = body.source === 'quiz' ? 'quiz' : 'newsletter';

  // Parse + sanitize quiz results (if present)
  let stack = [];
  let goal = '';
  if (body.results) {
    try {
      const r = typeof body.results === 'string' ? JSON.parse(body.results) : body.results;
      if (Array.isArray(r.top3)) stack = r.top3.filter((x) => VALID_REGIONS.has(x)).slice(0, 3);
      if (VALID_REGIONS.has(r.goalRegion)) goal = r.goalRegion;
    } catch {
      /* ignore malformed results — fall back to newsletter-style signup */
    }
  }

  const planUrl =
    source === 'quiz' && stack.length
      ? `${SITE}/my-plan.html?stack=${encodeURIComponent(stack.join(','))}` +
        (goal ? `&goal=${encodeURIComponent(goal)}` : '')
      : `${SITE}/ebook.html`;

  const API_KEY = process.env.MAILERLITE_API_KEY;
  const groupId =
    source === 'quiz'
      ? process.env.MAILERLITE_QUIZ_GROUP_ID
      : process.env.MAILERLITE_NEWSLETTER_GROUP_ID;

  // Not configured yet → succeed gracefully so the site keeps working.
  if (!API_KEY) {
    console.warn('[subscribe] MAILERLITE_API_KEY not set — skipping ESP call.');
    return json(200, { ok: true, configured: false, planUrl });
  }

  const payload = {
    email,
    fields: {
      priority_stack: stack.join(', '),
      goal_region: goal,
      plan_url: planUrl,
    },
  };
  if (groupId) payload.groups = [groupId];

  try {
    const res = await fetch(ML_API, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      console.error('[subscribe] MailerLite error', res.status, JSON.stringify(data));
      return json(502, { ok: false, error: 'Email service error' });
    }

    return json(200, { ok: true, configured: true, planUrl });
  } catch (err) {
    console.error('[subscribe] request failed', err);
    return json(502, { ok: false, error: 'Request to email service failed' });
  }
};

function json(statusCode, obj) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify(obj),
  };
}
