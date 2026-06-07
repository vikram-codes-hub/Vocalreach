import axios from 'axios';
import { brevoLimiter } from '../utils/limiter.js';
import { log } from '../utils/logger.js';
import { EnrichedContact, EmailPayload } from '../types/index.js';
import config from '../config/index.js';
import { selectTemplate } from '../templates/template.js';
import { sleep } from '../utils/sleep.js';

const client = axios.create({
  baseURL: config.brevo.baseUrl,
  headers: {
    'Content-Type': 'application/json',
    'api-key': config.brevo.apiKey,
  },
});

const sendEmail = async (payload: EmailPayload): Promise<boolean> => {
  try {
    await brevoLimiter.schedule(() =>
      client.post('/smtp/email', {
        sender: {
          name: config.brevo.senderName,
          email: config.brevo.senderEmail,
        },
        to: [{ email: payload.to, name: payload.toName }],
        subject: payload.subject,
        htmlContent: payload.body,
      })
    );
    return true;
  } catch (err: any) {
    log.error(`Failed to send to ${payload.to}: ${err?.response?.data?.message ?? err.message}`);
    return false;
  }
};

export const sendOutreach = async (
  contacts: EnrichedContact[],
  dryRun: boolean
): Promise<{ sent: number; failed: number }> => {
  log.stage(4, `Sending personalized outreach via Brevo${dryRun ? ' [DRY RUN]' : ''}...`);

  let sent = 0;
  let failed = 0;

  for (const contact of contacts) {
    const template = selectTemplate(contact);

    const payload: EmailPayload = {
      to: contact.email,
      toName: contact.fullName,
      subject: template.subject,
      body: template.body,
      companyName: contact.companyName,
    };

    if (dryRun) {
      log.info(`[DRY RUN] Would send to: ${contact.email} — ${template.subject}`);
      sent++;
      continue;
    }

    const success = await sendEmail(payload);

    if (success) {
      log.success(`Sent to ${contact.fullName} <${contact.email}>`);
      sent++;
    } else {
      failed++;
    }

    await sleep(300);
  }

  log.success(`Stage 4 — Sent: ${sent} | Failed: ${failed}`);
  return { sent, failed };
};