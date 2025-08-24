// File: back/src/utils/session-middleware.ts
// Last change: Replaced res.end override with 'finish' event listener for session saving

import { randomBytes } from 'crypto';
import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';

const SESSION_MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

declare module 'express-serve-static-core' {
  interface Request {
    session: { [key: string]: any };
    sessionId?: string;
  }
}

async function getSession(sessionId: string) {
  const session = await prisma.session.findUnique({
    where: { sid: sessionId },
  });

  if (!session || new Date() > session.expiresAt) {
    if (session) {
      await prisma.session.delete({ where: { sid: sessionId } });
    }
    return null;
  }

  return JSON.parse(session.data);
}

async function createSession() {
  const sessionId = randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_MS);

  await prisma.session.create({
    data: {
      id: sessionId,
      sid: sessionId,
      data: JSON.stringify({}),
      expiresAt,
    },
  });

  return sessionId;
}

export async function sessionMiddleware(req: Request, res: Response, next: NextFunction) {
  const existingSessionId = req.cookies.sessionId;
  let sessionData = null;

  if (existingSessionId) {
    sessionData = await getSession(existingSessionId);
  }

  if (sessionData) {
    req.session = sessionData;
    req.sessionId = existingSessionId;
  } else {
    const newSessionId = await createSession();
    req.session = {};
    req.sessionId = newSessionId;

    res.cookie('sessionId', newSessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: SESSION_MAX_AGE_MS,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });
  }

  res.on('finish', async () => {
    if (req.session && req.sessionId) {
      const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_MS);
      await prisma.session.update({
        where: { sid: req.sessionId },
        data: {
          data: JSON.stringify(req.session),
          expiresAt,
        },
      });
    }
  });

  next();
}
