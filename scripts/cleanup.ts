import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Delete test user
  const testUser = await prisma.user.findUnique({ where: { email: "test@example.com" } });
  if (testUser) {
    await prisma.student.deleteMany({ where: { userId: testUser.id } });
    await prisma.user.delete({ where: { id: testUser.id } });
    console.log("Deleted test user");
  }
  
  // Delete old verification tokens
  await prisma.verificationToken.deleteMany({});
  console.log("Cleaned verification tokens");
  
  console.log("Done!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
