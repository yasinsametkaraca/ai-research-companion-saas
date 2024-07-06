// prismadb.ts is used to create a single instance of PrismaClient that can be reused across all modules.
import { PrismaClient } from '@prisma/client'

declare global {
    var prisma: PrismaClient | undefined
}

const prismaDb = globalThis.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prismaDb // This is to prevent hot-reloading from creating new instances of PrismaClient. It will reuse the same instance across all modules.

export default prismaDb