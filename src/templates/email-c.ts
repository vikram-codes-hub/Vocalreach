import { EnrichedContact } from '../types/index.js';

export const emailC = (contact: EnrichedContact) => ({
  subject: `Automate your cold outreach — built for startups like ${contact.companyName}`,
  body: `
    <p>Hey ${contact.firstName},</p>

    <p>Building a startup means every hour counts — and manual prospecting eats too much of it.</p>

    <p>I built VocalReach — a CLI pipeline that does everything automatically: 
    finds companies similar to your best customers, surfaces their decision-makers, 
    verifies emails, and sends personalized outreach. One command, fully hands-off.</p>

    <p>Perfect for lean teams at ${contact.companyName} who want pipeline without the grunt work.</p>

    <p>Worth a 10-minute call? I can show you a live demo.</p>

    <p>Cheers,<br/>
    ${process.env.BREVO_SENDER_NAME}<br/>
    </p>
  `,
});