import fs from 'fs';
import path from 'path';
import { PipelineResult } from '../types/index.js';
import { log } from '../utils/logger.js';
import config from '../config/index.js';

export const saveSnapshot = (result: PipelineResult): string => {
  try {
    if (!fs.existsSync(config.pipeline.snapshotDir)) {
      fs.mkdirSync(config.pipeline.snapshotDir, { recursive: true });
    }

    const filename = `run-${Date.now()}.json`;
    const filepath = path.join(config.pipeline.snapshotDir, filename);

    fs.writeFileSync(filepath, JSON.stringify(result, null, 2));
    log.success(`Snapshot saved: ${filepath}`);

    return filepath;
  } catch (err: any) {
    log.error(`Failed to save snapshot: ${err.message}`);
    return '';
  }
};