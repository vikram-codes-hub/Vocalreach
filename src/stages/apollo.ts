import axios from 'axios';
import { apolloLimiter } from '../utils/limiter.js';
import { isDomainSeen } from '../utils/dedup.js';
import { log } from '../utils/logger.js';
import { Company } from '../types/index.js';
import config from '../config/index.js';

const client = axios.create({
  baseURL: config.apollo.baseUrl,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
    'x-api-key': config.apollo.apiKey,  
  },
});
export const findLookalikes = async (seedDomain: string): Promise<Company[]> => {
  log.stage(1, `Finding lookalike companies for: ${seedDomain}`);

  try {
    const response = await apolloLimiter.schedule(() =>
  client.post('/organizations/search', {
    page: 1,
    per_page: config.apollo.maxCompanies,
    organization_domains: [seedDomain],
  })
);

   const organizations = response.data?.organizations ?? [];

    if (!organizations.length) {
      log.warn('Stage 1 — No lookalike companies found');
      return [];
    }

    const companies: Company[] = [];
const BLOCKED_DOMAINS = [
  'google.com', 'amazon.com', 'linkedin.com', 'microsoft.com',
  'apple.com', 'meta.com', 'facebook.com', 'twitter.com',
  'netflix.com', 'uber.com', 'airbnb.com'
];
    for (const org of organizations) {
      const domain = org.primary_domain ?? org.website_url?.replace(/^https?:\/\//, '').split('/')[0];


// inside the for loop, after domain is extracted:
if (BLOCKED_DOMAINS.includes(domain)) {
  log.verbose(`Skipping generic domain: ${domain}`);
  continue;
}
      if (!domain) continue;
      if (isDomainSeen(domain)) {
        log.verbose(`Skipping duplicate domain: ${domain}`);
        continue;
      }
      if (domain === seedDomain) continue;

      companies.push({
        name: org.name ?? 'Unknown',
        domain,
        industry: org.industry ?? undefined,
       size: org.estimated_num_employees?.toString() ?? undefined,
      });
    }

    log.success(`Stage 1 — Found ${companies.length} lookalike companies`);
    log.verbose('Companies:', companies);

    return companies;

  } catch (err: any) {
    log.error(`Stage 1 failed: ${err?.response?.data?.message ?? err.message}`);
    return [];
  }
};