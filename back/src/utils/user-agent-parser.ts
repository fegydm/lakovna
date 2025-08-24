// File: back/src/utils/user-agent-parser.ts
// Last change: Replaced express-useragent with simple bot detection

import { Request, Response, NextFunction } from 'express';

declare module 'express-serve-static-core' {
  interface Request {
    useragent?: {
      isBot: boolean;
    };
  }
}

function isBot(userAgent?: string): boolean {
  if (!userAgent) return false;

  const botPatterns = [
    /bot/i, /crawler/i, /spider/i, /scraper/i,
    /googlebot/i, /bingbot/i, /facebookexternalhit/i,
    /twitterbot/i, /linkedinbot/i, /whatsapp/i,
    /telegram/i, /slack/i, /discord/i
  ];

  return botPatterns.some(pattern => pattern.test(userAgent));
}

export function userAgentMiddleware(req: Request, res: Response, next: NextFunction) {
  req.useragent = {
    isBot: isBot(req.headers['user-agent'])
  };
  next();
}
