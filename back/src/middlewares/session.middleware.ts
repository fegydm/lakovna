// File: back/src/middlewares/session.middleware.ts
// Last change: Refactored to use a consolidated database utility for session management

import { randomBytes } from 'crypto';
import { Request, Response, NextFunction } from 'express';
import { AUTH_CONFIG } from 'common/configs/auth.config';
import { get_session_from_db, create_session_in_db, update_session_in_db } from '../utils/session.utils';

declare module 'express-serve-static-core' {
  interface Request {
    session: { [key: string]: any };
    session_id?: string;
  }
}

function generate_session_id(): string {
  return randomBytes(32).toString('hex');
}

export async function session_middleware(req: Request, res: Response, next: NextFunction) {
  const existing_session_id = req.cookies.session_id;
  let session_data = null;

  if (existing_session_id) {
    session_data = await get_session_from_db(existing_session_id);
  }

  if (session_data) {
    req.session = session_data;
    req.session_id = existing_session_id;
  } else {
    const new_session_id = generate_session_id();
    req.session = {};
    req.session_id = new_session_id;
    await create_session_in_db(new_session_id, req.session);

    res.cookie('session_id', new_session_id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: AUTH_CONFIG.session_max_age_ms,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });
  }

  res.on('finish', async () => {
    if (req.session && req.session_id) {
      await update_session_in_db(req.session_id, req.session);
    }
  });

  next();
}