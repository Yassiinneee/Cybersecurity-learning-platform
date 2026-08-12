import Lesson from "../models/lesson.js";
import Quizz from "../models/quizz.js";
import Labs from "../models/labs.js";
import { INITIAL_QUIZZES, INITIAL_LESSONS, INITIAL_LABS } from "./seedData.js";

export async function autoSeedDatabase() {
  try {
    console.log("🌱 [Seeder] Checking database for initial content...");

    // 1. Seed Quizzes
    const quizCount = await Quizz.countDocuments();
    if (quizCount === 0) {
      console.log(`🌱 [Seeder] Seeding ${INITIAL_QUIZZES.length} default quizzes...`);
      for (const q of INITIAL_QUIZZES) {
        await Quizz.findOneAndUpdate({ id: q.id }, q, { upsert: true });
      }
      console.log("🌱 [Seeder] Quizzes seeded successfully.");
    }

    // 2. Seed Lessons
    const lessonCount = await Lesson.countDocuments();
    if (lessonCount === 0) {
      console.log(`🌱 [Seeder] Seeding ${INITIAL_LESSONS.length} default lessons...`);
      for (const l of INITIAL_LESSONS) {
        // Fetch all quizzes we just seeded with matching lessonId
        const quizzesForLesson = await Quizz.find({ lessonId: l.id });
        const quizObjectIds = quizzesForLesson.map((q) => q._id);

        await Lesson.findOneAndUpdate(
          { id: l.id },
          {
            ...l,
            quizzes: quizObjectIds,
          },
          { upsert: true }
        );
      }
      console.log("🌱 [Seeder] Lessons seeded successfully.");
    }

    // 3. Seed Labs
    console.log(`🌱 [Seeder] Upserting ${INITIAL_LABS.length} default labs...`);
    for (const lab of INITIAL_LABS) {
      await Labs.findOneAndUpdate({ id: lab.id }, lab, { upsert: true });
    }
    console.log("🌱 [Seeder] Labs seeded and synchronized successfully.");

    console.log("🌱 [Seeder] Database verification/seeding completed.");
  } catch (error) {
    console.error("⚠️ [Seeder] Error during database auto-seeding:", error);
  }
}
