import axios from "axios";
import { getCoachContext } from "../services/coachContextService.js";

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:8000";

export const chatWithCoach = async (req, res) => {
  try {
    const { message, conversation } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message content is required"
      });
    }

    const context = await getCoachContext(req.user._id);

    const response = await axios.post(
      `${AI_SERVICE_URL}/api/coach/chat`,
      {
        message,
        conversation: conversation || [],
        context
      }
    );

    return res.status(200).json({
      success: true,
      response: response.data.response
    });
  } catch (error) {
    console.error("Coach chat controller error:", error.response?.data || error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to communicate with AI Coach"
    });
  }
};

export const getCoachContextController = async (req, res) => {
  try {
    const context = await getCoachContext(req.user._id);
    return res.status(200).json({
      success: true,
      context
    });
  } catch (error) {
    console.error("Failed to fetch coach context:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load coach context"
    });
  }
};
