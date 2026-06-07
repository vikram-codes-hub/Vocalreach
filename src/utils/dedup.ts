const seenEmails = new Set<string>();
const seenDomains = new Set<string>();

export const isEmailSeen = (email: string): boolean => {
  const normalized = email.toLowerCase().trim();
  if (seenEmails.has(normalized)) return true;
  seenEmails.add(normalized);
  return false;
};

export const isDomainSeen = (domain: string): boolean => {
  const normalized = domain.toLowerCase().trim();
  if (seenDomains.has(normalized)) return true;
  seenDomains.add(normalized);
  return false;
};

export const resetDedup = (): void => {
  seenEmails.clear();
  seenDomains.clear();
};

export const getSeenEmailsCount = (): number => seenEmails.size;
export const getSeenDomainsCount = (): number => seenDomains.size;