from dotenv import load_dotenv
import os
import json
import re
from groq import Groq

load_dotenv()

groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def run_agent(prompt):

    response = groq_client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role": "user", "content": prompt}]
    )

    return parse_json(response.choices[0].message.content)


def marketing_agent(idea):

    prompt = f"""
You are a MARKETING expert analyzing a startup.

Idea: {idea}

Return JSON:
{{"message":"marketing analysis","confidence":70,"stance":"Optimistic","vote":"A"}}
"""

    return run_agent(prompt)


def product_agent(idea):

    prompt = f"""
You are a PRODUCT strategist.

Idea: {idea}

Return JSON:
{{"message":"product analysis","confidence":70,"stance":"Excited","vote":"B"}}
"""

    return run_agent(prompt)


def sales_agent(idea):

    prompt = f"""
You are a SALES strategist.

Idea: {idea}

Return JSON:
{{"message":"sales analysis","confidence":70,"stance":"Confident","vote":"A"}}
"""

    return run_agent(prompt)


def tech_agent(idea):

    prompt = f"""
You are a TECH architect.

Idea: {idea}

Return JSON:
{{"message":"technical analysis","confidence":80,"stance":"Ready","vote":"B"}}
"""

    return run_agent(prompt)


def ops_agent(idea):

    prompt = f"""
You are an OPERATIONS strategist.

Idea: {idea}

Return JSON:
{{"message":"operations analysis","confidence":75,"stance":"Careful","vote":"B"}}
"""

    return run_agent(prompt)


def parse_json(text):

    try:
        match = re.search(r"\{.*\}", text, re.DOTALL)
        if match:
            return json.loads(match.group())

        return json.loads(text)

    except:
        return {
            "message": text[:200],
            "confidence": 70,
            "stance": "Analyzing",
            "vote": "A"
        }


def roadmap_agent(idea):

    prompt = f"""
You are a startup roadmap planner.

Startup Idea: {idea}

Create a startup roadmap across 4 phases.

Return STRICT JSON:

{{
 "mvp": {{
   "tasks": ["task1","task2","task3"],
   "confidence": 75,
   "technical_feasibility": 85,
   "market_timing": 60,
   "team_readiness": 80
 }},
 "v1": {{
   "tasks": ["task1","task2","task3"],
   "confidence": 78,
   "technical_feasibility": 88,
   "market_timing": 65,
   "team_readiness": 83
 }},
 "v2": {{
   "tasks": ["task1","task2","task3"],
   "confidence": 82,
   "technical_feasibility": 90,
   "market_timing": 70,
   "team_readiness": 86
 }},
 "scale": {{
   "tasks": ["task1","task2","task3"],
   "confidence": 88,
   "technical_feasibility": 92,
   "market_timing": 78,
   "team_readiness": 90
 }}
}}
"""

    return run_agent(prompt)


def team_agent(idea):

    prompt = f"""
You are a startup advisor.

Startup Idea: {idea}

Suggest the ideal founding team.

Return JSON:
{{
 "roles": ["Role1", "Role2", "Role3"],
 "explanation": "Why these roles are important"
}}
"""

    return run_agent(prompt)


def decision_agent(idea):

    prompt = f"""
You are a startup decision strategist.

Startup Idea: {idea}

Suggest strategic decisions.

Return JSON:
{{
 "decision_question":"Key decision founders must make",
 "options":[
   {{"label":"Option A","risk":20,"confidence":80}},
   {{"label":"Option B","risk":40,"confidence":60}},
   {{"label":"Option C","risk":30,"confidence":70}}
 ]
}}
"""

    return run_agent(prompt)