import axios from "axios";
import FormData from "form-data";

import Resume from "../models/resume.js";

const AI_SERVICE_URL =
  process.env.AI_SERVICE_URL || "http://localhost:8000";


export const uploadResume = async (req, res) => {
  try {

    // --------------------------------
    // 1. Check authentication
    // --------------------------------

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }


    // --------------------------------
    // 2. Check file
    // --------------------------------

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Resume file is required",
      });
    }


    // --------------------------------
    // 3. Create multipart form
    // --------------------------------

    const form = new FormData();

    form.append(
      "file",
      req.file.buffer,
      {
        filename: req.file.originalname,
        contentType: req.file.mimetype,
      }
    );


    // --------------------------------
    // 4. Send file to FastAPI
    // --------------------------------

    const aiResponse = await axios.post(
      `${AI_SERVICE_URL}/api/interview/process-resume`,
      form,
      {
        headers: {
          ...form.getHeaders(),
        },

        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      }
    );


    // --------------------------------
    // 5. Get Chroma collection ID and analysis
    // --------------------------------

    const {
      collection_id,
      chunk_count,
      analysis,
    } = aiResponse.data;


    if (!collection_id) {
      return res.status(500).json({
        success: false,
        message: "AI service did not return collection ID",
      });
    }


    // --------------------------------
    // 6. Save in MongoDB
    // --------------------------------

    const resume = await Resume.create({
      userId: req.user._id,
      fileName: req.file.originalname,
      chromaCollectionId: collection_id,
      analysis: analysis,
    });


    // --------------------------------
    // 7. Return response
    // --------------------------------

    return res.status(201).json({
      success: true,

      message: "Resume uploaded successfully",

      resume: {
        id: resume._id,
        fileName: resume.fileName,
        collectionId: resume.chromaCollectionId,
        chunkCount: chunk_count,
        analysis: resume.analysis,
      },
    });

  } catch (error) {

    console.error(
      "Resume upload error:",
      error.response?.data || error.message
    );

    return res.status(500).json({
      success: false,
      message: "Failed to upload and process resume",
    });
  }
};

export const getMyResume = async (req, res) => {
  try {
    const resumes = await Resume.find({
      userId: req.user._id,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      resumes: resumes.map(r => ({
        id: r._id,
        fileName: r.fileName,
        collectionId: r.chromaCollectionId,
        uploadedAt: r.uploadedAt,
        analysis: r.analysis,
      })),
      resume: resumes.length > 0 ? {
        id: resumes[0]._id,
        fileName: resumes[0].fileName,
        collectionId: resumes[0].chromaCollectionId,
        uploadedAt: resumes[0].uploadedAt,
        analysis: resumes[0].analysis,
      } : null,
    });

  } catch (error) {
    console.error(
      "Get resumes error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Failed to get resumes",
    });
  }
};

export const deleteResume = async (req, res) => {
  try {
    const { resumeId } = req.params;

    // Verify ownership
    const resume = await Resume.findOne({
      _id: resumeId,
      userId: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    await Resume.deleteOne({
      _id: resumeId,
      userId: req.user._id,
    });

    return res.status(200).json({
      success: true,
      message: "Resume deleted successfully",
      resumeId: resumeId,
    });

  } catch (error) {
    console.error("Delete resume error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete resume",
    });
  }
};