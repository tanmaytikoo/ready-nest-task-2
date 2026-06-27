import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  try {
    const subjects = await prisma.subject.findMany({
      include: {
        course: true,
        semester: true,
        teachers: {
          include: {
            teacher: {
              include: { user: true }
            }
          }
        }
      },
      orderBy: { name: 'asc' }
    });
    console.log(subjects.length);
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
