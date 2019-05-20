import { prisma, Prisma } from "./generated/prisma-client";

export type Context = {
    prisma: Prisma
}

export const getContext = { prisma } as Context