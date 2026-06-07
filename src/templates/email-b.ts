import { EnrichedContact } from '../types/index.js';

export const emailB = (contact: EnrichedContact) => ({
  subject: `Helping ${contact.companyName} automate sales prospecting`,
  body: `
    <p>Hi ${contact.firstName},</p>

    <p>I noticed ${contact.companyName} is growing fast — congrats on what you've built so far.</p>

    <p>At this stage, most teams hit the same wall: outreach is still manual, slow, and inconsistent. 
    I've built a fully automated pipeline that takes a single company domain and fires personalized 
    emails to verified decision-makers — zero manual steps in between.</p>

    <p>It's already saving teams hours every week. I'd love to show you how it could work 
    for ${contact.companyName} specifically.</p>

    <p>Open to a quick 15-minute chat?</p>

    <p>Best,<br/>
    ${process.env.BREVO_SENDER_NAME}<br/>
    </p>
  `,
});