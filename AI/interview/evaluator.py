# import json
# from llm.prompts import ANSWER_EVALUATION_PROMPT

# def evaluate_answer(llm,context,question,answer):

#      prompt = ANSWER_EVALUATION_PROMPT.format(
#         context=context,
#         question=question,
#         answer=answer
#     )

#      response=llm.invoke(prompt)
#      content = response.content 

#      if isinstance(content, list):
#        content = content[0]["text"]

#      return json.loads(content)


import json

from llm.prompts import ANSWER_EVALUATION_PROMPT


def evaluate_answer(
    llm,
    context,
    question,
    answer
):

    prompt = ANSWER_EVALUATION_PROMPT.format(
        context=context,
        question=question,
        answer=answer
    )

    response = llm.invoke(prompt)

    # Extract Gemini response
    if isinstance(response.content, list):

        content = "".join(
            item.get("text", "")
            for item in response.content
            if isinstance(item, dict)
        )

    else:

        content = response.content

    print("\n========== RAW EVALUATION ==========")
    print(repr(content))
    print("====================================")

    # Remove markdown JSON fences if Gemini adds them
    content = content.strip()

    if content.startswith("```json"):
        content = content[7:]

    elif content.startswith("```"):
        content = content[3:]

    if content.endswith("```"):
        content = content[:-3]

    content = content.strip()

    try:

        evaluation = json.loads(content)

        return evaluation

    except json.JSONDecodeError:

        print("\nERROR: Gemini did not return valid JSON.")
        print("Raw response:")
        print(content)

        # Safe fallback
        return {
            "score": 0,
            "topic": "unknown",
            "technical_accuracy": "Unable to evaluate.",
            "correct_points": [],
            "missing_points": [],
            "improvement_suggestions": "Please try answering again.",
            "answer_quality": "invalid"
        }

