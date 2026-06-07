import { PipelineResult } from '../types/index.js';
import { printSummaryTable } from '../utils/display.js';

export const buildSummary = (
  result: Partial<PipelineResult>,
  dryRun: boolean
): void => {
  printSummaryTable(result, dryRun);
};