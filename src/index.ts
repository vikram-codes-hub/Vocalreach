import { Command } from 'commander';
import { printBanner } from './utils/display.js';
import { runPipeline } from './pipeline.js';
import { log } from './utils/logger.js';

const program = new Command();

printBanner();

program
  .name('vocalreach')
  .description('Automated cold outreach pipeline — one domain in, emails out')
  .version('1.0.0');

program
  .argument('<domain>', 'Seed company domain e.g. stripe.com')
  .option('--dry-run', 'Run full pipeline without sending emails', false)
  .option('--verbose', 'Log every API request and response', false)
  .option('--limit <number>', 'Max number of companies to process', '10')
  .option('--resume <file>', 'Resume pipeline from a saved snapshot')
  .action(async (domain: string, options: {
    dryRun: boolean;
    verbose: boolean;
    limit: string;
    resume?: string;
  }) => {
    if (!domain && !options.resume) {
      log.error('Please provide a seed domain. e.g: npx ts-node src/index.ts stripe.com');
      process.exit(1);
    }

    await runPipeline(domain, {
      dryRun: options.dryRun,
      verbose: options.verbose,
      limit: parseInt(options.limit),
      resume: options.resume,
    });
  });

program.parse(process.argv);