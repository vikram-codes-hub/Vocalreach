import fs from 'fs';
import { PipelineResult } from '../types/index.js';
import { log } from '../utils/logger.js';

export const loadSnapshot = (filepath: string): PipelineResult | null => {
  try {
    if (!fs.existsSync(filepath)) {
      log.error(`Snapshot file not found: ${filepath}`);
      return null;
    }

    const raw = fs.readFileSync(filepath, 'utf-8');
    const data = JSON.parse(raw) as PipelineResult;

    log.success(`Snapshot loaded: ${filepath}`);
    log.info(`Resuming run for seed domain: ${data.seedDomain}`);

    return data;
  } catch (err: any) {
    log.error(`Failed to load snapshot: ${err.message}`);
    return null;
  }
};