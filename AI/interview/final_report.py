def generate_final_report(state):

    scores = state["scores"]
    evaluations = state["evaluations"]

    if not scores:
        print("No scores available.")
        return

    # -----------------------------
    # Overall score
    # -----------------------------

    average_score = sum(scores) / len(scores)

    print("\n")
    print("=" * 50)
    print("              FINAL INTERVIEW REPORT")
    print("=" * 50)

    print(f"\nCategory            : {state['category']}")
    print(f"Questions Attempted : {len(state['answers'])}")
    print(f"Average Score       : {average_score:.2f} / 10")

    # -----------------------------
    # Performance
    # -----------------------------

    if average_score >= 8:
        performance = "Excellent"

    elif average_score >= 6:
        performance = "Good"

    elif average_score >= 4:
        performance = "Needs Improvement"

    else:
        performance = "Weak"

    print(f"Performance         : {performance}")

    # -----------------------------
    # Question-wise scores
    # -----------------------------

    print("\n---------- QUESTION SCORES ----------")

    for i, evaluation in enumerate(evaluations):

        score = evaluation["score"]

        print(
            f"Question {i + 1}: "
            f"{score}/10"
        )

    # -----------------------------
    # Strengths
    # -----------------------------

    strengths = []

    for evaluation in evaluations:

        correct_points = evaluation.get(
            "correct_points", []
        )

        strengths.extend(correct_points)

    print("\n---------- STRENGTHS ----------")

    if strengths:

        for point in strengths[:5]:
            print(f"✓ {point}")

    else:
        print("No major strengths identified.")

    # -----------------------------
    # Weak areas
    # -----------------------------

    weaknesses = []

    for evaluation in evaluations:

        missing_points = evaluation.get(
            "missing_points", []
        )

        weaknesses.extend(missing_points)

    print("\n---------- AREAS TO IMPROVE ----------")

    if weaknesses:

        for point in weaknesses[:5]:
            print(f"• {point}")

    else:
        print("No major weaknesses identified.")

    # -----------------------------
    # Recommendations
    # -----------------------------

    print("\n---------- RECOMMENDATIONS ----------")

    if average_score < 4:

        print("• Revise the fundamental concepts.")
        print("• Practice explaining concepts with examples.")
        print("• Focus on technical terminology.")

    elif average_score < 7:

        print("• Strengthen conceptual understanding.")
        print("• Give more detailed technical explanations.")
        print("• Practice project-based questions.")

    else:

        print("• Continue practicing advanced questions.")
        print("• Focus on deeper system-level concepts.")
        print("• Improve clarity and precision.")

    print("\n" + "=" * 50)
    print("             END OF REPORT")
    print("=" * 50)