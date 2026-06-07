import { EnrichedContact } from '../types/index.js';

export const emailA = (contact: EnrichedContact) => ({
  subject: `Quick question about ${contact.companyName}'s outreach strategy`,
  body: `
    <p>Hi ${contact.firstName},</p>

    <p>I came across ${contact.companyName} and was genuinely impressed by what you're building — 
    the scale at which you're operating puts you in a unique position in the market.</p>

    <p>I'm working on an automated outreach pipeline that helps sales teams like yours 
    cut prospecting time by 80% — sourcing leads, finding decision-makers, verifying emails, 
    and sending personalized outreach, all in one command.</p>

    <p>Given ${contact.companyName}'s size, I think there's a real opportunity to streamline 
    your top-of-funnel. Would you be open to a 15-minute call this week?</p>

    <p>Either way, happy to share more details if useful.</p>

    <p>Best,<br/>
    ${process.env.BREVO_SENDER_NAME}<br/>
    </p>
  `,
});