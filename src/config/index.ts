import dotenv from 'dotenv';
dotenv.config();

const config = {
  apollo: {
    apiKey: process.env.APOLLO_API_KEY!,
    baseUrl: 'https://api.apollo.io/v1',
    rateLimit: 5,        // requests per second
    maxCompanies: 10,    // max lookalike companies to fetch
  },

  prospeo: {
    apiKey: process.env.PROSPEO_API_KEY!,
    baseUrl: 'https://api.prospeo.io',
    rateLimit: 1,
    maxContacts: 5,      // max contacts per company
  },

  brevo: {
    apiKey: process.env.BREVO_API_KEY!,
    baseUrl: 'https://api.brevo.com/v3',
    senderEmail: process.env.BREVO_SENDER_EMAIL!,
    senderName: process.env.BREVO_SENDER_NAME!,
    rateLimit: 2,
  },

  pipeline: {
    dryRun: false,
    verbose: false,
    limit: 10,
    snapshotDir: './output',
    logsDir: './logs',
  },
};

export default config;