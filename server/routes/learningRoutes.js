import { Router } from "express";
import mongoose from "mongoose";
import Lesson from "../models/lesson.js";
import Quizz from "../models/quizz.js";
import Labs from "../models/labs.js";
import { INITIAL_LESSONS, INITIAL_QUIZZES, INITIAL_LABS } from "../utils/seedData.js";
import { cacheMiddleware } from "../middlewares/cacheMiddleware.js";
import { invalidateCachePattern } from "../services/redisService.js";

const router = Router();

// In-memory collections to handle transient state if MongoDB is not connected
let localLessons = [...INITIAL_LESSONS];
let localQuizzes = [...INITIAL_QUIZZES];
let localLabs = [...INITIAL_LABS];

const isMongoActive = () => mongoose.connection.readyState === 1;

// 1. LESSONS
// Get all lessons, optionally populated with quizzes
router.get("/lessons", cacheMiddleware("learning", 300), async (req, res) => {
  try {
    if (isMongoActive()) {
      const lessons = await Lesson.find().populate("quizzes");
      res.json({ success: true, count: lessons.length, data: lessons });
    } else {
      // In-memory populate equivalent
      const populatedLessons = localLessons.map((lesson) => {
        const quizzes = localQuizzes.filter((q) => q.lessonId === lesson.id);
        return {
          ...lesson,
          quizzes: quizzes.map(q => ({
            _id: q.id, // match MongoDB ObjectId mapping
            ...q
          }))
        };
      });
      res.json({ success: true, count: populatedLessons.length, data: populatedLessons });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add a new lesson
router.post("/lessons", async (req, res) => {
  try {
    await invalidateCachePattern("learning:*");
    if (isMongoActive()) {
      const newLesson = new Lesson(req.body);
      await newLesson.save();
      res.status(201).json({ success: true, data: newLesson });
    } else {
      const newLesson = {
        _id: `les_${Date.now()}`,
        id: req.body.id || `les-${Date.now()}`,
        title: req.body.title || "New Interactive Lesson",
        duration: req.body.duration || "10 mins",
        difficulty: req.body.difficulty || "Beginner",
        xpReward: req.body.xpReward || 100,
        learningObjectives: req.body.learningObjectives || [],
        interactiveDiagramType: req.body.interactiveDiagramType || "",
        readingMaterial: req.body.readingMaterial || "",
        quizzes: []
      };
      localLessons.push(newLesson);
      res.status(201).json({ success: true, data: newLesson });
    }
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// 2. QUIZZES
// Get all quiz questions
router.get("/quizzes", cacheMiddleware("learning", 300), async (req, res) => {
  try {
    if (isMongoActive()) {
      const quizzes = await Quizz.find();
      res.json({ success: true, count: quizzes.length, data: quizzes });
    } else {
      res.json({ success: true, count: localQuizzes.length, data: localQuizzes });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add a new quiz question and link it to its lesson
router.post("/quizzes", async (req, res) => {
  try {
    await invalidateCachePattern("learning:*");
    if (isMongoActive()) {
      const newQuizz = new Quizz(req.body);
      await newQuizz.save();

      // Link the quiz back to the lesson if matching lessonId exists
      if (req.body.lessonId) {
        await Lesson.findOneAndUpdate(
          { id: req.body.lessonId },
          { $addToSet: { quizzes: newQuizz._id } }
        );
      }

      res.status(201).json({ success: true, data: newQuizz });
    } else {
      const newQuizz = {
        _id: `q_${Date.now()}`,
        id: req.body.id || `q-${Date.now()}`,
        lessonId: req.body.lessonId || "",
        type: req.body.type || "mcq",
        text: req.body.text || "Question text?",
        options: req.body.options || [],
        correctAnswer: req.body.correctAnswer || "",
        explanation: req.body.explanation || ""
      };
      localQuizzes.push(newQuizz);
      res.status(201).json({ success: true, data: newQuizz });
    }
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// 3. LABS
// Get all labs
router.get("/labs", cacheMiddleware("learning", 300), async (req, res) => {
  try {
    if (isMongoActive()) {
      const labs = await Labs.find();
      res.json({ success: true, count: labs.length, data: labs });
    } else {
      res.json({ success: true, count: localLabs.length, data: localLabs });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add a new lab
router.post("/labs", async (req, res) => {
  try {
    await invalidateCachePattern("learning:*");
    if (isMongoActive()) {
      const newLab = new Labs(req.body);
      await newLab.save();
      res.status(201).json({ success: true, data: newLab });
    } else {
      const newLab = {
        _id: `lab_${Date.now()}`,
        id: req.body.id || `lab-${Date.now()}`,
        title: req.body.title || "New Defensive Lab",
        difficulty: req.body.difficulty || "Beginner",
        xpReward: req.body.xpReward || 200,
        objective: req.body.objective || "",
        description: req.body.description || "",
        targetUrl: req.body.targetUrl || "",
        flag: req.body.flag || "FLAG{new_lab_solved}"
      };
      localLabs.push(newLab);
      res.status(201).json({ success: true, data: newLab });
    }
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// 4. SEED ENDPOINT (Initial Bootstrap)
router.post("/seed", async (req, res) => {
  try {
    await invalidateCachePattern("learning:*");
    const { lessons, quizzes, labs } = req.body;

    if (!lessons || !quizzes || !labs) {
      return res.status(400).json({
        success: false,
        message: "Please provide arrays for 'lessons', 'quizzes', and 'labs' in the request body.",
      });
    }

    if (isMongoActive()) {
      let insertedQuizzes = 0;
      let insertedLessons = 0;
      let insertedLabs = 0;

      // Seed Quizzes first
      for (const q of quizzes) {
        const exists = await Quizz.findOne({ id: q.id });
        if (!exists) {
          const newQ = new Quizz(q);
          await newQ.save();
          insertedQuizzes++;
        }
      }

      // Seed Lessons and link seeded quizzes
      for (const l of lessons) {
        const exists = await Lesson.findOne({ id: l.id });
        if (!exists) {
          // Fetch all quizzes we just seeded with matching lessonId
          const quizzesForLesson = await Quizz.find({ lessonId: l.id });
          const quizObjectIds = quizzesForLesson.map((q) => q._id);

          const newL = new Lesson({
            ...l,
            quizzes: quizObjectIds,
          });
          await newL.save();
          insertedLessons++;
        }
      }

      // Seed Labs
      for (const lab of labs) {
        const exists = await Labs.findOne({ id: lab.id });
        if (!exists) {
          const newLab = new Labs(lab);
          await newLab.save();
          insertedLabs++;
        }
      }

      res.json({
        success: true,
        message: "Seeding run successfully in MongoDB",
        details: {
          quizzesSeeded: insertedQuizzes,
          lessonsSeeded: insertedLessons,
          labsSeeded: insertedLabs,
        },
      });
    } else {
      // In memory seed replacement
      localLessons = [...lessons];
      localQuizzes = [...quizzes];
      localLabs = [...labs];

      res.json({
        success: true,
        message: "Seeding run successfully in transient mock memory node",
        details: {
          quizzesSeeded: quizzes.length,
          lessonsSeeded: lessons.length,
          labsSeeded: labs.length,
        },
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
