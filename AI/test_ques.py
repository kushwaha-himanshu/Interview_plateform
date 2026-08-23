


# # print("\nInterview completed!")

# from langchain_google_genai import ChatGoogleGenerativeAI

# from vectorStore.chroma_store import retriever
# from llm.geminni_client import generate_questions

# from interview.interview_state import create_interview_state
# from interview.interview_manager import run_interview


# # Gemini
# llm = ChatGoogleGenerativeAI(
#     model="gemini-3.5-flash",
#     # temperature=0
# )


# # --------------------------------
# # 1. Select interview category
# # --------------------------------

# category = "technical"


# # --------------------------------
# # 2. Generate initial questions
# # --------------------------------

# questions = generate_questions(
#     category=category,
#     num_questions=5
# )

# print("\n========== INITIAL QUESTIONS ==========")
# print(questions)


# # --------------------------------
# # 3. Convert questions into list
# # --------------------------------

# question_list = [
#     q.strip()
#     for q in questions.split("\n")
#     if q.strip()
# ]


# # --------------------------------
# # 4. Retrieve resume context
# # --------------------------------

# results = retriever.invoke(
#     f"Find resume information relevant to {category} interview."
# )

# context = "\n\n".join(
#     doc.page_content
#     for doc in results
# )


# # --------------------------------
# # 5. Create interview state
# # --------------------------------

# state = create_interview_state(
#     category=category,
#     questions=question_list
# )


# # --------------------------------
# # 6. Start interview
# # --------------------------------

# state = run_interview(
#     state=state,
#     llm=llm,
#     context=context
# )


# print("\nInterview completed!")


from llm.gemini_client import llm

from vectorStore.retrieval import get_resume_context

from llm.question_generator import generate_questions

from interview.session_manager import (
    create_session,
    submit_answer,
    sessions
)


def run_interactive_test():

    print("\n")
    print("=" * 70)
    print("           MINDFLARE INTERACTIVE INTERVIEW TEST")
    print("=" * 70)

    # ==========================================================
    # 1. GET RESUME CONTEXT
    # ==========================================================

    print("\nLoading resume...")

    context = get_resume_context(
        """
        Find all information relevant to a technical
        interview from the candidate's resume.
        """
    )

    if not context:
        print("ERROR: Resume context not found.")
        return

    print("Resume loaded successfully.")


    # ==========================================================
    # 2. GENERATE INITIAL QUESTIONS
    # ==========================================================

    print("\nGenerating initial questions...")

    generated_questions = generate_questions(
        category="technical",
        num_questions=5
    )

    print("\nInitial questions generated successfully.")


    # ==========================================================
    # IMPORTANT
    # ==========================================================
    # If your generate_questions() returns a string containing
    # 5 questions, you can use your own parser here.
    #
    # For testing the interview loop, we can directly provide
    # 5 questions.
    #
    # Replace these with your generated question list later.


    questions = [
        "Explain MongoDB and MySQL.",
        "Explain React.js and how you have used it.",
        "What is Node.js and how is it used?",
        "Explain FAISS and semantic retrieval.",
        "Explain one project mentioned in your resume."
    ]


    # ==========================================================
    # 3. CREATE SESSION
    # ==========================================================

    session_id, state = create_session(
        category="technical",
        questions=questions,
        context=context
    )

    print("\nInterview session created.")

    print("Session ID:", session_id)


    # ==========================================================
    # 4. INTERACTIVE QUESTION LOOP
    # ==========================================================

    while True:

        # ------------------------------------------------------
        # Display current question
        # ------------------------------------------------------

        print("\n")
        print("=" * 70)

        question_number = len(state["answers"]) + 1

        print(f"QUESTION {question_number}")

        print("=" * 70)

        print("\nAI:")
        print(state["current_question"])


        # ------------------------------------------------------
        # Candidate enters answer
        # ------------------------------------------------------

        answer = input("\nYour answer: ")


        # ------------------------------------------------------
        # Allow quit
        # ------------------------------------------------------

        if answer.lower() == "quit":

            print("\nInterview stopped by candidate.")

            break


        # ------------------------------------------------------
        # Send answer to AI
        # ------------------------------------------------------

        print("\nEvaluating your answer...")

        result = submit_answer(
            session_id=session_id,
            answer=answer,
            llm=llm
        )


        # ======================================================
        # 5. DISPLAY EVALUATION
        # ======================================================

        print("\n")
        print("-" * 70)

        print("AI EVALUATION")

        print("-" * 70)

        print(
            "\nScore:",
            result["score"],
            "/ 10"
        )

        print(
            "\nTopic:",
            result["evaluation"].get("topic")
        )

        print(
            "\nTechnical Accuracy:"
        )

        print(
            result["evaluation"].get(
                "technical_accuracy"
            )
        )

        print(
            "\nCorrect Points:"
        )

        for point in result["evaluation"].get(
            "correct_points",
            []
        ):

            print("✓", point)


        print(
            "\nMissing Points:"
        )

        for point in result["evaluation"].get(
            "missing_points",
            []
        ):

            print("•", point)


        print(
            "\nImprovement:"
        )

        print(
            result["evaluation"].get(
                "improvement_suggestions"
            )
        )


        # ======================================================
        # 6. CHECK COMPLETION
        # ======================================================

        if result["completed"]:

            print("\n")
            print("=" * 70)

            print("          INTERVIEW COMPLETED")

            print("=" * 70)

            break


        # ======================================================
        # 7. DISPLAY NEXT QUESTION
        # ======================================================

        print("\n")
        print("=" * 70)

        print("NEXT ADAPTIVE QUESTION")

        print("=" * 70)

        print(
            result["question"]
        )

        # Update state

        state["current_question"] = result["question"]


    # ==========================================================
    # 8. FINAL REPORT
    # ==========================================================

    final_state = sessions[session_id]

    print("\n")
    print("=" * 70)

    print("                 FINAL REPORT")

    print("=" * 70)


    scores = final_state["scores"]

    print(
        "\nCategory:",
        final_state["category"]
    )

    print(
        "Questions Attempted:",
        len(final_state["answers"])
    )


    if scores:

        average_score = (
            sum(scores) / len(scores)
        )

        print(
            "Average Score:",
            round(average_score, 2),
            "/ 10"
        )


    print("\nQuestion-wise Scores:")

    for i, score in enumerate(scores):

        print(
            f"Question {i + 1}: "
            f"{score}/10"
        )


    print("\nCovered Topics:")

    for topic in final_state["covered_topics"]:

        print("-", topic)


    print(
        "\nStatus:",
        final_state["status"]
    )


    print("\n")
    print("=" * 70)

    print("             TEST FINISHED")

    print("=" * 70)


if __name__ == "__main__":

    run_interactive_test()