import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockPost, mockGet } = vi.hoisted(() => ({
  mockPost: vi.fn(),
  mockGet: vi.fn(),
}));

vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      post: mockPost,
      get: mockGet,
    })),
  },
}));

vi.mock('../src/utils/logger.js', () => ({
  log: { stage: vi.fn(), success: vi.fn(), warn: vi.fn(), error: vi.fn(), verbose: vi.fn() },
}));
vi.mock('../src/utils/limiter.js', () => ({
  prospeoLimiter: { schedule: vi.fn((fn: () => any) => fn()) },
}));
vi.mock('../src/utils/dedup.js', () => ({
  isEmailSeen: vi.fn(() => false),
}));
vi.mock('../src/utils/sleep.js', () => ({
  sleep: vi.fn(() => Promise.resolve()),
}));
vi.mock('../src/config/index.js', () => ({
  default: {
    prospeo: { apiKey: 'test-prospeo-key' },
    pipeline: { verbose: false },
  },
}));

import { findDecisionMakers, resolveEmails } from '../src/stages/prospeo.js';

const mockCompanies = [
  { name: 'Acme Corp', domain: 'acme.com', industry: 'SaaS', size: '200' },
  { name: 'Beta Labs', domain: 'betalabs.io', industry: 'FinTech', size: '50' },
];

describe('Stage 2 — Prospeo Decision Maker Extraction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return contacts for each company', async () => {
    const mockResults = [
      {
        person: {
          first_name: 'Jane',
          last_name: 'Smith',
          job_title: 'VP Sales',
          linkedin_url: 'https://linkedin.com/in/jane-smith',
          person_id: 'p123',
        },
      },
    ];

    mockPost.mockResolvedValue({ data: { results: mockResults, error: false } });

    const result = await findDecisionMakers(mockCompanies);

    expect(result.length).toBeGreaterThan(0);
    expect(result[0].firstName).toBe('Jane');
    expect(result[0].title).toBe('VP Sales');
    expect(result[0].companyName).toBe('Acme Corp');
  });

  it('should aggregate contacts from multiple companies', async () => {
    mockPost.mockResolvedValue({
      data: {
        results: [{ person: { first_name: 'John', last_name: 'Doe', job_title: 'CEO', person_id: 'p1' } }],
        error: false,
      },
    });

    const result = await findDecisionMakers(mockCompanies);

    // Called once per company
    expect(mockPost).toHaveBeenCalledTimes(mockCompanies.length);
    expect(result.length).toBe(mockCompanies.length); // 1 contact per company
  });

  it('should skip companies that return an API error', async () => {
    mockPost.mockResolvedValue({
      data: { error: true, error_code: 'DOMAIN_NOT_FOUND' },
    });

    const result = await findDecisionMakers(mockCompanies);

    expect(result).toHaveLength(0);
  });

  it('should handle network errors gracefully without crashing', async () => {
    mockPost.mockRejectedValue(new Error('ECONNABORTED'));

    const result = await findDecisionMakers(mockCompanies);

    expect(result).toHaveLength(0);
  });
});

describe('Stage 3 — Hunter.io Email Resolution', () => {
  const mockContacts = [
    {
      firstName: 'Jane',
      lastName: 'Smith',
      fullName: 'Jane Smith',
      title: 'VP Sales',
      companyName: 'Acme Corp',
      companyDomain: 'acme.com',
    },
    {
      firstName: 'Bob',
      lastName: 'Jones',
      fullName: 'Bob Jones',
      title: 'CTO',
      companyName: 'Beta Labs',
      companyDomain: 'betalabs.io',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.HUNTER_API_KEY = 'test-hunter-key';
  });

  it('should resolve emails for contacts using Hunter.io', async () => {
    mockGet.mockResolvedValue({ data: { data: { email: 'jane.smith@acme.com' } } });

    const result = await resolveEmails(mockContacts);

    expect(result.length).toBeGreaterThan(0);
    expect(result[0].email).toBe('jane.smith@acme.com');
    expect(result[0].fullName).toBe('Jane Smith');
  });

  it('should skip contacts where no email is found', async () => {
    mockGet.mockResolvedValue({ data: { data: { email: null } } });

    const result = await resolveEmails(mockContacts);

    expect(result).toHaveLength(0);
  });

  it('should deduplicate emails and skip already seen ones', async () => {
    const { isEmailSeen } = await import('../src/utils/dedup.js');
    vi.mocked(isEmailSeen).mockReturnValueOnce(false).mockReturnValue(true);

    mockGet.mockResolvedValue({ data: { data: { email: 'jane@acme.com' } } });

    const result = await resolveEmails(mockContacts);

    expect(result.length).toBeLessThanOrEqual(1);
  });

  it('should handle Hunter.io API errors gracefully', async () => {
    mockGet.mockRejectedValue(new Error('429 Too Many Requests'));

    const result = await resolveEmails(mockContacts);

    expect(result).toHaveLength(0);
  });
});
