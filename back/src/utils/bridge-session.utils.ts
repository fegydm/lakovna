// File: back/src/utils/bridge-session.utils.ts
// Last change: Corrected the path to the session config value.

import { prisma } from '../core/prisma.client';
import { APP_CONFIG } from 'common/configs/03-app.config';
import type { SessionData } from 'common/types/auth.types';

export async function getSessionFromDb(sessionId: string): Promise<SessionData | null> {
  const session = await prisma.session.findUnique({
    where: { sid: sessionId },
  });

  if (!session || new Date() > session.expiresAt) {
    if (session) {
      await prisma.session.delete({ where: { sid: sessionId } });
    }
    return null;
  }

  return JSON.parse(session.data) as SessionData;
}

export async function createSessionInDb(sessionId: string, data: SessionData): Promise<void> {
  // OPRAVA: Správna cesta ku konfiguračnej hodnote
  const expiresAt = new Date(Date.now() + APP_CONFIG.session.maxAgeMs);

  await prisma.session.create({
    data: {
      sid: sessionId,
      data: JSON.stringify(data),
      expiresAt,
    },
  });
}

export async function updateSessionInDb(sessionId: string, data: SessionData): Promise<void> {
  // OPRAVA: Správna cesta ku konfiguračnej hodnote
  const expiresAt = new Date(Date.now() + APP_CONFIG.session.maxAgeMs);

  await prisma.session.update({
    where: { sid: sessionId },
    data: {
      data: JSON.stringify(data),
      expiresAt,
    },
  });
}

export async function deleteSessionFromDb(sessionId: string): Promise<void> {
  try {
    await prisma.session.delete({
      where: { sid: sessionId },
    });
  } catch (error) {
    console.warn(`Session with sid ${sessionId} not found for deletion.`);
  }
}