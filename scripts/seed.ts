// scripts/seed.ts is used to seed the database with some initial data. This is useful when you want to populate the database with some data that you can use for testing or development purposes. In this case, we are seeding the database with some categories that will be used in the application.
// also for testing purposes, you can use seed.ts to populate the database with some initial data that you can use to test your application.

const { PrismaClient } = require('@prisma/client')

const db = new PrismaClient();

async function main() {
    try {
        await db.category.createMany({
            data: [
                { name: 'Famous People' },
                { name: 'Movies & TV' },
                { name: 'Musicians' },
                { name: 'Animals' },
                { name: 'Philosophy' },
                { name: 'Scientists' },
                { name: 'Family' },
                { name: 'Friends' },
                { name: 'Love' },
                { name: 'Died People' },

            ],
        });
    } catch (error) {
        console.error(error);
    } finally {
        await db.$disconnect();
    }
}

main()

// to run this script, you can use the following command:
// node scripts/seed.ts