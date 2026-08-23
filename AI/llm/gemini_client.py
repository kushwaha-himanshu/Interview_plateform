# from langchain_google_genai import ChatGoogleGenerativeAI

# from vectorStore.chroma_store import retriever
# from llm.prompts import QUESTION_GENERATION_PROMPT


# llm = ChatGoogleGenerativeAI(
#     model="gemini-3.5-flash",
#     # temperature=0
# )


# def generate_questions(category,num_questions=5):

#     # Retrieve relevant resume information
#     query = f"""
#     Find resume information relevant to a {category} interview.

#     Focus ONLY on information explicitly present in the resume.
#     Do not invent any skills, projects, technologies, companies,
#     certifications, or experience.
#     """

#     results = retriever.invoke(query)

#     context = "\n\n".join(
#         doc.page_content
#         for doc in results
#     )
#     prompt = QUESTION_GENERATION_PROMPT.format(
#         context=context,
#         category=category,
#         num_questions=num_questions
#     )

#     response = llm.invoke(prompt)

#     if isinstance(response.content, list):
#         return response.content[0]["text"]
#     else:
#         return response.content


import os

from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI


load_dotenv()


llm = ChatGoogleGenerativeAI(
    model="gemini-3.5-flash",
    temperature=0
)