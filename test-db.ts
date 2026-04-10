import { PrismaClient } from "./app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function test() {
  try {
    console.log("Testing Prisma connection...");
    const users = await prisma.user.findMany();
    console.log(`Connection successful. Found ${users.length} users.`);

    const categories = await prisma.category.findMany();
    console.log(`Categories table accessible. Found ${categories.length} categories.`);

    console.log("\nSchema verification:");
    console.log("User model: working");
    console.log("Category model: working");
    console.log("Database connection: working");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Error: ${message}`);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

test();
