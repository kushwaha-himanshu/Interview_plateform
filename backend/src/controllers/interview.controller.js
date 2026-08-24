import axios from "axios";

import Resume from "../models/resume.js";
import Interview from "../models/interview.js";
import QuestionAnswer from "../models/questionAnswer.js";
const AI_SERVICE_URL =
  process.env.AI_SERVICE_URL ||
  "http://localhost:8000";


const getQuestionCount = (duration) => {
  switch (duration) {
    case "15 min":
      return 5;
    case "30 min":
      return 8;
    case "45 min":
      return 12;
    default:
      return 5;
  }
};

export const startInterview = async (req, res) => {

  try {

    // -----------------------------
    // 1. Get logged-in user
    // -----------------------------

    const userId = req.user._id;


    // -----------------------------
    // 2. Get category, setup settings, and selected resume
    // -----------------------------

    const {
      resumeId,
      category,
      difficulty,
      interviewerStyle,
      duration,
    } = req.body;

    if (!resumeId || !category || !difficulty || !interviewerStyle || !duration) {
      return res.status(400).json({
        success: false,
        message: "Required options missing: resumeId, category, difficulty, interviewerStyle, duration",
      });
    }

    const resume = await Resume.findOne({
      _id: resumeId,
      userId: userId,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found or access denied",
      });
    }

    const totalQuestions = getQuestionCount(duration);

    // -----------------------------
    // 3. Call Python AI service
    // -----------------------------

    const aiResponse = await axios.post(
      `${AI_SERVICE_URL}/api/interview/start`,
      {
        resume_id: resume._id,
        collection_id:
          resume.chromaCollectionId,

        category: category,
        difficulty: difficulty,
        interviewer_style: interviewerStyle,
        duration: duration,
        total_questions: totalQuestions,
      }
    );


    // -----------------------------
    // 4. Get AI response
    // -----------------------------

    const {
      session_id,
      question,
    } = aiResponse.data;


    // -----------------------------
    // 5. Save interview in MongoDB
    // -----------------------------

    const interview =
      await Interview.create({

        userId: userId,

        resumeId: resume._id,
        resumeFileName: resume.fileName,
        sessionId: session_id,
        category: category,
        difficulty: difficulty,
        interviewerStyle: interviewerStyle,
        duration: duration,
        totalQuestions: totalQuestions,
        currentQuestionNumber: 1,

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
          interview.currentQuestionNumber,

        totalQuestions:
          interview.totalQuestions,

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

    const { interviewId } =
      req.params;

    const { answer } =
      req.body;


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


    const result =
      aiResponse.data;


    // -----------------------------
    // 5. Save Q&A
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
    // 6. Update current question
    // -----------------------------

    interview.currentQuestion =
      result.completed
        ? null
        : result.question;

    interview.currentQuestionNumber =
      result.completed
        ? interview.totalQuestions
        : result.question_number;


    // -----------------------------
    // 7. Interview completed
    // -----------------------------

    if (result.completed) {

      // Get all answers
      const answers =
        await QuestionAnswer.find({
          interviewId:
            interview._id,
        });


      // Calculate total score
      const totalScore =
        answers.reduce(
          (sum, item) =>
            sum + (item.score || 0),
          0
        );


      // Calculate average
      const overallScore =
        answers.length > 0
          ? Number(
              (
                totalScore /
                answers.length
              ).toFixed(1)
            )
          : 0;


      // Save final interview data
      interview.status =
        "completed";

      interview.overallScore =
        overallScore;

      interview.questionsAnswered =
        answers.length;

    }


    // -----------------------------
    // 8. Save interview
    // -----------------------------

    await interview.save();


    // -----------------------------
    // 9. Return response
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

export const getInterviewHistory = async (req, res) => {
  try {

    // Get only completed interviews
    const interviews = await Interview.find({
      userId: req.user._id,
      status: "completed",
    })
      .sort({
        createdAt: -1,
      })
      .select(
        "_id category status createdAt"
      )
      .lean();


    // Calculate score for every interview
    const history = await Promise.all(

      interviews.map(async (interview) => {

        const answers =
          await QuestionAnswer.find({
            interviewId: interview._id,
          })
            .select("score")
            .lean();


        // Total score
        const totalScore =
          answers.reduce(
            (sum, item) =>
              sum + Number(item.score || 0),
            0
          );


        // Average score out of 10
        const overallScore =
          answers.length > 0
            ? Number(
                (
                  totalScore /
                  answers.length
                ).toFixed(1)
              )
            : 0;


        return {

          _id: interview._id,

          category:
            interview.category,

          status:
            interview.status,

          overallScore,

          questionsAnswered:
            answers.length,

          createdAt:
            interview.createdAt,

        };

      })
    );


    return res.status(200).json({

      success: true,

      interviews: history,

    });


  } catch (error) {

    console.error(
      "Get interview history error:",
      error.message
    );


    return res.status(500).json({

      success: false,

      message:
        "Failed to fetch interview history",

    });

  }
};


export const getAnalytics = async (req, res) => {
  try {

    // Only completed interviews
    const interviews = await Interview.find({
      userId: req.user._id,
      status: "completed",
    })
      .sort({ createdAt: 1 })
      .lean();

    if (!interviews.length) {
      return res.status(200).json({
        success: true,
        analytics: {
          overview: {
            overallScore: 0,
            totalSessions: 0,
            averageImprovement: 0,
          },
          skills: [],
          trend: [],
          recentInterviews: [],
        },
      });
    }

    const interviewIds = interviews.map(
      (item) => item._id
    );

    // Get all answers belonging to these interviews
    const answers = await QuestionAnswer.find({
      interviewId: {
        $in: interviewIds,
      },
    })
      .sort({
        questionNumber: 1,
      })
      .lean();


    // --------------------------------
    // Calculate score for each interview
    // --------------------------------

    const interviewStats = interviews.map(
      (interview) => {

        const interviewAnswers =
          answers.filter(
            (answer) =>
              answer.interviewId.toString() ===
              interview._id.toString()
          );

        const totalScore =
          interviewAnswers.reduce(
            (sum, answer) =>
              sum + Number(answer.score || 0),
            0
          );

        const score =
          interviewAnswers.length
            ? Number(
                (
                  totalScore /
                  interviewAnswers.length
                ).toFixed(1)
              )
            : 0;

        return {
          ...interview,
          score,
          questions:
            interviewAnswers.length,
        };
      }
    );


    // --------------------------------
    // Overall statistics
    // --------------------------------

    const scores =
      interviewStats.map(
        (item) => item.score
      );

    const totalScore =
      scores.reduce(
        (sum, score) =>
          sum + score,
        0
      );

    const overallScore =
      scores.length
        ? Number(
            (
              totalScore /
              scores.length
            ).toFixed(1)
          )
        : 0;


    const bestScore =
      Math.max(...scores);


    // --------------------------------
    // Improvement
    // --------------------------------

    let averageImprovement = 0;

    if (scores.length >= 2) {

      const recent =
        scores.slice(-7);

      const first =
        recent[0];

      const last =
        recent[recent.length - 1];

      averageImprovement =
        Number(
          (
            last - first
          ).toFixed(1)
        );

    }


    // --------------------------------
    // Score trend
    // --------------------------------

    const trend =
  interviewStats.map(
    (item, index) => ({

      session:
        `Interview ${index + 1}`,

      score:
        Math.round(
          item.score * 10
        ),

    })
  );


    // --------------------------------
    // Category performance
    // --------------------------------
// --------------------------------
// Skill / Topic Performance
// --------------------------------

const normalizeTopic = (topic) => {

  const value =
    topic.trim().toLowerCase();

  const aliases = {

    "js": "JavaScript",

    "javascript": "JavaScript",

    "reactjs": "React",

    "react.js": "React",

    "mongodb": "MongoDB",

    "mongo db": "MongoDB",

    "dsa": "DSA",

    "data structures": "DSA",

    "dbms": "DBMS",

    "database management system":
      "DBMS",

  };

  return (
    aliases[value] ||
    topic.trim()
  );

};


const topicMap = {};


answers.forEach((answer) => {

  const score =
    Number(answer.score || 0);

  const topics =
    answer.coveredTopics || [];


  topics.forEach((topic) => {

    const normalizedTopic =
      normalizeTopic(topic);

    if (!normalizedTopic) {
      return;
    }


    if (!topicMap[normalizedTopic]) {

      topicMap[normalizedTopic] = {

        totalScore: 0,

        questionCount: 0,

      };

    }


    topicMap[normalizedTopic]
      .totalScore += score;


    topicMap[normalizedTopic]
      .questionCount++;

  });

});


const skills =
  Object.entries(topicMap)

    .map(([topic, data]) => {

      const averageScore =
        data.totalScore /
        data.questionCount;


      return {

        skill: topic,

        value: Math.round(
          averageScore * 10
        ),

      };

    })

    .sort(
      (a, b) =>
        b.value - a.value
    )

    .slice(0, 6);
    // --------------------------------
    // Recent interviews
    // --------------------------------

    const recentInterviews =
      [...interviewStats]
        .reverse()
        .slice(0, 5)
        .map(
          (interview, index, array) => {

            const current =
              interview.score;

            const previous =
              array[index + 1]?.score;

            let improvement = "-";

            if (
              previous !== undefined
            ) {

              const difference =
                current -
                previous;

              improvement =
                `${difference >= 0 ? "+" : ""}${Math.round(
                  difference * 10
                )}%`;

            }

            return {

              id:
                interview._id,

              date:
                new Date(
                  interview.createdAt
                ).toLocaleDateString(
                  "en-IN",
                  {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  }
                ),

              category:
                interview.category,

              score:
                `${Math.round(
                  current * 10
                )}%`,

              duration:
                `${interview.questions} Questions`,

              improvement,

              tone:
                "default",

            };

          }
        );


    return res.status(200).json({

      success: true,

      analytics: {

        overview: {

          overallScore,

          bestScore,

          totalSessions:
            interviews.length,

          totalQuestions:
            answers.length,

          averageImprovement,

        },

        skills,

        trend,

        recentInterviews,

      },

    });


  } catch (error) {

    console.error(
      "Analytics error:",
      error.message
    );

    return res.status(500).json({

      success: false,

      message:
        "Failed to generate analytics",

    });

  }
};