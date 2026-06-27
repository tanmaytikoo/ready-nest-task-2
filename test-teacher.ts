import 'dotenv/config';
import { db } from './src/lib/db';

async function main() {
  try {
    const teacher = await db.teacher.findFirst({
      include: {
        subjects: {
          include: {
            subject: {
              include: {
                students: {
                  include: {
                    student: {
                      include: {
                        user: true,
                        department: true,
                        semester: true,
                        attendanceRecords: true
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });
    console.log(teacher ? "Success" : "Not found");
  } catch (error) {
    console.error(error);
  }
}
main();
