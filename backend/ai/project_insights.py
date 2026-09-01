import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def generate_project_insights(project, tasks):
    task_data = []

    for task in tasks:
        task_data.append({
            "name": task.name,
            "description": task.description,
            "status": task.status,
            "priority": task.priority,
        })

    prompt = f"""
You are an AI project management assistant.

Analyze the following project and its tasks.

PROJECT:
Name: {project.name}
Description: {project.description}
Status: {project.status}
Progress: {project.progress}%

TASKS:
{task_data}

Provide a concise project analysis.

Return exactly this JSON structure:

{{
    "summary": "Short summary of the current project state",
    "health": "Healthy, At Risk, or Critical",
    "risks": [
        "Risk 1",
        "Risk 2"
    ],
    "recommendations": [
        "Recommendation 1",
        "Recommendation 2"
    ],
    "next_steps": [
        "Next step 1",
        "Next step 2"
    ]
}}

Do not include markdown.
Return only valid JSON.
"""

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": "You are an expert AI project management assistant.",
            },
            {
                "role": "user",
                "content": prompt,
            },
        ],
        temperature=0.3,
    )

    return response.choices[0].message.content