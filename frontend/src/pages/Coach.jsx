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
import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import DashboardLayout from "../components/DashboardLayout";
import NotificationsBell from "../components/NotificationsBell";
import api from "../services/api";
import "./Coach.css";
import React from "react";
import { useSubscription } from "../context/SubscriptionContext";

class SafeMarkdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ReactMarkdown rendering crashed, falling back to custom parser:", error, errorInfo);
  }

  parseMarkdownText(textStr) {
    if (!textStr) return null;
    const blocks = textStr.split("\n");
    return blocks.map((block, idx) => {
      let clean = block.trim();
      if (!clean) return <div key={idx} style={{ height: "6px" }} />;
      
      if (clean.startsWith("###")) {
        return <h4 key={idx} style={{ color: "#d2bbff", margin: "10px 0 4px", fontSize: "14px" }}>{clean.substring(3).trim()}</h4>;
      }
      if (clean.startsWith("##")) {
        return <h3 key={idx} style={{ color: "#d2bbff", margin: "14px 0 6px", fontSize: "15px" }}>{clean.substring(2).trim()}</h3>;
      }
      
      const isBullet = clean.startsWith("-") || clean.startsWith("•") || clean.startsWith("*");
      
      const parts = clean.split(/\*\*([^*]+)\*\*/g);
      const content = parts.map((part, i) => {
        if (i % 2 === 1) {
          return <strong key={i} style={{ color: "#fff", fontWeight: "700" }}>{part}</strong>;
        }
        return part;
      });

      if (isBullet) {
        const sliceIdx = clean.search(/[a-zA-Z0-9]/);
        const bulletText = clean.substring(sliceIdx === -1 ? 1 : sliceIdx);
        const partsBullet = bulletText.split(/\*\*([^*]+)\*\*/g);
        const contentBullet = partsBullet.map((part, i) => {
          if (i % 2 === 1) {
            return <strong key={i} style={{ color: "#fff", fontWeight: "700" }}>{part}</strong>;
          }
          return part;
        });
        return (
          <li key={idx} style={{ marginLeft: "16px", listStyleType: "disc", color: "#ccc3d8", marginBottom: "4px", fontSize: "13px", lineHeight: "1.5" }}>
            {contentBullet}
          </li>
        );
      }

      return (
        <p key={idx} style={{ margin: "4px 0", color: "#ccc3d8", fontSize: "13px", lineHeight: "1.5" }}>
          {content}
        </p>
      );
    });
  }

  render() {
    if (this.state.hasError) {
      return <div className="markdown-body">{this.parseMarkdownText(this.props.text)}</div>;
    }

    return (
      <ReactMarkdown className="markdown-body">
        {this.props.text}
      </ReactMarkdown>
    );
  }
}

const suggestedTopics = ["Salary Negotiation", "Imposter Syndrome", "Cold Emailing"];

const quickActionsList = [
  { icon: "📊", label: "Analyze My Performance", desc: "Find your strongest and weakest areas", prompt: "Analyze my interview performance and tell me where I stand." },
  { icon: "🗺", label: "Create Study Plan", desc: "Design a day-by-day plan for weak topics", prompt: "Create a personalized day-by-day study roadmap for my weak areas." },
  { icon: "🎯", label: "What Should I Improve?", desc: "Personalized feedback based on mocks", prompt: "Based on my resume and recent mock interviews, what should I improve next?" },
  { icon: "💻", label: "Practice DSA", desc: "Practice interactive DSA questions", prompt: "Let's do some interactive DSA practice coding questions." },
  { icon: "🧠", label: "Quiz Me", desc: "Interactive technical mock interview", prompt: "Let's start an interactive mock interview quiz. Ask me a question about one of my weak topics." },
  { icon: "📄", label: "Improve My Resume", desc: "Find errors and suggest improvements", prompt: "Analyze my resume details and tell me how I can improve it." }
];

export default function Coach() {
  const { isPro, loading: subLoading, plan, status } = useSubscription();
  const [messages, setMessages] = useState([
    {
      type: "ai",
      text: "Hi! I'm your AI Coach 👋\n\nI can help you with interview preparation, roadmaps, DSA, technical concepts, resume improvement and career guidance."
    }
  ]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState("");
  const [profileContext, setProfileContext] = useState(null);
  const [showProgressModal, setShowProgressModal] = useState(false);

  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll chat window to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Fetch real MongoDB compiled context for the sidebar
  useEffect(() => {
    const fetchContext = async () => {
      try {
        const response = await api.get("/coach/context");
        if (response.data?.success) {
          setProfileContext(response.data.context);
        }
      } catch (err) {
        console.error("Failed to load coach context:", err);
      }
    };
    if (isPro) {
      fetchContext();
    }
  }, [isPro]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert("Failed to load Razorpay SDK. Please check your internet connection.");
        setLoading(false);
        return;
      }

      // Create payment order
      const amountValue = Number(import.meta.env.VITE_PRO_PLAN_AMOUNT || 499);
      const orderRes = await api.post("/payment/create-order", {
        amount: amountValue,
        currency: "INR"
      });

      const orderData = orderRes.data;

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "MindFlare AI",
        description: "Pro Monthly Subscription Plan",
        order_id: orderData.id,
        handler: async function (response) {
          try {
            setLoading(true);
            const verifyRes = await api.post("/payment/verify-payment", {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              amount: amountValue,
              currency: orderData.currency || "INR"
            });

            if (verifyRes.data?.success) {
              window.dispatchEvent(new Event("mindflare-pro-change"));
            } else {
              alert("Payment verification failed.");
            }
          } catch (verifyErr) {
            console.error("Verification failed:", verifyErr);
            alert("An error occurred during verification. Please try again.");
          } finally {
            setLoading(false);
          }
        },
        theme: {
          color: "#7c3aed"
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment order creation failed:", err);
      alert("Failed to initiate upgrade order. Please try again later.");
      setLoading(false);
    }
  };

  const sendMessage = async (customContent = null) => {
    const content = (customContent || draft).trim();
    if (!content) return;

    setError("");
    setMessages((prev) => [...prev, { type: "user", text: content }]);
    setDraft("");
    setLoading(true);

    try {
      const conversationHistory = messages.map((m) => ({
        role: m.type === "user" ? "user" : "assistant",
        content: m.text,
      }));

      const response = await api.post("/coach/chat", {
        message: content,
        conversation: conversationHistory,
      });

      if (response.data?.success) {
        setMessages((prev) => [
          ...prev,
          { type: "ai", text: response.data.response },
        ]);
        
        // Refresh sidebar context to capture new performance states
        const contextResponse = await api.get("/coach/context");
        if (contextResponse.data?.success) {
          setProfileContext(contextResponse.data.context);
        }
      }
    } catch (err) {
      console.error("Coach API communication failed:", err);
      setError("Something went wrong while reaching your AI Coach.");
      setMessages((prev) => [
        ...prev,
        {
          type: "ai",
          text: "Something went wrong while reaching your AI Coach.",
          isError: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (promptText) => {
    sendMessage(promptText);
  };

  const useTopic = (topic) => {
    sendMessage(`Can we practice on ${topic.toLowerCase()}?`);
  };

  const startVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsRecording(true);
      setTimeout(() => {
        const fallbackText = "Can we practice answering behavioral questions using the STAR framework?";
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

  const getFollowUpActions = (messageText) => {
    const clean = messageText.toLowerCase();
    const chips = [];
    if (clean.includes("roadmap") || clean.includes("study plan") || clean.includes("weak")) {
      chips.push({ label: "Create 3-day plan", prompt: "Create a 3-day study plan for my weak areas." });
    }
    if (clean.includes("dbms") || clean.includes("sql") || clean.includes("database")) {
      chips.push({ label: "Practice DBMS", prompt: "Give me 5 DBMS interview practice questions." });
    }
    if (clean.includes("dsa") || clean.includes("algorithm") || clean.includes("code")) {
      chips.push({ label: "Practice DSA", prompt: "Start an interactive DSA practice quiz." });
    }
    if (clean.includes("resume") || clean.includes("project") || clean.includes("experience")) {
      chips.push({ label: "Explain resume improvements", prompt: "Explain in detail how to improve my projects and resume experience." });
    }
    
    if (chips.length === 0) {
      chips.push(
        { label: "Explain More", prompt: "Can you explain that in more detail?" },
        { label: "Start Quiz", prompt: "Let's start a quick mock quiz on this topic." },
        { label: "Create Study Plan", prompt: "Can you create a structured roadmap for this?" }
      );
    }
    return chips.slice(0, 3);
  };

  const performance = profileContext?.performance || {};
  const hasHistory = performance.overallScore > 0 || performance.recentScores?.length > 0;
  const isInitialState = messages.length === 1 && !loading;

  const renderProfileSidebarContent = () => {
    if (!hasHistory) {
      return (
        <div style={{ padding: "16px", textAlign: "center", color: "#958da1", fontSize: "13px" }}>
          Your personalized insights will appear here after you complete a few interviews.
        </div>
      );
    }

    const overallPct = Math.round(performance.overallScore * 10);
    const scoresTrendStr = performance.recentScores?.length > 0
      ? performance.recentScores.map(s => Math.round(s * 10)).join(" → ")
      : "N/A";

    const nextStep = performance.weakAreas?.length > 0 
      ? `Practice ${performance.weakAreas[0]} concepts` 
      : "Complete another mock interview";

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div className="profile-card">
          <span>Overall Performance</span>
          <strong>{overallPct}%</strong>
        </div>

        <div className="profile-card">
          <span>Strong Areas</span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "8px" }}>
            {performance.strongAreas?.length > 0 ? (
              performance.strongAreas.map(area => (
                <span key={area} className="tag strong">{area}</span>
              ))
            ) : (
              <span style={{ fontSize: "12px", opacity: 0.6 }}>None identified yet</span>
            )}
          </div>
        </div>

        <div className="profile-card">
          <span>Focus Areas</span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "8px" }}>
            {performance.weakAreas?.length > 0 ? (
              performance.weakAreas.map(area => (
                <span key={area} className="tag focus">{area}</span>
              ))
            ) : (
              <span style={{ fontSize: "12px", opacity: 0.6 }}>None identified yet</span>
            )}
          </div>
        </div>

        <div className="profile-card">
          <span>Recent Trend</span>
          <strong style={{ fontSize: "15px", fontFamily: "monospace", display: "block", marginTop: "4px" }}>
            {scoresTrendStr}
          </strong>
        </div>

        <div className="profile-card">
          <span>Recommended Next Step</span>
          <p style={{ margin: "4px 0 0", color: "#4cd7f6", fontSize: "12px", fontWeight: "600", lineHeight: "1.4" }}>
            "{nextStep}"
          </p>
        </div>
      </div>
    );
  };

  if (subLoading) {
    return (
      <DashboardLayout className="coach-page">
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "calc(100vh - 64px)", color: "#ccc3d8" }}>
          <div className="listening-visualizer" style={{ marginRight: "8px" }}>
            <span />
            <span />
            <span />
          </div>
          <span>Loading subscription status...</span>
        </div>
      </DashboardLayout>
    );
  }

  if (!isPro) {
    const isExpired = plan === "pro" && status === "expired";
    return (
      <DashboardLayout className="coach-page">
        <header className="coach-topbar" style={{ borderBottom: "1px solid rgba(74, 68, 85, 0.2)" }}>
          <div className="coach-brand-mobile">
            <Menu size={18} />
            <span>MindFlare</span>
          </div>
          <div className="coach-top-actions">
            <NotificationsBell size={18} />
            <button type="button" aria-label="Help">
              <HelpCircle size={18} />
            </button>
          </div>
        </header>

        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "calc(100vh - 120px)",
          padding: "40px 20px",
          textAlign: "center",
          maxWidth: "600px",
          margin: "0 auto"
        }}>
          <div style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            background: "rgba(124, 58, 237, 0.1)",
            border: "1px solid rgba(124, 58, 237, 0.2)",
            display: "grid",
            placeItems: "center",
            color: "#d2bbff",
            fontSize: "24px",
            marginBottom: "24px",
            boxShadow: "0 0 20px rgba(124, 58, 237, 0.15)"
          }}>
            🔒
          </div>

          <h2 style={{ color: "#fff", fontSize: "28px", fontWeight: "700", margin: "0 0 12px" }}>
            {isExpired ? "Your Pro subscription has expired" : "AI Coach is a Pro Feature"}
          </h2>
          
          <p style={{ color: "#ccc3d8", fontSize: "15px", lineHeight: "1.6", margin: "0 0 32px", maxWidth: "480px" }}>
            Unlock personalized 1-on-1 coaching based on your resume, completed mock interviews, weak areas, and dynamic performance trends.
          </p>

          <div style={{
            background: "rgba(28, 43, 60, 0.3)",
            border: "1px solid rgba(255, 255, 255, 0.05)",
            borderRadius: "12px",
            padding: "24px",
            width: "100%",
            textAlign: "left",
            marginBottom: "32px"
          }}>
            <h3 style={{ color: "#fff", fontSize: "14px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 16px" }}>
              Features Included in Pro:
            </h3>
            <ul style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px", listStyle: "none", padding: 0, margin: 0 }}>
              <li style={{ color: "#ccc3d8", fontSize: "13px", display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ color: "#10b981" }}>✓</span> Personalized Interview Guidance
              </li>
              <li style={{ color: "#ccc3d8", fontSize: "13px", display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ color: "#10b981" }}>✓</span> Performance & Weakness Analysis
              </li>
              <li style={{ color: "#ccc3d8", fontSize: "13px", display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ color: "#10b981" }}>✓</span> Personalized Study Roadmaps
              </li>
              <li style={{ color: "#ccc3d8", fontSize: "13px", display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ color: "#10b981" }}>✓</span> Interactive DSA/DBMS Mock Drills
              </li>
              <li style={{ color: "#ccc3d8", fontSize: "13px", display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ color: "#10b981" }}>✓</span> Resume Enhancement Advice
              </li>
              <li style={{ color: "#ccc3d8", fontSize: "13px", display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ color: "#10b981" }}>✓</span> Unlimited AI Coaching Chats
              </li>
            </ul>
          </div>

          <button
            type="button"
            onClick={handleUpgrade}
            disabled={loading}
            style={{
              background: "#7c3aed",
              border: "none",
              borderRadius: "8px",
              padding: "14px 28px",
              color: "#fff",
              fontSize: "15px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "background 0.2s",
              boxShadow: "0 4px 15px rgba(124, 58, 237, 0.3)"
            }}
          >
            {loading ? "Processing Order..." : isExpired ? "Renew Pro Plan" : "Upgrade to Pro"}
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout className="coach-page">
      <header className="coach-topbar">
        <div className="coach-brand-mobile">
          <Menu size={18} />
          <span>MindFlare</span>
        </div>
        <div className="coach-top-actions">
          {/* Mobile progress button, shown below 1280px via CSS */}
          <button 
            type="button" 
            onClick={() => setShowProgressModal(true)} 
            className="mobile-progress-btn"
            style={{
              display: "none",
              background: "rgba(124, 58, 237, 0.15)",
              border: "1px solid rgba(124, 58, 237, 0.3)",
              borderRadius: "20px",
              padding: "6px 14px",
              color: "#d2bbff",
              fontSize: "12px",
              fontWeight: "600",
              cursor: "pointer",
              marginRight: "8px"
            }}
          >
            📊 Your Progress
          </button>
          
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
          <div className="coach-status" style={{ justifyContent: "space-between", width: "100%", maxWidth: "800px", margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span className="status-orb" />
              <span>Nexus AI Connected</span>
            </div>
            
            <div style={{ display: "flex", alignItems: "center", gap: "4px", background: "rgba(124, 58, 237, 0.15)", border: "1px solid rgba(124, 58, 237, 0.3)", borderRadius: "12px", padding: "4px 8px", fontSize: "11px", color: "#d2bbff", fontWeight: "600" }}>
              <Sparkles size={12} />
              <span>PRO ✦</span>
            </div>
          </div>

          <div className="coach-messages">
            {isInitialState ? (
              <div className="coach-welcome-container" style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                padding: "32px 16px",
                maxWidth: "760px",
                margin: "auto"
              }}>
                <div className="coach-avatar-large" style={{
                  display: "grid",
                  placeItems: "center",
                  width: "72px",
                  height: "72px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)",
                  boxShadow: "0 0 25px rgba(124, 58, 237, 0.3)",
                  color: "#fff",
                  marginBottom: "16px"
                }}>
                  <BrainCircuit size={36} />
                </div>
                <h2 style={{ color: "#fff", fontSize: "24px", margin: "0 0 8px" }}>Hi, I'm your AI Coach 👋</h2>
                <p style={{ color: "#ccc3d8", fontSize: "14px", margin: "0 0 24px", maxWidth: "500px", lineHeight: "1.6" }}>
                  I analyze your resume and mock interview history to personalize your study roadmaps, revision targets, and interactive practice drills.
                </p>
                
                <h3 style={{ color: "#958da1", fontSize: "12px", margin: "0 0 12px", letterSpacing: "0.05em", textTransform: "uppercase", alignSelf: "flex-start", fontWeight: "600" }}>
                  Select an Action to Begin
                </h3>
                
                <div className="quick-actions-grid" style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "12px",
                  width: "100%",
                  marginBottom: "24px"
                }}>
                  {quickActionsList.map((action) => (
                    <button
                      type="button"
                      key={action.label}
                      onClick={() => handleQuickAction(action.prompt)}
                      className="quick-action-card"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        textAlign: "left",
                        padding: "16px",
                        background: "rgba(28, 43, 60, 0.45)",
                        border: "1px solid rgba(255, 255, 255, 0.05)",
                        borderRadius: "12px",
                        cursor: "pointer",
                        transition: "all 0.2s ease"
                      }}
                    >
                      <span style={{ fontSize: "20px", marginBottom: "8px", display: "block" }}>{action.icon}</span>
                      <b style={{ color: "#fff", fontSize: "14px", display: "block", marginBottom: "4px" }}>{action.label}</b>
                      <span style={{ color: "#ccc3d8", fontSize: "12px", lineHeight: "1.4" }}>{action.desc}</span>
                    </button>
                  ))}
                </div>
                
                <p style={{ color: "#958da1", fontSize: "11px", margin: 0 }}>
                  💡 Your coach uses your resume and mock interview performance to personalize recommendations.
                </p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "800px", margin: "0 auto", width: "100%" }}>
                {messages.map((message, index) => {
                  const isUser = message.type === "user";
                  return (
                    <article
                      key={index}
                      className={`coach-message ${isUser ? "user" : "ai"}`}
                      style={{
                        display: "flex",
                        justifyContent: isUser ? "flex-end" : "flex-start",
                        width: "100%"
                      }}
                    >
                      {!isUser && (
                        <div className="coach-avatar" style={{
                          display: "grid",
                          placeItems: "center",
                          width: "36px",
                          height: "36px",
                          borderRadius: "50%",
                          background: "linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)",
                          color: "#fff",
                          marginRight: "12px",
                          flexShrink: 0
                        }}>
                          <BrainCircuit size={18} />
                        </div>
                      )}
                      
                      <div 
                        className={`bubble ${isUser ? "user-bubble" : "ai-bubble"}`} 
                        style={{
                          maxWidth: "75%",
                          padding: "16px 20px",
                          borderRadius: "16px",
                          background: isUser ? "#7c3aed" : "rgba(28, 43, 60, 0.45)",
                          border: isUser ? "none" : "1px solid rgba(255, 255, 255, 0.05)",
                          color: "#fff",
                          boxShadow: isUser ? "0 4px 12px rgba(124, 58, 237, 0.2)" : "none"
                        }}
                      >
                        {isUser ? (
                          <p style={{ margin: 0, color: "#fff", fontSize: "14px", lineHeight: "1.5" }}>{message.text}</p>
                        ) : (
                          <SafeMarkdown text={message.text} />
                        )}
                      </div>
                    </article>
                  );
                })}
                
                {/* Render Suggested Action Chips under the latest message block */}
                {!loading && messages.length > 1 && messages[messages.length - 1].type === "ai" && (
                  <div style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "8px",
                    paddingLeft: "48px",
                    marginTop: "4px"
                  }}>
                    {getFollowUpActions(messages[messages.length - 1].text).map((chip) => (
                      <button
                        type="button"
                        key={chip.label}
                        onClick={() => sendMessage(chip.prompt)}
                        style={{
                          background: "rgba(124, 58, 237, 0.06)",
                          border: "1px solid rgba(124, 58, 237, 0.2)",
                          borderRadius: "16px",
                          padding: "6px 14px",
                          color: "#d2bbff",
                          fontSize: "12px",
                          cursor: "pointer",
                          transition: "all 0.2s"
                        }}
                      >
                        {chip.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {loading && (
              <div style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "800px", margin: "0 auto", width: "100%" }}>
                <article className="coach-message ai">
                  <div className="coach-avatar" style={{
                    display: "grid",
                    placeItems: "center",
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)",
                    color: "#fff",
                    marginRight: "12px",
                    flexShrink: 0
                  }}>
                    <BrainCircuit size={18} />
                  </div>
                  <div className="bubble ai-bubble" style={{ opacity: 0.8, display: "flex", alignItems: "center", gap: "8px", background: "rgba(28, 43, 60, 0.45)" }}>
                    <div className="listening-visualizer" style={{ display: "inline-flex", margin: 0 }}>
                      <span />
                      <span />
                      <span />
                    </div>
                    <span style={{ fontSize: "12px", color: "#ccc3d8" }}>AI Coach is thinking...</span>
                  </div>
                </article>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="coach-input-wrap" style={{ width: "100%", maxWidth: "800px", margin: "0 auto" }}>
            {error && (
              <div style={{ color: "#ef4444", marginBottom: "8px", fontSize: "12px", padding: "4px 12px" }}>
                {error}
              </div>
            )}
            <div className="coach-input">
              <button
                type="button"
                aria-label="Attach file disabled"
                style={{ opacity: 0.3, cursor: "not-allowed" }}
                disabled
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
                  disabled={loading}
                  style={{
                    flex: 1,
                    border: 0,
                    outline: "none",
                    color: "#d4e4fa",
                    background: "transparent",
                    padding: "12px 16px"
                  }}
                />
              )}
              
              <button
                type="button"
                className="send-btn"
                aria-label="Send"
                onClick={() => sendMessage()}
                disabled={isRecording || loading || !draft.trim()}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </section>

        <aside className="coach-right-panel">
          <h3>Your Profile</h3>
          {renderProfileSidebarContent()}

          <hr style={{ border: "none", borderTop: "1px solid rgba(255, 255, 255, 0.05)", margin: "10px 0" }} />

          <section>
            <h3 style={{ fontSize: "14px" }}>Suggested Topics</h3>
            <div className="topic-list">
              {suggestedTopics.map((topic) => (
                <button type="button" key={topic} onClick={() => useTopic(topic)}>
                  <span>{topic}</span>
                  <ArrowRight size={14} />
                </button>
              ))}
            </div>
          </section>

          <section>
            <h3 style={{ fontSize: "14px" }}>Quick Tip</h3>
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

      {/* =========================
          MOBILE PROGRESS DRAWER MODAL
      ========================= */}
      {showProgressModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0, 0, 0, 0.8)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000
        }}>
          <div style={{
            background: "#0d0d18",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "12px",
            padding: "24px",
            maxWidth: "400px",
            width: "90%",
            textAlign: "left",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
            position: "relative"
          }}>
            <button
              type="button"
              onClick={() => setShowProgressModal(false)}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                background: "none",
                border: "none",
                color: "#ccc3d8",
                cursor: "pointer"
              }}
            >
              <X size={18} />
            </button>
            <h3 style={{ color: "#fff", margin: "0 0 16px", fontSize: "18px" }}>Your Profile Progress</h3>
            {renderProfileSidebarContent()}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}