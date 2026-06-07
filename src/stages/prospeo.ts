import axios from "axios";
import { prospeoLimiter } from "../utils/limiter.js";
import { isEmailSeen } from "../utils/dedup.js";
import { log } from "../utils/logger.js";
import { Contact, EnrichedContact } from "../types/index.js";
import config from "../config/index.js";
import { sleep } from "../utils/sleep.js";
import axiosHunter from 'axios';
const client = axios.create({
  baseURL: "https://api.prospeo.io",
  headers: {
    "Content-Type": "application/json",
    "X-KEY": config.prospeo.apiKey,
  },
});

// Stage 2 — Find decision makers using Search Person API
export const findDecisionMakers = async (companies: { name: string; domain: string; size?: string; industry?: string }[]): Promise<Contact[]> => {
  log.stage(2, "Finding decision makers via Prospeo...");

  const allContacts: Contact[] = [];

  for (const company of companies) {
    try {
      log.verbose(`Fetching contacts for: ${company.domain}`);

      const response = await prospeoLimiter.schedule(() =>
        client.post("/search-person", {
          page: 1,
          filters: {
            company: {
              websites: {
                include: [company.domain],
              },
            },
            person_seniority: {
              include: [
                "C-Suite",
                "Director",
                "Head",
                "Founder/Owner",
                "Manager",
              ],
            },
          },
        }),
      );

      if (response.data?.error) {
        log.warn(
          `No results for ${company.domain}: ${response.data?.error_code}`,
        );
        continue;
      }

      const results = response.data?.results ?? [];

      for (const item of results) {
        const person = item.person ?? {};
        const title = person.job_title ?? "";

        allContacts.push({
          firstName: person.first_name ?? "",
          lastName: person.last_name ?? "",
          fullName:
            `${person.first_name ?? ""} ${person.last_name ?? ""}`.trim(),
          title,
          linkedinUrl: person.linkedin_url ?? undefined,
          companyName: company.name,
          companyDomain: company.domain,
          personId: person.person_id ?? undefined,
          companySize: company.size ?? undefined,
        });
      }

      log.verbose(`Found ${results.length} people at ${company.domain}`);
      await sleep(500);
    } catch (err: any) {
      log.error(
        `Stage 2 failed for ${company.domain}: ${JSON.stringify(err?.response?.data)}`,
      );
    }
  }

  log.success(`Stage 2 — Found ${allContacts.length} decision makers`);
  return allContacts;
};

// Stage 3 — Enrich emails using Enrich Person API
const hunterClient = axiosHunter.create({
  baseURL: 'https://api.hunter.io/v2',
});

export const resolveEmails = async (contacts: Contact[]): Promise<EnrichedContact[]> => {
  log.stage(3, 'Resolving verified emails via Hunter.io...');

  const enriched: EnrichedContact[] = [];
  const limited = contacts.slice(0, 10);

  for (const contact of limited) {
    try {
      log.verbose(`Resolving email for: ${contact.fullName} at ${contact.companyDomain}`);

      const response = await prospeoLimiter.schedule(() =>
        hunterClient.get('/email-finder', {
          params: {
            domain: contact.companyDomain,
            first_name: contact.firstName,
            last_name: contact.lastName,
            api_key: process.env.HUNTER_API_KEY,
          },
        })
      );

      const email = response.data?.data?.email ?? null;

      if (!email) {
        log.warn(`No email found for ${contact.fullName}`);
        continue;
      }

      if (isEmailSeen(email)) {
        log.verbose(`Duplicate skipped: ${email}`);
        continue;
      }

      enriched.push({ ...contact, email });
      log.verbose(`Resolved: ${email}`);
      await sleep(500);

    } catch (err: any) {
      log.error(`Stage 3 failed for ${contact.fullName}: ${JSON.stringify(err?.response?.data)}`);
    }
  }

  log.success(`Stage 3 — Resolved ${enriched.length} verified emails`);
  return enriched;
};