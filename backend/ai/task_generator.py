def generate_tasks(project_description: str):
    """
    Mock AI task generator.

    This temporarily simulates an AI response so we can
    build and test the complete ProjectFlow AI workflow
    without using paid API credits.
    """

    return {
        "tasks": [
            {
                "name": "Set up project structure",
                "description": f"Create the initial structure and configuration for: {project_description}",
                "priority": "High",
            },
            {
                "name": "Design database schema",
                "description": "Define the required database tables, fields, relationships, and constraints.",
                "priority": "High",
            },
            {
                "name": "Implement authentication",
                "description": "Create secure user registration, login, and authentication functionality.",
                "priority": "High",
            },
            {
                "name": "Build core application features",
                "description": "Develop the main functionality required by the project requirements.",
                "priority": "Medium",
            },
            {
                "name": "Create frontend interface",
                "description": "Build responsive pages and reusable UI components for the application.",
                "priority": "Medium",
            },
            {
                "name": "Connect frontend and backend",
                "description": "Integrate the frontend with backend REST APIs and handle application data.",
                "priority": "High",
            },
            {
                "name": "Test the application",
                "description": "Test the major features, APIs, validation, and user workflows.",
                "priority": "Medium",
            },
        ]
    }