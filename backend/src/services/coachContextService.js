import Resume from "../models/resume.js";
import Interview from "../models/interview.js";
import QuestionAnswer from "../models/questionAnswer.js";

export const getCoachContext = async (userId) => {
  try {
    const resume = await Resume.findOne({ userId }).sort({ createdAt: -1 });
    const interviews = await Interview.find({ userId, status: "completed" })
      .sort({ createdAt: -1 })
      .limit(10);

    const interviewIds = interviews.map(i => i._id);
    const qaRecords = await QuestionAnswer.find({ interviewId: { $in: interviewIds } });

    // Calculate dynamic summary statistics
    let totalOverallScore = 0;
    let validInterviewsCount = 0;
    let bestScore = 0;
    const recentScores = [];

    interviews.forEach(int => {
      if (int.overallScore !== null) {
        totalOverallScore += int.overallScore;
        validInterviewsCount++;
        if (int.overallScore > bestScore) {
          bestScore = int.overallScore;
        }
        recentScores.unshift(int.overallScore); // Chronological order
      }
    });

    const overallScore = validInterviewsCount > 0 
      ? Number((totalOverallScore / validInterviewsCount).toFixed(1)) 
      : 0;

    // Calculate strong/weak areas from coveredTopics and scores
    const topicScores = {};
    qaRecords.forEach(qa => {
      if (qa.coveredTopics && Array.isArray(qa.coveredTopics)) {
        qa.coveredTopics.forEach(topic => {
          if (!topicScores[topic]) {
            topicScores[topic] = { total: 0, count: 0 };
          }
          topicScores[topic].total += (qa.score || 0);
          topicScores[topic].count += 1;
        });
      }
    });

    const strongAreas = [];
    const weakAreas = [];
    Object.keys(topicScores).forEach(topic => {
      const avg = topicScores[topic].total / topicScores[topic].count;
      if (avg >= 7.5) {
        strongAreas.push(topic);
      } else if (avg <= 5.5) {
        weakAreas.push(topic);
      }
    });

    // Calculate average score per category
    const categoryScores = {};
    interviews.forEach(int => {
      if (int.category && int.overallScore !== null) {
        if (!categoryScores[int.category]) {
          categoryScores[int.category] = { total: 0, count: 0 };
        }
        categoryScores[int.category].total += int.overallScore;
        categoryScores[int.category].count += 1;
      }
    });

    const categoriesAvg = {};
    Object.keys(categoryScores).forEach(cat => {
      categoriesAvg[cat] = Number((categoryScores[cat].total / categoryScores[cat].count).toFixed(1));
    });

    // Extract feedback points
    const recentFeedback = [];
    qaRecords.forEach(qa => {
      if (qa.evaluation && qa.evaluation.missing_points && Array.isArray(qa.evaluation.missing_points)) {
        recentFeedback.push(...qa.evaluation.missing_points);
      }
    });
    const uniqueFeedback = Array.from(new Set(recentFeedback)).slice(0, 8);

    return {
      resume: resume ? {
        fileName: resume.fileName,
        skills: resume.analysis?.skills || [],
        projects: resume.analysis?.projects || [],
        experience: resume.analysis?.experience || [],
        achievements: resume.analysis?.achievements || [],
        certifications: resume.analysis?.certifications || [],
        topTechnicalSkills: resume.analysis?.top_technical_skills || [],
        recentRole: resume.analysis?.recent_role || null
      } : null,
      performance: {
        overallScore,
        bestScore,
        recentScores,
        strongAreas,
        weakAreas,
        categories: categoriesAvg,
        recentFeedback: uniqueFeedback
      }
    };
  } catch (error) {
    console.error("Failed to build coach context:", error);
    return {
      resume: null,
      performance: {
        overallScore: 0,
        bestScore: 0,
        recentScores: [],
        strongAreas: [],
        weakAreas: [],
        categories: {},
        recentFeedback: []
      }
    };
  }
};
