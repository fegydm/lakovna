// File: back/src/middlewares/user-agent.middleware.ts
// Last change: Fixed property naming to avoid type errors in Request object

import { Request, Response, NextFunction } from 'express';

export function is_bot(user_agent?: string): boolean {
  if (!user_agent) return false;
  
  const bot_patterns = [
    /bot/i, /crawler/i, /spider/i, /scraper/i,
    /googlebot/i, /bingbot/i, /facebookexternalhit/i,
    /twitterbot/i, /linkedinbot/i, /whatsapp/i,
    /telegram/i, /slack/i, /discord/i
  ];
  
  return bot_patterns.some(pattern => pattern.test(user_agent));
}

export function user_agent_middleware(req: Request, res: Response, next: NextFunction) {
  req.useragent = {
    isBot: is_bot(req.headers['user-agent'])
  };
  next();
}