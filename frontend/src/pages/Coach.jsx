import {
  ArrowRight,
  BrainCircuit,
  HelpCircle,
  Lightbulb,
  Menu,
  Mic,
  Paperclip,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import { useState, useRef } from "react";
import DashboardLayout from "../components/DashboardLayout";
import NotificationsBell from "../components/NotificationsBell";
import { seedMessages, topics } from "../data/coachData";
import "./Coach.css";

export default function Coach() {
  const [messages, setMessages] = useState(seedMessages);
  const [draft, setDraft] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [isRecording, setIsRecording] = useState(false);

  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);

  const sendMessage = () => {
    const content = draft.trim();
    if (!content && attachments.length === 0) {
      return;
    }

    setMessages((prev) => [
      ...prev,
      {
        type: "user",
        text: content ? [content] : ["Sent attachments"],
        attachments: [...attachments],
      },
      {
        type: "ai",
        text: [
          "Great direction. Try answering in Situation, Action, and measurable Result format, then close with the lesson learned.",
        ],
      },
    ]);
    setDraft("");
    setAttachments([]);
  };

  const useTopic = (topic) => {
    setDraft(`Can we practice on ${topic.toLowerCase()}?`);
  };

  const applyFramework = (choice) => {
    setDraft(`Let's use ${choice}.`);
  };

  const handleAttachClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      const newAttachments = files.map((file) => ({
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
      }));
      setAttachments((prev) => [...prev, ...newAttachments]);
    }
  };

  const removeAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const startVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      // Graceful fallback for browsers without speech recognition support
      setIsRecording(true);
      setTimeout(() => {
        const fallbackText =
          "Can we practice answering behavioral questions using the STAR framework?";
        setDraft((prev) => (prev ? prev + " " + fallbackText : fallbackText));
        setIsRecording(false);
      }, 2000);
      return;
    }

    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
      return;
    }

    try {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = "en-US";

      rec.onstart = () => {
        setIsRecording(true);
      };

      rec.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setDraft((prev) => (prev ? prev + " " + transcript : transcript));
      };

      rec.onerror = (event) => {
        console.error("Speech Recognition Error:", event.error);
        setIsRecording(false);
      };

      rec.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = rec;
      rec.start();
    } catch (error) {
      console.error("Speech recognition failed to initialize", error);
      setIsRecording(false);
    }
  };

  return (
    <DashboardLayout className="coach-page">
      <header className="coach-topbar">
        <div className="coach-brand-mobile">
          <Menu size={18} />
          <span>MindFlare</span>
        </div>
        <div className="coach-top-actions">
          <NotificationsBell size={18} />
          <button type="button" aria-label="Help">
            <HelpCircle size={18} />
          </button>
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDGl3MZGctbO3ljp0LjUO_dRjWC3rl2ufvD8Q8EyS--4obHQI7PDY-VA_HcAl-9Yot80Zfr9A-mSeAvk0qqdMEB3mtjGnCcu4DjjkOsdTtlxF3DlutMVJL9Ey34ADci3SiYHkHsnJjILr1-piA3LFJmvXZ6WeUwTZKsqByUWjjmGEdmkTl1PgqK-q2_zKA3lG29CXIifApgGTPeGMa_MnIA_gWkUyjM5SVMzjHfVIjtJQHdAX8CNIRs0g"
            alt="Current user avatar"
          />
        </div>
      </header>

      <div className="coach-layout">
        <section className="coach-chat">
          <div className="coach-status">
            <span className="status-orb" />
            <span>Nexus AI Connected</span>
          </div>

          <div className="coach-messages">
            {messages.map((message, index) => (
              <article
                className={`coach-message ${message.type === "user" ? "user" : "ai"}`}
                key={`${message.type}-${index}`}
              >
                {message.type === "ai" ? (
                  <>
                    <div className="coach-avatar">
                      <BrainCircuit size={18} />
                    </div>
                    <div className="bubble ai-bubble">
                      {message.text.map((line) => (
                        <p key={line}>{line}</p>
                      ))}
                      {message.choices ? (
                        <div className="choice-row">
                          {message.choices.map((choice) => (
                            <button
                              type="button"
                              key={choice}
                              onClick={() => applyFramework(choice)}
                            >
                              {choice}
                            </button>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </>
                ) : (
                  <div className="bubble user-bubble">
                    {message.text.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                    {message.attachments && message.attachments.length > 0 && (
                      <div className="chat-bubble-attachments">
                        {message.attachments.map((file, i) => (
                          <div key={i} className="bubble-attachment-item">
                            <Paperclip size={12} />
                            <span>{file.name} ({file.size})</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </article>
            ))}
          </div>

          <div className="coach-input-wrap">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              style={{ display: "none" }}
            />

            {attachments.length > 0 && (
              <div className="coach-attachment-preview-bar">
                {attachments.map((file, i) => (
                  <span key={i} className="attachment-pill">
                    <Paperclip size={12} />
                    <span>
                      {file.name} ({file.size})
                    </span>
                    <button
                      type="button"
                      onClick={() => removeAttachment(i)}
                      aria-label="Remove attachment"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            <div className="coach-input">
              <button
                type="button"
                aria-label="Attach file"
                onClick={handleAttachClick}
              >
                <Paperclip size={18} />
              </button>
              <button
                type="button"
                aria-label="Voice input"
                className={isRecording ? "recording" : ""}
                onClick={startVoiceInput}
              >
                <Mic size={18} />
              </button>
              {isRecording ? (
                <div className="listening-visualizer">
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
              ) : (
                <input
                  type="text"
                  placeholder="Type your response or ask for guidance..."
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      sendMessage();
                    }
                  }}
                />
              )}
              <button
                type="button"
                className="send-btn"
                aria-label="Send"
                onClick={sendMessage}
                disabled={isRecording}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </section>

        <aside className="coach-right-panel">
          <section>
            <h3>Suggested Topics</h3>
            <div className="topic-list">
              {topics.map((topic) => (
                <button type="button" key={topic} onClick={() => useTopic(topic)}>
                  <span>{topic}</span>
                  <ArrowRight size={14} />
                </button>
              ))}
            </div>
          </section>

          <section>
            <h3>Quick Tip</h3>
            <article className="tip-card">
              <div className="tip-head">
                <Lightbulb size={16} />
                <span>Eye Contact</span>
              </div>
              <p>
                When answering via video, look at the camera lens, not the
                screen, to simulate direct eye contact with the interviewer.
              </p>
            </article>
          </section>

          <div className="coach-token">
            <div className="ring" />
            <Sparkles size={36} />
          </div>
        </aside>
      </div>
    </DashboardLayout>
  );
}