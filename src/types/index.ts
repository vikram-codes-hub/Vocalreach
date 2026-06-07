export interface Company {
  name: string;
  domain: string;
  industry?: string;
  size?: string;
}

export interface Contact {
  firstName: string;
  lastName: string;
  fullName: string;
  title: string;
  linkedinUrl?: string;
  companyName: string;
  companyDomain: string;
  personId?: string;
  companySize?: string;
}

export interface EnrichedContact extends Contact {
  email: string;
}

export interface EmailPayload {
  to: string;
  toName: string;
  subject: string;
  body: string;
  companyName: string;
}

export interface PipelineResult {
  seedDomain: string;
  companies: Company[];
  contacts: Contact[];
  enrichedContacts: EnrichedContact[];
  emailsSent: number;
  skipped: number;
  errors: string[];
  timestamp: string;
}

export interface StageResult<T> {
  success: boolean;
  data: T;
  error?: string;
}