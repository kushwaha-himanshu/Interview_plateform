import { BrainCircuit } from "lucide-react";

export default function QuestionCard() {
  return (
    <div className="question-row">
      <div className="ai-orb">
        <span className="orb-core">
          <BrainCircuit size={39} />
        </span>
        <i className="orb-ring" />
        <div className="voice-wave">
          {Array.from({ length: 10 }, (_, index) => (
            <b key={index} style={{ animationDelay: `${index * 0.1}s` }} />
          ))}
        </div>
      </div>
      <article className="interview-question">
        <div>
          <span>Question 3 / 10</span>
          <em>Technical</em>
        </div>
        <h2>
          Can you explain how React and Node.js worked together in one of the
          projects mentioned in your resume?
        </h2>
      </article>
    </div>
  );
}
