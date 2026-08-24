# services/rag_service.py

import uuid

from loaders.resume_loader import load_resume
from processing.text_splitter import split_documents
from vectorStore.chroma_store import (
    create_resume_collection,
    get_resume_context
)


import json
from llm.gemini_client import llm

RESUME_ANALYSIS_PROMPT = """
You are an expert resume parser and analyzer. Analyze the provided resume text and extract the structured information.

RESUME TEXT:
{resume_text}

Extract the following details as a valid JSON object with the exact structure below. Do not wrap the JSON in markdown code blocks, do not add any explanation or additional text.

{{
  "skills": ["skill1", "skill2", ...],
  "projects": ["project1_title_or_description", "project2...", ...],
  "achievements": ["achievement1", "achievement2", ...],
  "experience": ["experience_description_1", ...],
  "certifications": ["certification1", ...],
  "education": ["degree1 at school1", ...],
  "top_technical_skills": ["skill1", "skill2", "skill3", ...],
  "recent_role": {{
    "title": "recent job title",
    "company": "company name",
    "startYear": "YYYY or Month YYYY",
    "endYear": "YYYY or Present"
  }}
}}

For "recent_role", if no recent experience is detected, return null. Ensure the response is ONLY valid JSON that can be parsed directly.
"""

def analyze_resume_text(documents):
    resume_text = "\n".join([doc.page_content for doc in documents])
    prompt = RESUME_ANALYSIS_PROMPT.format(resume_text=resume_text)
    
    try:
        response = llm.invoke(prompt)
        content = response.content
        if isinstance(content, list):
            content = content[0]["text"]
            
        content = content.strip()
        if content.startswith("```json"):
            content = content[7:]
        if content.startswith("```"):
            content = content[3:]
        if content.endswith("```"):
            content = content[:-3]
        content = content.strip()
        
        analysis = json.loads(content)
        return analysis
    except Exception as e:
        print("JSON parse error for resume analysis:", e)
        return {
            "skills": [],
            "projects": [],
            "achievements": [],
            "experience": [],
            "certifications": [],
            "education": [],
            "top_technical_skills": [],
            "recent_role": None
        }

def process_resume(file_path):

    # Generate unique collection ID
    collection_id = str(uuid.uuid4())

    # Parse resume
    documents = load_resume(file_path)

    # Split resume
    chunks = split_documents(documents)

    # Store in Chroma
    create_resume_collection(
        collection_id,
        chunks
    )

    # Analyze resume using Gemini
    analysis = analyze_resume_text(documents)

    return {
        "collection_id": collection_id,
        "chunk_count": len(chunks),
        "analysis": analysis
    }


def retrieve_resume_context(
    collection_id,
    query
):

    return get_resume_context(
        collection_id,
        query
    )