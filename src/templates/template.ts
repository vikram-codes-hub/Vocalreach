import { EnrichedContact } from '../types/index.js';
import { emailA } from './email-a.js';
import { emailB } from './email-b.js';
import { emailC } from './email-c.js';

const parseSizeToNumber = (size?: string): number => {
  if (!size) return 0;
  const cleaned = size.replace(/[^0-9]/g, '');
  return parseInt(cleaned) || 0;
};

export const selectTemplate = (contact: EnrichedContact): { subject: string; body: string } => {
  const size = parseSizeToNumber(contact.companySize);

  if (size >= 1000) return emailA(contact);   // large enterprise
  if (size >= 100) return emailB(contact);    // mid size
  return emailC(contact);                     // startup
};