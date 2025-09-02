// File: database/utils/prisma.utils.ts
// Last change: Created a dedicated utility for all Prisma-related database calls

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const prisma_get_vehicles = async (): Promise<any[]> => {
  return prisma.vehicle.findMany();
};

export const prisma_get_stages = async (): Promise<any[]> => {
  return prisma.stage.findMany();
};
// Sem pridajte ďalšie funkcie pre ďalšie modely, ktoré chcete použiť