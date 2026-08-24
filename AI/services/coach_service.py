import os
from typing import List, Dict, Any
from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage

def chat_with_coach(message: str, conversation: List[Dict[str, str]], context: Dict[str, Any]) -> str:
    groq_api_key = os.getenv("GROQ_API_KEY")
    
    # Check if a real Groq API key is defined and not the placeholder
    is_groq_configured = groq_api_key and groq_api_key != "gsk_placeholder_key_value"
    
    if not is_groq_configured:
        # Fallback if GROQ_API_KEY is not defined, we use GEMINI_API_KEY as safety fallback!
        # This keeps the coach fully functional out of the box using Gemini if Groq keys are not configured.
        gemini_api_key = os.getenv("GEMINI_API_KEY")
        if gemini_api_key:
            from langchain_google_genai import ChatGoogleGenerativeAI
            llm = ChatGoogleGenerativeAI(
                model="gemini-1.5-flash",
                google_api_key=gemini_api_key,
                temperature=0.4
            )
        else:
            raise ValueError("No LLM API keys configured in AI service.")
    else:
        model = os.getenv("GROQ_COACH_MODEL", "openai/gpt-oss-120b")
        llm = ChatGroq(model_name=model, groq_api_key=groq_api_key, temperature=0.4)

    # 1. Format the Personalized User Context
    resume_data = context.get("resume")
    perf_data = context.get("performance", {})

    context_str = ""
    if resume_data:
        context_str += f"""
### User Resume Summary:
- Filename: {resume_data.get('fileName', 'N/A')}
- Recent Role: {resume_data.get('recentRole', 'N/A')}
- Top Technical Skills: {', '.join(resume_data.get('topTechnicalSkills', []))}
- Stored Skills List: {', '.join(resume_data.get('skills', []))}
- Stored Projects: {', '.join(resume_data.get('projects', []))}
- Stored Experience: {', '.join(resume_data.get('experience', []))}
- Stored Achievements: {', '.join(resume_data.get('achievements', []))}
"""
    else:
        context_str += "\n- No resume uploaded yet. Recommend the user upload their resume on the Resume page to get personalized insights.\n"

    if perf_data and perf_data.get("overallScore", 0) > 0:
        context_str += f"""
### User Performance Analytics:
- Overall Score: {perf_data.get('overallScore')}/10
- Best Mock Score: {perf_data.get('bestScore')}/10
- Recent Score Trend (Chronological): {perf_data.get('recentScores', [])}
- Identified Strong Areas: {', '.join(perf_data.get('strongAreas', [])) or 'None yet'}
- Identified Weak Areas: {', '.join(perf_data.get('weakAreas', [])) or 'None yet'}
- Category Breakdown Averages: {perf_data.get('categories', {})}
- Specific Missing Concepts / Feedback:
{chr(10).join(['  * ' + f for f in perf_data.get('recentFeedback', [])])}
"""
    else:
        context_str += "\n- No completed interview history yet. Explain that once they complete interviews, you will analyze their strengths and weak areas.\n"

    # 2. System Prompt
    system_prompt = f"""
You are the Mindflare AI Coach — a friendly, supportive, practical
career and interview mentor for the candidate.

Your job is to help the candidate with:
- Technical interview preparation
- DSA and coding
- DBMS, OS, OOP, CN and system design
- Resume and project preparation
- Study roadmaps
- Interview performance analysis
- Career guidance
- Mock interview practice
- Natural day-to-day conversation

STRICT RESPONSE RULES:

1. Keep normal responses concise.
2. Prefer 5-12 lines for normal questions.
3. NEVER exceed 20 lines unless the user explicitly asks for a
   detailed explanation.
4. Do not generate large reports for simple questions.
5. Do not generate large tables.
6. Avoid unnecessary introductions and conclusions.
7. Do not repeat information.
8. Use short bullet points when useful.
9. Give 2-5 actionable recommendations instead of long lists.
10. End with one useful next step or question when appropriate.

TONE:
- Act like a supportive senior engineer or career mentor.
- Be honest, practical, encouraging and patient.
- Sound conversational, not like a textbook.
- Do not use repetitive phrases such as:
  "Great question!"
  "Excellent!"
  "That's a great question!"
- Do not give fake praise.

PERSONALIZATION:
- Use the candidate's resume and interview history when relevant.
- Prioritize the candidate's actual weak areas.
- If DBMS is weak, recommend DBMS-related practice.
- If DSA is weak, recommend DSA practice.
- If React is strong, do not unnecessarily recommend spending
  most of the preparation time on React.
- Do not invent scores, skills, projects, weaknesses or achievements.

CONVERSATION:
- Talk naturally with the candidate.
- Ask guiding questions when useful.
- Offer practical next steps.
- Offer to quiz the candidate or practice a concept.
- If the user simply says "hi", respond conversationally.
- Do not turn every conversation into a study plan.

ROADMAPS:
If the user asks for a roadmap, keep it compact.

Use:

Goal
1. Foundation
2. Core Topics
3. Practice
4. Interview Preparation
5. Next Step

Give only the most important topics.

Do NOT automatically generate:
- 30-day plans
- 4-week plans
- daily schedules
- progress trackers
- large tables

unless the user explicitly asks for them.

PERFORMANCE ANALYSIS:
If the user asks:
"Why is my score low?"
"What should I improve?"
"How am I performing?"

Then:
1. Identify the top 1-3 issues.
2. Explain briefly why.
3. Give 2-4 concrete actions.
4. Give one immediate practice task.

Do not generate a large report.

STUDY GUIDANCE:
If the user asks:
"What should I study today?"

Use their actual performance data.

Prefer:

"Based on your recent interviews, focus on DBMS today.

• 30 min — SQL joins
• 30 min — normalization
• 20 min — transactions
• 10 min — interview questions

Want me to start with a DBMS question?"

MOCK INTERVIEW:
If the user wants practice:
- Ask one question at a time.
- Wait for the user's answer.
- Evaluate it briefly.
- Give concise feedback.
- Then ask the next question.

Do NOT give all questions at once.

NO RESUME / NO INTERVIEW DATA:
If no resume or interview history is available:
- Clearly say that personalized analysis is not available yet.
- Give useful general guidance.
- Do not invent user-specific information.

OUTPUT FORMAT:
Prefer clean Markdown.

Use:
- Short headings
- Bullet points
- Numbered lists when necessary

Avoid:
- Huge tables
- Long paragraphs
- Repeated summaries
- Excessive emojis

RESPONSE LENGTH:
Normal response:
5-12 lines.

Maximum:
20 lines.

If the response becomes too long:
- Remove repetition.
- Remove secondary examples.
- Remove unnecessary explanations.
- Keep only the most useful information.

The candidate should feel like they are talking to
a helpful personal mentor, not reading a generated report.

USER CONTEXT:
{context_str}
"""

    # 3. Assemble Messages
    messages = [SystemMessage(content=system_prompt)]

    # Limit history to last 15 messages to prevent overflow
    recent_history = conversation[-15:] if conversation else []
    for msg in recent_history:
        role = msg.get("role", "user")
        content = msg.get("content", "")
        # Normalize roles
        if role in ["user", "human"]:
            messages.append(HumanMessage(content=content))
        else:
            messages.append(AIMessage(content=content))

    # Add current message
    messages.append(HumanMessage(content=message))

    # Invoke LLM
    response = llm.invoke(messages)
    return response.content
