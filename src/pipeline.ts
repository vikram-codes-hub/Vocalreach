import ora from 'ora';
import { findLookalikes } from './stages/apollo.js';
import { findDecisionMakers, resolveEmails } from './stages/prospeo.js';
import { sendOutreach } from './stages/brevo.js';
import { buildSummary } from './checkpoint/summary.js';
import { safetyPrompt } from './checkpoint/prompt.js';
import { saveSnapshot } from './snapshot/save.js';
import { loadSnapshot } from './snapshot/resume.js';
import { log } from './utils/logger.js';
import { PipelineResult } from './types/index.js';
import config from './config/index.js';

export const runPipeline = async (
  seedDomain: string,
  options: {
    dryRun?: boolean;
    verbose?: boolean;
    limit?: number;
    resume?: string;
  }
): Promise<void> => {

  // apply options to config
  config.pipeline.dryRun = options.dryRun ?? false;
  config.pipeline.verbose = options.verbose ?? false;
  if (options.limit) config.apollo.maxCompanies = options.limit;

  const result: PipelineResult = {
    seedDomain,
    companies: [],
    contacts: [],
    enrichedContacts: [],
    emailsSent: 0,
    skipped: 0,
    errors: [],
    timestamp: new Date().toISOString(),
  };

  // ── Resume Mode ─────────────────────────────────
  if (options.resume) {
    const snapshot = loadSnapshot(options.resume);
    if (!snapshot) {
      log.error('Could not load snapshot. Aborting.');
      process.exit(1);
    }

    // skip straight to sending
    result.companies = snapshot.companies;
    result.contacts = snapshot.contacts;
    result.enrichedContacts = snapshot.enrichedContacts;

    log.info(`Resuming with ${result.enrichedContacts.length} contacts from snapshot`);

    buildSummary(result, config.pipeline.dryRun);
    const proceed = await safetyPrompt(result.enrichedContacts, config.pipeline.dryRun);
    if (!proceed) return;

    const { sent, failed } = await sendOutreach(result.enrichedContacts, config.pipeline.dryRun);
    result.emailsSent = sent;
    result.skipped = failed;
    saveSnapshot(result);
    return;
  }

  // ── Stage 1 — Lookalike Companies ───────────────
  const spinner1 = ora('Stage 1 — Finding lookalike companies...').start();
  try {
    result.companies = await findLookalikes(seedDomain);
    spinner1.succeed(`Stage 1 — Found ${result.companies.length} companies`);
  } catch (err: any) {
    spinner1.fail('Stage 1 failed');
    result.errors.push(err.message);
  }

  if (!result.companies.length) {
    log.error('No companies found. Aborting pipeline.');
    return;
  }

  // ── Stage 2 — Decision Makers ───────────────────
  const spinner2 = ora('Stage 2 — Finding decision makers...').start();
  try {
  result.contacts = await findDecisionMakers(result.companies);
spinner2.succeed(`Stage 2 — Found ${result.contacts.length} contacts`);
  } catch (err: any) {
    spinner2.fail('Stage 2 failed');
    result.errors.push(err.message);
  }

  if (!result.contacts.length) {
    log.error('No contacts found. Aborting pipeline.');
    return;
  }

  // ── Stage 3 — Resolve Emails ────────────────────
  const spinner3 = ora('Stage 3 — Resolving verified emails...').start();
  try {
    result.enrichedContacts = await resolveEmails(result.contacts);
    spinner3.succeed(`Stage 3 — Verified ${result.enrichedContacts.length} emails`);
  } catch (err: any) {
    spinner3.fail('Stage 3 failed');
    result.errors.push(err.message);
  }

  if (!result.enrichedContacts.length) {
    log.error('No verified emails found. Aborting pipeline.');
    return;
  }

  // ── Safety Checkpoint ───────────────────────────
  buildSummary(result, config.pipeline.dryRun);
  const proceed = await safetyPrompt(result.enrichedContacts, config.pipeline.dryRun);
  if (!proceed) {
    saveSnapshot(result);
    log.info('Snapshot saved. Resume later with --resume flag.');
    return;
  }

  // ── Stage 4 — Send Emails ───────────────────────
  const spinner4 = ora('Stage 4 — Sending outreach emails...').start();
  try {
    const { sent, failed } = await sendOutreach(
      result.enrichedContacts,
      config.pipeline.dryRun
    );
    result.emailsSent = sent;
    result.skipped += failed;
   spinner4.succeed(`Stage 4 — Sent: ${sent} | Failed: ${failed}`);
  } catch (err: any) {
    spinner4.fail('Stage 4 failed');
    result.errors.push(err.message);
  }

  // ── Save Snapshot ───────────────────────────────
  saveSnapshot(result);

  log.success('\n  Pipeline complete!');
  log.info(`  Emails sent : ${result.emailsSent}`);
  log.info(`  Skipped     : ${result.skipped}`);
  log.info(`  Errors      : ${result.errors.length}`);
};