import os
import json
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=api_key) if api_key else None


def generate_fallback_insights(project, tasks):
    total_tasks = len(tasks)

    completed_tasks = sum(
        1 for task in tasks
        if str(task.status).lower() == "done"
    )

    in_progress_tasks = sum(
        1 for task in tasks
        if str(task.status).lower() in ["in progress", "in-progress"]
    )

    todo_tasks = sum(
        1 for task in tasks
        if str(task.status).lower() == "todo"
    )

    high_priority_tasks = sum(
        1 for task in tasks
        if str(task.priority).lower() == "high"
    )

    unfinished_high_priority = sum(
        1 for task in tasks
        if str(task.priority).lower() == "high"
        and str(task.status).lower() != "done"
    )

    progress = project.progress or 0

    # Determine project health
    if progress < 25 or unfinished_high_priority >= 3:
        health = "Critical"
    elif progress < 60 or todo_tasks > completed_tasks:
        health = "At Risk"
    else:
        health = "Healthy"

    # Risks
    risks = []

    if progress < 30:
        risks.append(
            "Project progress is currently low and may require additional focus."
        )

    if unfinished_high_priority > 0:
        risks.append(
            f"There are {unfinished_high_priority} unfinished high-priority task(s)."
        )

    if todo_tasks > completed_tasks:
        risks.append(
            "There are more pending tasks than completed tasks."
        )

    if not risks:
        risks.append(
            "No major risks detected from the current project data."
        )

    # Recommendations
    recommendations = []

    if unfinished_high_priority > 0:
        recommendations.append(
            "Prioritize and complete high-priority tasks first."
        )

    if todo_tasks > 0:
        recommendations.append(
            "Work through pending Todo tasks to increase project progress."
        )

    if in_progress_tasks > 0:
        recommendations.append(
            "Focus on completing tasks that are currently In Progress."
        )

    if not recommendations:
        recommendations.append(
            "Continue monitoring task progress and maintain the current workflow."
        )

    # Next steps
    next_steps = []

    if unfinished_high_priority > 0:
        next_steps.append(
            "Complete the remaining high-priority tasks."
        )

    if todo_tasks > 0:
        next_steps.append(
            f"Start the next pending task from the {todo_tasks} Todo task(s)."
        )

    if in_progress_tasks > 0:
        next_steps.append(
            "Finish the tasks currently in progress."
        )

    if not next_steps:
        next_steps.append(
            "Review the project and plan the next set of tasks."
        )

    summary = (
        f"{project.name} is currently at {progress}% progress with "
        f"{completed_tasks} of {total_tasks} task(s) completed. "
        f"There are {todo_tasks} Todo task(s) and "
        f"{in_progress_tasks} task(s) in progress."
    )

    return {
        "summary": summary,
        "health": health,
        "risks": risks,
        "recommendations": recommendations,
        "next_steps": next_steps,
    }


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

    try:
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

    except Exception as e:
        print(f"OpenAI project insights unavailable: {e}")
        
        fallback = generate_fallback_insights(project, tasks)

        return json.dumps(fallback)