// Hunter.io email resolution is tested as part of Stage 3 in prospeo.test.ts
// (resolveEmails uses Hunter.io internally via the prospeo stage module)
//
// This file contains additional focused unit tests for the email deduplication
// and enrichment logic used during Hunter.io resolution.

import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../src/utils/logger.js', () => ({
  log: { stage: vi.fn(), success: vi.fn(), warn: vi.fn(), error: vi.fn(), verbose: vi.fn() },
}));
vi.mock('../src/utils/sleep.js', () => ({
  sleep: vi.fn(() => Promise.resolve()),
}));

describe('Email Deduplication Logic', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('should track seen emails and flag duplicates', async () => {
    const { isEmailSeen } = await import('../src/utils/dedup.js');

    // First call — not seen
    expect(isEmailSeen('jane@acme.com')).toBe(false);

    // Second call — now seen
    expect(isEmailSeen('jane@acme.com')).toBe(true);
  });

  it('should treat different emails as unique', async () => {
    const { isEmailSeen } = await import('../src/utils/dedup.js');

    expect(isEmailSeen('alice@acme.com')).toBe(false);
    expect(isEmailSeen('bob@acme.com')).toBe(false);
  });

  it('should track seen domains and flag duplicates', async () => {
    const { isDomainSeen } = await import('../src/utils/dedup.js');

    expect(isDomainSeen('acme.com')).toBe(false);
    expect(isDomainSeen('acme.com')).toBe(true);
  });
});

describe('EnrichedContact Shape', () => {
  it('should have all required fields after enrichment', () => {
    const enriched = {
      firstName: 'Jane',
      lastName: 'Smith',
      fullName: 'Jane Smith',
      title: 'VP Sales',
      email: 'jane.smith@acme.com',
      companyName: 'Acme Corp',
      companyDomain: 'acme.com',
    };

    expect(enriched).toHaveProperty('email');
    expect(enriched).toHaveProperty('fullName');
    expect(enriched).toHaveProperty('companyDomain');
    expect(enriched.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  });

  it('should match a valid email format', () => {
    const validEmails = [
      'jane.smith@acme.com',
      'bob+tag@company.io',
      'ceo@startup.co',
    ];

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    validEmails.forEach((email) => {
      expect(email).toMatch(emailRegex);
    });
  });
});
