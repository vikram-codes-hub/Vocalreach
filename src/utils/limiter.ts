import Bottleneck from 'bottleneck';
import config from '../config/index.js';

export const apolloLimiter = new Bottleneck({
  minTime: 1000 / config.apollo.rateLimit,
  maxConcurrent: 1,
});

export const prospeoLimiter = new Bottleneck({
  minTime: 2000 / config.prospeo.rateLimit,
  maxConcurrent: 1,
});

export const brevoLimiter = new Bottleneck({
  minTime: 1000 / config.brevo.rateLimit,
  maxConcurrent: 1,
});