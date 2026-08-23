from interview.evaluator import evaluate_answer
from interview.adaptive_question import  generate_adaptive_question
from interview.final_report import generate_final_report

def run_interview(state, llm, context):

    while state["status"] == "active":

        # 1. Get current question
        current_question = state["current_question"]

        print("\n--- Interview Question ---")
        print(current_question)

        # 2. Get candidate answer
        answer = input("\nYour answer: ")

        # 3. Evaluate the answer
        evaluation = evaluate_answer(
            llm,
            context,
            current_question,
            answer
        )
         # 7. Show evaluation
        print("\n--- Evaluation ---")
        print(evaluation)

        # 4. Store answer
        state["answers"].append(answer)

        # 5. Store evaluation
        state["evaluations"].append(evaluation)

        # 6. Store score
        state["scores"].append(
            evaluation["score"]
        )


        # 7. Determine difficulty
        score = evaluation["score"]

        if score <= 3:
            difficulty = "easy"

        elif score <= 6:
            difficulty = "medium"

        elif score <= 8:
            difficulty = "hard"

        else:
            difficulty = "advanced"


        topic = evaluation.get("topic")

        if topic and topic not in state["covered_topics"]:
         state["covered_topics"].append(topic) 


            
        print("\nScore:", score)
        print("Next difficulty:", difficulty)


        # Check interview length
        if len(state["answers"]) >= 5:
            state["status"] = "completed"
            break

        next_question = generate_adaptive_question(
            llm=llm,
            context=context,
            category=state["category"],
            question=current_question,
            answer=answer,
            evaluation=evaluation,
            difficulty=difficulty,
            covered_topics=state["covered_topics"]
        )

        state["current_question"] = next_question

    generate_final_report(state)    

    return state