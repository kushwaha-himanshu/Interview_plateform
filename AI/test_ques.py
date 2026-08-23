# # from llm.geminni_client import generate_questions


# # category = "technical"

# # questions = generate_questions(category)

# # print("\n--- Interview Questions ---")
# # print(questions)


# from langchain_google_genai import ChatGoogleGenerativeAI

# from vectorStore.chroma_store import retriever
# from llm.geminni_client import generate_questions
# from interview.interview_state import create_interview_state
# from interview.interview_manager import run_interview

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

from langchain_google_genai import ChatGoogleGenerativeAI

from vectorStore.chroma_store import retriever
from llm.geminni_client import generate_questions

from interview.interview_state import create_interview_state
from interview.interview_manager import run_interview


# Gemini
llm = ChatGoogleGenerativeAI(
    model="gemini-3.5-flash",
    # temperature=0
)


# --------------------------------
# 1. Select interview category
# --------------------------------

category = "technical"


# --------------------------------
# 2. Generate initial questions
# --------------------------------

questions = generate_questions(
    category=category,
    num_questions=5
)

print("\n========== INITIAL QUESTIONS ==========")
print(questions)


# --------------------------------
# 3. Convert questions into list
# --------------------------------

question_list = [
    q.strip()
    for q in questions.split("\n")
    if q.strip()
]


# --------------------------------
# 4. Retrieve resume context
# --------------------------------

results = retriever.invoke(
    f"Find resume information relevant to {category} interview."
)

context = "\n\n".join(
    doc.page_content
    for doc in results
)


# --------------------------------
# 5. Create interview state
# --------------------------------

state = create_interview_state(
    category=category,
    questions=question_list
)


# --------------------------------
# 6. Start interview
# --------------------------------

state = run_interview(
    state=state,
    llm=llm,
    context=context
)


print("\nInterview completed!")