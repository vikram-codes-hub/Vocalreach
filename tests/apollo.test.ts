import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockPost } = vi.hoisted(() => ({
  mockPost: vi.fn(),
}));

vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({ post: mockPost })),
  },
}));

vi.mock('../src/utils/logger.js', () => ({
  log: { stage: vi.fn(), success: vi.fn(), warn: vi.fn(), error: vi.fn(), verbose: vi.fn() },
}));
vi.mock('../src/utils/limiter.js', () => ({
  apolloLimiter: { schedule: vi.fn((fn: () => any) => fn()) },
}));
vi.mock('../src/utils/dedup.js', () => ({
  isDomainSeen: vi.fn(() => false),
}));
vi.mock('../src/config/index.js', () => ({
  default: {
    apollo: { baseUrl: 'https://api.apollo.io/v1', apiKey: 'test-key', maxCompanies: 10 },
    pipeline: { dryRun: false, verbose: false },
  },
}));

import { findLookalikes } from '../src/stages/apollo.js';

describe('Stage 1 — Apollo.io Company Discovery', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return a list of companies for a valid seed domain', async () => {
    mockPost.mockResolvedValue({
      data: {
        organizations: [
          { name: 'Acme Corp', primary_domain: 'acme.com', industry: 'SaaS', estimated_num_employees: 200 },
          { name: 'Beta Labs', primary_domain: 'betalabs.io', industry: 'FinTech', estimated_num_employees: 50 },
        ],
      },
    });

    const result = await findLookalikes('stripe.com');

    expect(result).toHaveLength(2);
    expect(result[0].domain).toBe('acme.com');
    expect(result[0].name).toBe('Acme Corp');
    expect(result[0].industry).toBe('SaaS');
  });

  it('should skip the seed domain itself from results', async () => {
    mockPost.mockResolvedValue({
      data: {
        organizations: [
          { name: 'Stripe', primary_domain: 'stripe.com', industry: 'FinTech', estimated_num_employees: 5000 },
          { name: 'Acme Corp', primary_domain: 'acme.com', industry: 'SaaS', estimated_num_employees: 200 },
        ],
      },
    });

    const result = await findLookalikes('stripe.com');

    expect(result.every((c) => c.domain !== 'stripe.com')).toBe(true);
  });

  it('should filter out blocked generic domains', async () => {
    mockPost.mockResolvedValue({
      data: {
        organizations: [
          { name: 'Google', primary_domain: 'google.com', industry: 'Tech', estimated_num_employees: 100000 },
          { name: 'Acme Corp', primary_domain: 'acme.com', industry: 'SaaS', estimated_num_employees: 200 },
        ],
      },
    });

    const result = await findLookalikes('stripe.com');

    expect(result.every((c) => c.domain !== 'google.com')).toBe(true);
    expect(result.some((c) => c.domain === 'acme.com')).toBe(true);
  });

  it('should return empty array when no organizations are found', async () => {
    mockPost.mockResolvedValue({ data: { organizations: [] } });

    const result = await findLookalikes('stripe.com');

    expect(result).toHaveLength(0);
  });

  it('should return empty array on API error', async () => {
    mockPost.mockRejectedValue(new Error('Network Error'));

    const result = await findLookalikes('stripe.com');

    expect(result).toHaveLength(0);
  });

  it('should handle missing primary_domain by falling back to website_url', async () => {
    mockPost.mockResolvedValue({
      data: {
        organizations: [
          { name: 'Beta Co', website_url: 'https://betaco.com/about', industry: 'SaaS', estimated_num_employees: 80 },
        ],
      },
    });

    const result = await findLookalikes('stripe.com');

    expect(result[0].domain).toBe('betaco.com');
  });
});
