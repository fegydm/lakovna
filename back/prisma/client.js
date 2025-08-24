// File: prisma/client.ts
// Last change: Added connection pooling and graceful shutdown
import { PrismaClient } from '@prisma/client';
export const prisma = globalThis.__prisma || new PrismaClient({
    log: process.env.NODE_ENV === 'development'
        ? ['query', 'info', 'warn', 'error']
        : ['error'],
});
if (process.env.NODE_ENV !== 'production') {
    globalThis.__prisma = prisma;
}
process.on('beforeExit', async () => {
    await prisma.$disconnect();
});
export default prisma;
