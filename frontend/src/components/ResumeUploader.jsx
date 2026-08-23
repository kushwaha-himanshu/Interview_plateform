import {
  CloudUpload,
  FileText,
  Upload,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import { useRef, useState,useEffect } from "react";

import api from "../services/api";


export default function ResumeUploader() {

  const inputRef = useRef(null);

  const [fileName, setFileName] =
    useState("");

  const [uploading, setUploading] =
    useState(false);

  const [uploaded, setUploaded] =
    useState(false);

  const [error, setError] =
    useState("");
useEffect(() => {
  const fetchResume = async () => {
    try {
      const response = await api.get("/resume");

      const resume = response.data.resume;

      if (resume) {
        setFileName(resume.fileName);
        setUploaded(true);
      }

    } catch (error) {
      console.error(
        "Failed to load resume:",
        error
      );
    }
  };

  fetchResume();
}, []);

  const uploadFile = async (file) => {

    if (!file) return;

    setError("");
    setUploaded(false);

    // -------------------------
    // Validate file
    // -------------------------

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {

      setError(
        "Only PDF and DOCX files are supported."
      );

      return;
    }


    // -------------------------
    // Validate size
    // -------------------------

    if (file.size > 10 * 1024 * 1024) {

      setError(
        "File size must be less than 10MB."
      );

      return;
    }


    setFileName(file.name);
    setUploading(true);


    try {

      const formData = new FormData();

      formData.append(
        "file",
        file
      );


      const response = await api.post(
        "/resume/upload",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );


      console.log(
        "Resume uploaded:",
        response.data
      );

console.log("SETTING UPLOADED TRUE");
      setUploaded(true);


    } catch (error) {

      console.error(
        "Resume upload failed:",
        error
      );


      setUploaded(false);

      setError(
        error.response?.data?.message ||
        "Failed to upload resume."
      );


    } finally {

      setUploading(false);

    }
  };


  const chooseFile = (file) => {

    uploadFile(file);

  };


  return (

    <section
      className="resume-uploader dashboard-card"

      onDragOver={(event) =>
        event.preventDefault()
      }

      onDrop={(event) => {

        event.preventDefault();

        chooseFile(
          event.dataTransfer.files[0]
        );

      }}
    >

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={(event) =>
          chooseFile(
            event.target.files[0]
          )
        }
        hidden
      />


      {uploading ? (

        <>
          <Loader2
            className="upload-icon spin"
            size={48}
          />

          <h3>
            Analyzing your resume...
          </h3>

          <p>
            AI is extracting your experience
          </p>
        </>

      ) : uploaded ? (

        <>
          <CheckCircle2
            className="upload-icon"
            size={48}
          />

          <h3>
            {fileName}
          </h3>

          <p>
            Resume analyzed successfully
          </p>
        </>

      ) : fileName ? (

        <>
          <FileText
            className="upload-icon"
            size={48}
          />

          <h3>
            {fileName}
          </h3>

          <p>
            Ready for analysis
          </p>
        </>

      ) : (

        <>
          <span className="upload-round">
            <CloudUpload size={38} />
          </span>

          <h3>
            Drop your resume here
          </h3>

          <p>
            PDF, DOCX (Max 10MB)
          </p>
        </>

      )}


      {error && (

        <p
          style={{
            color: "#ef4444",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <AlertCircle size={16} />
          {error}
        </p>

      )}


      <button
      type="button"
        disabled={uploading}
        onClick={() =>
          inputRef.current?.click()
        }
      >

        {uploading ? (
          <>
            <Loader2 size={17} />
            Processing...
          </>
        ) : (
          <>
            <Upload size={17} />

            {fileName
              ? "Choose Another File"
              : "Browse Files"}
          </>
        )}

      </button>

    </section>

  );
}