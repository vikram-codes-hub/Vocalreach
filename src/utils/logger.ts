import winston from 'winston';
import chalk from 'chalk';
import path from 'path';
import fs from 'fs';
import config from '../config/index.js';

// create logs dir if not exists
if (!fs.existsSync(config.pipeline.logsDir)) {
  fs.mkdirSync(config.pipeline.logsDir, { recursive: true });
}

const logFile = path.join(
  config.pipeline.logsDir,
  `run-${new Date().toISOString().split('T')[0]}.log`
);

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: logFile }),
  ],
});

// pretty console logger
export const log = {
  info: (msg: string) => {
    logger.info(msg);
    console.log(chalk.blue('ℹ'), chalk.white(msg));
  },
  success: (msg: string) => {
    logger.info(msg);
    console.log(chalk.green('✔'), chalk.green(msg));
  },
  warn: (msg: string) => {
    logger.warn(msg);
    console.log(chalk.yellow('⚠'), chalk.yellow(msg));
  },
  error: (msg: string) => {
    logger.error(msg);
    console.log(chalk.red('✖'), chalk.red(msg));
  },
  stage: (n: number, msg: string) => {
    logger.info(`[Stage ${n}] ${msg}`);
    console.log(chalk.magenta(`\n  [Stage ${n}]`), chalk.bold(msg));
  },
  verbose: (msg: string, data?: unknown) => {
    logger.debug(msg, { data });
    if (config.pipeline.verbose) {
      console.log(chalk.gray('  →'), chalk.gray(msg));
      if (data) console.log(chalk.gray(JSON.stringify(data, null, 2)));
    }
  },
};

export default logger;