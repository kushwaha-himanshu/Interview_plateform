import axios from "axios";

import Resume from "../models/resume.js";
import Interview from "../models/interview.js";
import QuestionAnswer from "../models/questionAnswer.js";
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
        sessionId: session_id,
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

export const submitInterviewAnswer = async (
  req,
  res
) => {

  try {

    const { interviewId } = req.params;

    const { answer } = req.body;


    // -----------------------------
    // 1. Validate answer
    // -----------------------------

    if (!answer || !answer.trim()) {

      return res.status(400).json({
        success: false,
        message: "Answer is required",
      });

    }


    // -----------------------------
    // 2. Find interview
    // -----------------------------

    const interview =
      await Interview.findOne({
        _id: interviewId,
        userId: req.user._id,
      });


    if (!interview) {

      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });

    }


    // -----------------------------
    // 3. Save current question
    // -----------------------------

    const currentQuestion =
      interview.currentQuestion;


    // -----------------------------
    // 4. Send answer to Python
    // -----------------------------

    const aiResponse =
      await axios.post(
        `${AI_SERVICE_URL}/api/interview/answer`,
        {
          session_id:
            interview.sessionId,

          answer: answer,
        }
      );


    const result = aiResponse.data;


    // -----------------------------
    // 5. Save Q&A in MongoDB
    // -----------------------------

    await QuestionAnswer.create({

      interviewId:
        interview._id,

      question:
        currentQuestion,

      answer:
        answer,

      score:
        result.score,

      evaluation:
        result.evaluation,

      difficulty:
        result.difficulty,

      coveredTopics:
        result.covered_topics || [],

      questionNumber:
        result.question_number,

    });


    // -----------------------------
    // 6. Update interview
    // -----------------------------

    interview.currentQuestion =
      result.completed
        ? null
        : result.question;


    if (result.completed) {

      interview.status =
        "completed";

    }


    await interview.save();


    // -----------------------------
    // 7. Return to frontend
    // -----------------------------

    return res.status(200).json({

      success: true,

      completed:
        result.completed,

      evaluation:
        result.evaluation,

      score:
        result.score,

      difficulty:
        result.difficulty,

      nextQuestion:
        result.completed
          ? null
          : result.question,

      questionNumber:
        result.question_number,

      coveredTopics:
        result.covered_topics || [],

    });

  } catch (error) {

    console.error(
      "Submit answer error:",
      error.response?.data ||
      error.message
    );

    return res.status(500).json({

      success: false,

      message:
        "Failed to submit answer",

    });

  }
};

export const getInterviewReport = async (req, res) => {
  try {

    const { interviewId } = req.params;

    // -----------------------------
    // 1. Find interview
    // -----------------------------

    const interview = await Interview.findOne({
      _id: interviewId,
      userId: req.user._id,
    });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    // -----------------------------
    // 2. Get all answers
    // -----------------------------

    const answers = await QuestionAnswer
      .find({
        interviewId: interview._id,
      })
      .sort({
        questionNumber: 1,
      });

    if (!answers.length) {
      return res.status(404).json({
        success: false,
        message: "No interview answers found",
      });
    }

    // -----------------------------
    // 3. Calculate overall score
    // -----------------------------

    const totalScore = answers.reduce(
      (sum, item) =>
        sum + (item.score || 0),
      0
    );

    const overallScore =
      Number(
        (totalScore / answers.length)
          .toFixed(1)
      );

    // -----------------------------
    // 4. Collect strengths
    // -----------------------------

    const strengths = [];

    const weaknesses = [];

    const topics = new Set();

    answers.forEach((item) => {

      // Topics
      if (item.coveredTopics) {
        item.coveredTopics.forEach(
          (topic) => topics.add(topic)
        );
      }

      // Correct points
      if (
        item.evaluation?.correct_points
      ) {
        strengths.push(
          ...item.evaluation.correct_points
        );
      }

      // Missing points
      if (
        item.evaluation?.missing_points
      ) {
        weaknesses.push(
          ...item.evaluation.missing_points
        );
      }
    });

    // -----------------------------
    // 5. Return report
    // -----------------------------

    return res.status(200).json({

      success: true,

      report: {

        interviewId:
          interview._id,

        category:
          interview.category,

        status:
          interview.status,

        overallScore,

        questionsAnswered:
          answers.length,

        strengths:
          [...new Set(strengths)],

        weaknesses:
          [...new Set(weaknesses)],

        topicsCovered:
          [...topics],

        answers: answers.map(
          (item) => ({
            question:
              item.question,

            answer:
              item.answer,

            score:
              item.score,

            evaluation:
              item.evaluation,

            difficulty:
              item.difficulty,

            questionNumber:
              item.questionNumber,
          })
        ),
      },
    });

  } catch (error) {

    console.error(
      "Get report error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Failed to generate interview report",
    });
  }
};

