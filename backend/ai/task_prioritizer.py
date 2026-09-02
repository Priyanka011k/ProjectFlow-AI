import os
import json
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def generate_fallback_priorities(tasks):
    prioritized_tasks = []

    for task in tasks:
        status = str(task.status).lower()
        current_priority = str(task.priority).lower()

        # Start with the existing priority
        recommended_priority = task.priority

        # Rule 1: High priority unfinished tasks stay High
        if current_priority == "high" and status != "done":
            recommended_priority = "High"

        # Rule 2: In-progress tasks get at least Medium priority
        elif status in ["in progress", "in-progress"]:
            if current_priority == "low":
                recommended_priority = "Medium"
            else:
                recommended_priority = task.priority

        # Rule 3: Todo + High priority
        elif status == "todo" and current_priority == "high":
            recommended_priority = "High"

        # Rule 4: Todo + Medium priority
        elif status == "todo" and current_priority == "medium":
            recommended_priority = "Medium"

        # Rule 5: Completed tasks don't need urgent priority
        elif status == "done":
            recommended_priority = "Low"

        # Generate reason
        if recommended_priority == "High":
            if status == "done":
                reason = "Task is completed, but it was previously marked as high priority."
            else:
                reason = "High-priority unfinished work should be completed first."

        elif recommended_priority == "Medium":
            if status in ["in progress", "in-progress"]:
                reason = "Task is currently in progress and should continue to maintain project momentum."
            else:
                reason = "Task is important but does not require immediate attention."

        else:
            if status == "done":
                reason = "Task is already completed, so it does not require immediate attention."
            else:
                reason = "Task can be handled after higher-priority work."

        prioritized_tasks.append({
            "task_id": task.id,
            "recommended_priority": recommended_priority,
            "reason": reason,
        })

    # Put High first, then Medium, then Low
    priority_order = {
        "High": 0,
        "Medium": 1,
        "Low": 2,
    }

    prioritized_tasks.sort(
        key=lambda task: priority_order.get(
            task["recommended_priority"],
            3
        )
    )

    return {
        "prioritized_tasks": prioritized_tasks
    }


def prioritize_tasks(tasks):
    task_data = []

    for task in tasks:
        task_data.append({
            "id": task.id,
            "name": task.name,
            "description": task.description,
            "status": task.status,
            "priority": task.priority,
        })

    prompt = f"""
You are an expert AI project management assistant.

Analyze the following project tasks and determine their recommended
execution priority.

TASKS:
{task_data}

For every task, provide:
- task_id
- recommended_priority
- reason

Use only these priority values:
High, Medium, Low

Return exactly this JSON structure:

{{
    "prioritized_tasks": [
        {{
            "task_id": 1,
            "recommended_priority": "High",
            "reason": "Short explanation"
        }}
    ]
}}

Rules:
- Consider task status, existing priority, dependencies implied by descriptions,
  and overall project importance.
- High priority tasks should generally be completed first.
- Keep reasons concise.
- Do not include markdown.
- Return only valid JSON.
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
            temperature=0.2,
        )

        content = response.choices[0].message.content

        return json.loads(content)

    except Exception as e:
        print(f"OpenAI task prioritization unavailable: {e}")

        return generate_fallback_priorities(tasks)