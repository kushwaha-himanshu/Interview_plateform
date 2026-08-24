import { BrainCircuit } from "lucide-react";

export default function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  difficulty,
}) {
  return (
    <div className="question-row">

      <div className="ai-orb">

        <span className="orb-core">
          <BrainCircuit size={39} />
        </span>

        <i className="orb-ring" />

        <div className="voice-wave">
          {Array.from(
            { length: 10 },
            (_, index) => (
              <b
                key={index}
                style={{
                  animationDelay:
                    `${index * 0.1}s`,
                }}
              />
            )
          )}
        </div>

      </div>


      <article className="interview-question">

        <div>

          <span>
            Question {questionNumber} /{" "}
            {totalQuestions}
          </span>

          <em>
            {difficulty || "Technical"}
          </em>

        </div>


        <h2>
          {question}
        </h2>

      </article>

      

    </div>
  );
}