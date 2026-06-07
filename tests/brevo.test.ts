import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockPost } = vi.hoisted(() => ({
  mockPost: vi.fn(),
}));

vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      post: mockPost,
    })),
  },
}));

vi.mock('../src/utils/logger.js', () => ({
  log: { stage: vi.fn(), success: vi.fn(), warn: vi.fn(), error: vi.fn(), info: vi.fn(), verbose: vi.fn() },
}));
vi.mock('../src/utils/limiter.js', () => ({
  brevoLimiter: { schedule: vi.fn((fn: () => any) => fn()) },
}));
vi.mock('../src/utils/sleep.js', () => ({
  sleep: vi.fn(() => Promise.resolve()),
}));
vi.mock('../src/templates/template.js', () => ({
  selectTemplate: vi.fn(() => ({
    subject: 'Quick thought about your company',
    body: '<p>Hi Jane, we think we can help...</p>',
  })),
}));
vi.mock('../src/config/index.js', () => ({
  default: {
    brevo: {
      baseUrl: 'https://api.brevo.com/v3',
      apiKey: 'test-brevo-key',
      senderEmail: 'outreach@test.com',
      senderName: 'VocalReach',
    },
    pipeline: { verbose: false },
  },
}));

import { sendOutreach } from '../src/stages/brevo.js';

const mockContacts = [
  {
    firstName: 'Jane',
    lastName: 'Smith',
    fullName: 'Jane Smith',
    title: 'VP Sales',
    email: 'jane.smith@acme.com',
    companyName: 'Acme Corp',
    companyDomain: 'acme.com',
  },
  {
    firstName: 'Bob',
    lastName: 'Jones',
    fullName: 'Bob Jones',
    title: 'CTO',
    email: 'bob.jones@betalabs.io',
    companyName: 'Beta Labs',
    companyDomain: 'betalabs.io',
  },
];

describe('Stage 4 — Brevo Email Dispatch', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should send emails to all contacts and return correct sent count', async () => {
    mockPost.mockResolvedValue({ status: 201, data: {} });

    const result = await sendOutreach(mockContacts, false);

    expect(result.sent).toBe(2);
    expect(result.failed).toBe(0);
  });

  it('should skip actual sending in dry-run mode and count all as sent', async () => {
    const result = await sendOutreach(mockContacts, true);

    expect(mockPost).not.toHaveBeenCalled();
    expect(result.sent).toBe(mockContacts.length);
    expect(result.failed).toBe(0);
  });

  it('should count failed emails when Brevo API returns an error', async () => {
    mockPost.mockRejectedValue({ response: { data: { message: 'Invalid email' } } });

    const result = await sendOutreach(mockContacts, false);

    expect(result.sent).toBe(0);
    expect(result.failed).toBe(2);
  });

  it('should partially succeed when only some emails fail', async () => {
    let callCount = 0;
    mockPost.mockImplementation(() => {
      callCount++;
      if (callCount === 1) return Promise.resolve({ status: 201, data: {} });
      return Promise.reject(new Error('Send failed'));
    });

    const result = await sendOutreach(mockContacts, false);

    expect(result.sent).toBe(1);
    expect(result.failed).toBe(1);
  });

  it('should return zero counts when contacts list is empty', async () => {
    const result = await sendOutreach([], false);

    expect(result.sent).toBe(0);
    expect(result.failed).toBe(0);
  });
});
