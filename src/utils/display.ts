import Table from 'cli-table3';
import chalk from 'chalk';
import { PipelineResult } from '../types/index.js';

export const printBanner = (): void => {
  console.log(chalk.cyan(`
  ██╗   ██╗ ██████╗  ██████╗ █████╗ ██╗     ██████╗ ███████╗ █████╗  ██████╗██╗  ██╗
  ██║   ██║██╔═══██╗██╔════╝██╔══██╗██║     ██╔══██╗██╔════╝██╔══██╗██╔════╝██║  ██║
  ██║   ██║██║   ██║██║     ███████║██║     ██████╔╝█████╗  ███████║██║     ███████║
  ╚██╗ ██╔╝██║   ██║██║     ██╔══██║██║     ██╔══██╗██╔══╝  ██╔══██║██║     ██╔══██║
   ╚████╔╝ ╚██████╔╝╚██████╗██║  ██║███████╗██║  ██║███████╗██║  ██║╚██████╗██║  ██║
    ╚═══╝   ╚═════╝  ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝
  `));
  console.log(chalk.gray('  Automated Cold Outreach Pipeline v1.0\n'));
};

export const printSummaryTable = (result: Partial<PipelineResult>, dryRun: boolean): void => {
  const table = new Table({
    head: [chalk.cyan('Metric'), chalk.cyan('Value')],
    colWidths: [30, 25],
    style: { head: [], border: ['gray'] },
  });

  table.push(
    ['Companies Found', chalk.yellow(String(result.companies?.length ?? 0))],
    ['Contacts Found', chalk.yellow(String(result.contacts?.length ?? 0))],
    ['Emails Verified', chalk.yellow(String(result.enrichedContacts?.length ?? 0))],
    ['Skipped (dupes/invalid)', chalk.yellow(String(result.skipped ?? 0))],
    ['Errors', chalk.red(String(result.errors?.length ?? 0))],
    ['Mode', dryRun ? chalk.red('DRY RUN — no emails sent') : chalk.green('LIVE')],
  );

  console.log('\n');
  console.log(chalk.bold('  OUTREACH SUMMARY'));
  console.log(table.toString());
};

export const printEmailPreview = (
  to: string,
  subject: string,
  body: string
): void => {
  console.log(chalk.gray('\n  ── Email Preview ──────────────────────────'));
  console.log(chalk.white(`  To      : ${to}`));
  console.log(chalk.white(`  Subject : ${subject}`));
  console.log(chalk.gray('  Body    :'));
  console.log(chalk.white(body.split('\n').map(l => `    ${l}`).join('\n')));
  console.log(chalk.gray('  ───────────────────────────────────────────\n'));
};