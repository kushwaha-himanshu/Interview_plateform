import axios from "axios";

import Resume from "../models/resume.js";
import Interview from "../models/interview.js";

const AI_SERVICE_URL =
  process.env.AI_SERVICE_URL ||
  "http://localhost:8000";


export const startInterview = async (req, res) => {

  try {

    // -----------------------------
    // 1. Get logged-in user
    // -----------------------------

    const userId = req.user._id;


    // -----------------------------
    // 2. Find user's resume
    // -----------------------------

    const resume = await Resume.findOne({
      userId: userId,
    }).sort({
      createdAt: -1,
    });


    if (!resume) {

      return res.status(404).json({
        success: false,
        message: "Please upload a resume first",
      });

    }


    // -----------------------------
    // 3. Get category
    // -----------------------------

    const {
      category = "technical",
    } = req.body;


    // -----------------------------
    // 4. Call Python AI service
    // -----------------------------

    const aiResponse = await axios.post(
      `${AI_SERVICE_URL}/api/interview/start`,
      {
        collection_id:
          resume.chromaCollectionId,

        category: category,

        num_questions: 5,
      }
    );


    // -----------------------------
    // 5. Get AI response
    // -----------------------------

    const {
      session_id,
      question,
      question_number,
      total_questions,
    } = aiResponse.data;


    // -----------------------------
    // 6. Save interview in MongoDB
    // -----------------------------

    const interview =
      await Interview.create({

        userId: userId,

        resumeId: resume._id,

        category: category,

        status: "in_progress",

        currentQuestion: question,
      });


    // -----------------------------
    // 7. Return to React
    // -----------------------------

    return res.status(201).json({

      success: true,

      interview: {

        id: interview._id,

        sessionId: session_id,

        question: question,

        questionNumber:
          question_number,

        totalQuestions:
          total_questions,

        status:
          interview.status,

      },

    });

  } catch (error) {

    console.error(
      "Start interview error:",
      error.response?.data ||
      error.message
    );


    return res.status(500).json({

      success: false,

      message:
        "Failed to start interview",

    });

  }

};