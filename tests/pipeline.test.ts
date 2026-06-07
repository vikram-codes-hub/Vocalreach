import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../src/stages/apollo.js', () => ({
  findLookalikes: vi.fn(),
}));
vi.mock('../src/stages/prospeo.js', () => ({
  findDecisionMakers: vi.fn(),
  resolveEmails: vi.fn(),
}));
vi.mock('../src/stages/brevo.js', () => ({
  sendOutreach: vi.fn(),
}));
vi.mock('../src/checkpoint/summary.js', () => ({
  buildSummary: vi.fn(),
}));
vi.mock('../src/checkpoint/prompt.js', () => ({
  safetyPrompt: vi.fn(),
}));
vi.mock('../src/snapshot/save.js', () => ({
  saveSnapshot: vi.fn(),
}));
vi.mock('../src/snapshot/resume.js', () => ({
  loadSnapshot: vi.fn(),
}));
vi.mock('../src/utils/logger.js', () => ({
  log: { stage: vi.fn(), success: vi.fn(), warn: vi.fn(), error: vi.fn(), info: vi.fn(), verbose: vi.fn() },
}));
vi.mock('../src/config/index.js', () => ({
  default: {
    apollo: { maxCompanies: 10 },
    pipeline: { dryRun: false, verbose: false },
    brevo: { senderEmail: 'test@test.com', senderName: 'Test' },
  },
}));

import { findLookalikes } from '../src/stages/apollo.js';
import { findDecisionMakers, resolveEmails } from '../src/stages/prospeo.js';
import { sendOutreach } from '../src/stages/brevo.js';
import { safetyPrompt } from '../src/checkpoint/prompt.js';
import { saveSnapshot } from '../src/snapshot/save.js';
import { loadSnapshot } from '../src/snapshot/resume.js';

const mockCompanies = [{ name: 'Acme Corp', domain: 'acme.com', industry: 'SaaS', size: '200' }];
const mockContacts = [
  { firstName: 'Jane', lastName: 'Smith', fullName: 'Jane Smith', title: 'VP Sales', companyName: 'Acme Corp', companyDomain: 'acme.com' },
];
const mockEnriched = [{ ...mockContacts[0], email: 'jane.smith@acme.com' }];

describe('Pipeline Orchestration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(findLookalikes).mockResolvedValue(mockCompanies);
    vi.mocked(findDecisionMakers).mockResolvedValue(mockContacts);
    vi.mocked(resolveEmails).mockResolvedValue(mockEnriched);
    vi.mocked(sendOutreach).mockResolvedValue({ sent: 1, failed: 0 });
    vi.mocked(safetyPrompt).mockResolvedValue(true);
  });

  it('should run all 4 stages in sequence on a happy path', async () => {
    const { runPipeline } = await import('../src/pipeline.js');
    await runPipeline('stripe.com', {});

    expect(findLookalikes).toHaveBeenCalledWith('stripe.com');
    expect(findDecisionMakers).toHaveBeenCalledWith(mockCompanies);
    expect(resolveEmails).toHaveBeenCalledWith(mockContacts);
    expect(safetyPrompt).toHaveBeenCalled();
    expect(sendOutreach).toHaveBeenCalledWith(mockEnriched, false);
  });

  it('should abort pipeline early if no companies are found', async () => {
    vi.mocked(findLookalikes).mockResolvedValue([]);

    const { runPipeline } = await import('../src/pipeline.js');
    await runPipeline('unknown-domain.com', {});

    expect(findDecisionMakers).not.toHaveBeenCalled();
    expect(sendOutreach).not.toHaveBeenCalled();
  });

  it('should abort pipeline early if no contacts are found', async () => {
    vi.mocked(findDecisionMakers).mockResolvedValue([]);

    const { runPipeline } = await import('../src/pipeline.js');
    await runPipeline('stripe.com', {});

    expect(resolveEmails).not.toHaveBeenCalled();
    expect(sendOutreach).not.toHaveBeenCalled();
  });

  it('should abort pipeline early if no emails are resolved', async () => {
    vi.mocked(resolveEmails).mockResolvedValue([]);

    const { runPipeline } = await import('../src/pipeline.js');
    await runPipeline('stripe.com', {});

    expect(safetyPrompt).not.toHaveBeenCalled();
    expect(sendOutreach).not.toHaveBeenCalled();
  });

  it('should save snapshot and not send if user aborts at checkpoint', async () => {
    vi.mocked(safetyPrompt).mockResolvedValue(false);

    const { runPipeline } = await import('../src/pipeline.js');
    await runPipeline('stripe.com', {});

    expect(sendOutreach).not.toHaveBeenCalled();
    expect(saveSnapshot).toHaveBeenCalled();
  });

  it('should skip all stages and go to checkpoint when resuming from snapshot', async () => {
    vi.mocked(loadSnapshot).mockReturnValue({
      companies: mockCompanies,
      contacts: mockContacts,
      enrichedContacts: mockEnriched,
    } as any);

    const { runPipeline } = await import('../src/pipeline.js');
    await runPipeline('stripe.com', { resume: 'output/run-123.json' });

    expect(findLookalikes).not.toHaveBeenCalled();
    expect(findDecisionMakers).not.toHaveBeenCalled();
    expect(resolveEmails).not.toHaveBeenCalled();
    expect(safetyPrompt).toHaveBeenCalled();
    expect(sendOutreach).toHaveBeenCalled();
  });

  it('should abort resume if snapshot file cannot be loaded', async () => {
    vi.mocked(loadSnapshot).mockReturnValue(null);
    const mockExit = vi.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('process.exit(1)');
    });

    const { runPipeline } = await import('../src/pipeline.js');
    await expect(runPipeline('stripe.com', { resume: 'output/bad-file.json' })).rejects.toThrow('process.exit(1)');

    expect(mockExit).toHaveBeenCalledWith(1);
    expect(sendOutreach).not.toHaveBeenCalled();
    mockExit.mockRestore();
  });

  it('should pass dry-run flag through to sendOutreach', async () => {
    const { runPipeline } = await import('../src/pipeline.js');
    await runPipeline('stripe.com', { dryRun: true });

    expect(sendOutreach).toHaveBeenCalledWith(mockEnriched, true);
  });
});
