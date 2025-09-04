// File: back/src/utils/bridge-session.utils.ts
// Last change: Created a dedicated utility to abstract session management with Prisma

import { prisma } from '../core/prisma.client';
import { AUTH_CONFIG } from 'common/configs/_backaup/auth.config';

export async function get_session_from_db(session_id: string) {
  const session = await prisma.session.findUnique({
    where: { sid: session_id },
  });

  if (!session || new Date() > session.expires_at) {
    if (session) {
      await prisma.session.delete({ where: { sid: session_id } });
    }
    return null;
  }

  return JSON.parse(session.data);
}

export async function create_session_in_db(session_id: string, data: any) {
  const expires_at = new Date(Date.now() + AUTH_CONFIG.session_max_age_ms);

  await prisma.session.create({
    data: {
      sid: session_id,
      data: JSON.stringify(data),
      expires_at,
    },
  });
}

export async function update_session_in_db(session_id: string, data: any) {
  const expires_at = new Date(Date.now() + AUTH_CONFIG.session_max_age_ms);

  await prisma.session.update({
    where: { sid: session_id },
    data: {
      data: JSON.stringify(data),
      expires_at,
    },
  });
}

export async function delete_session_from_db(session_id: string) {
  await prisma.session.delete({
    where: { sid: session_id },
  });
}