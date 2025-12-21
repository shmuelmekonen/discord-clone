import { PrismaClient } from "./generated/prisma"; // שים לב לנתיב היחסי!

declare global {
  var prisma: PrismaClient | undefined;
}

export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalThis.prisma = db;
