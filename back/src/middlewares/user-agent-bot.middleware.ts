// File: back/src/middlewares/user-agent-bot.middleware.ts
// Last change: Renamed from user-agent.middleware.ts for clarity

import { Request, Response, NextFunction } from 'express';

export function detect_bot(user_agent?: string): boolean {
  if (!user_agent) return false;

  const bot_patterns = [
    /bot/i, /crawler/i, /spider/i, /scraper/i,
    /googlebot/i, /bingbot/i, /facebookexternalhit/i,
    /twitterbot/i, /linkedinbot/i, /whatsapp/i,
    /telegram/i, /slack/i, /discord/i
  ];

  return bot_patterns.some(pattern => pattern.test(user_agent));
}

export function bot_detection_middleware(req: Request, res: Response, next: NextFunction) {
  req.useragent = {
    isBot: detect_bot(req.headers['user-agent'])
  };
  next();
}
