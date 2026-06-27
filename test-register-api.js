const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  try {
    const token = await prisma.verificationToken.findFirst({
      where: { email: 'teacher.test2@example.com' },
      orderBy: { expires: 'desc' }
    });
    
    if (!token) throw new Error("No token");
    
    const res = await fetch("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test Teacher 2",
        email: "teacher.test2@example.com",
        password: "password123",
        code: token.token,
        role: "TEACHER",
        accessCode: "NOVA-TEACH-2026"
      })
    });
    
    console.log("Status:", res.status);
    console.log("Body:", await res.text());
  } catch(e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

run();
