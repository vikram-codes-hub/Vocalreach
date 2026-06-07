import inquirer from 'inquirer';
import { log } from '../utils/logger.js';
import { EnrichedContact } from '../types/index.js';
import { printEmailPreview } from '../utils/display.js';
import { selectTemplate } from '../templates/template.js';

export const safetyPrompt = async (
  contacts: EnrichedContact[],
  dryRun: boolean
): Promise<boolean> => {
  if (dryRun) {
    log.warn('Dry run mode — skipping safety prompt');
    return true;
  }

  const { action } = await inquirer.prompt([
    {
      type: 'select',
      name: 'action',
      message: `Proceed with sending ${contacts.length} emails?`,
      choices: [
        { name: '✅  Yes — send all emails now', value: 'yes' },
        { name: '👀  Preview first email before sending', value: 'preview' },
        { name: '❌  No — abort pipeline', value: 'no' },
      ],
    },
  ]);

  if (action === 'no') {
    log.warn('Pipeline aborted by user');
    return false;
  }

  if (action === 'preview') {
    const first = contacts[0];
    const template = selectTemplate(first);
    printEmailPreview(first.email, template.subject, template.body);

    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: 'Looks good? Proceed with sending?',
        default: true,
      },
    ]);

    if (!confirm) {
      log.warn('Pipeline aborted after preview');
      return false;
    }
  }

  return true;
};