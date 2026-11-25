from ai.task_generator import generate_tasks
from ai.project_insights import generate_project_insights
from ai.task_prioritizer import prioritize_tasks
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import engine, Base, SessionLocal
from models import Project, Task, TeamMember


app = FastAPI()


# Create database tables
Base.metadata.create_all(bind=engine)


# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ---------------- HOME ----------------

@app.get("/")
def home():
    return {"message": "Welcome to ProjectFlow AI"}


# ---------------- HEALTH ----------------

@app.get("/api/health")
def health_check():
    return {
        "status": "ok",
        "message": "ProjectFlow AI backend is running",
    }


# ============================================================
# PROJECT SCHEMAS
# ============================================================

class ProjectCreate(BaseModel):
    name: str
    description: str
    status: str = "Planning"
    progress: int = 0


class ProjectUpdate(BaseModel):
    name: str
    description: str
    status: str
    progress: int


# ============================================================
# PROJECT APIs
# ============================================================

# GET PROJECTS
@app.get("/api/projects")
def get_projects(db: Session = Depends(get_db)):
    return db.query(Project).all()


# CREATE PROJECT
@app.post("/api/projects")
def create_project(
    project: ProjectCreate,
    db: Session = Depends(get_db)
):
    new_project = Project(
        name=project.name,
        description=project.description,
        status=project.status,
        progress=project.progress,
    )

    db.add(new_project)
    db.commit()
    db.refresh(new_project)

    return new_project


# UPDATE PROJECT
@app.put("/api/projects/{project_id}")
def update_project(
    project_id: int,
    project_update: ProjectUpdate,
    db: Session = Depends(get_db)
):
    project = db.query(Project).filter(
        Project.id == project_id
    ).first()

    if not project:
        raise HTTPException(
            status_code=404,
            detail="Project not found"
        )

    project.name = project_update.name
    project.description = project_update.description
    project.status = project_update.status
    project.progress = project_update.progress

    db.commit()
    db.refresh(project)

    return project


# DELETE PROJECT
@app.delete("/api/projects/{project_id}")
def delete_project(
    project_id: int,
    db: Session = Depends(get_db)
):
    project = db.query(Project).filter(
        Project.id == project_id
    ).first()

    if not project:
        raise HTTPException(
            status_code=404,
            detail="Project not found"
        )

    db.delete(project)
    db.commit()

    return {
        "message": "Project deleted successfully"
    }


# ============================================================
# TASK SCHEMAS
# ============================================================

class TaskCreate(BaseModel):
    name: str
    description: str
    status: str = "Todo"
    priority: str = "Medium"
    project_id: int | None = None


class TaskUpdate(BaseModel):
    name: str
    description: str
    status: str
    priority: str
    project_id: int | None = None


# ============================================================
# TASK APIs
# ============================================================

def update_project_progress(project_id, db):
    if project_id is None:
        return

    project = db.query(Project).filter(
        Project.id == project_id
    ).first()

    if not project:
        return

    tasks = db.query(Task).filter(
        Task.project_id == project_id
    ).all()

    if not tasks:
        project.progress = 0
        return

    completed_tasks = sum(
        1 for task in tasks
        if str(task.status).lower() == "done"
    )

    project.progress = round(
        (completed_tasks / len(tasks)) * 100
    )

# GET TASKS
@app.get("/api/tasks")
def get_tasks(db: Session = Depends(get_db)):
    return db.query(Task).all()


# CREATE TASK
@app.post("/api/tasks")
def create_task(task: TaskCreate, db: Session = Depends(get_db)):
    new_task = Task(
        name=task.name,
        description=task.description,
        status=task.status,
        priority=task.priority,
        project_id=task.project_id,
    )

    db.add(new_task)
    db.commit()
    db.refresh(new_task)

    # Automatically update project progress
    update_project_progress(new_task.project_id, db)
    db.commit()

    return new_task


# UPDATE TASK
@app.put("/api/tasks/{task_id}")
def update_task(
    task_id: int,
    task_update: TaskUpdate,
    db: Session = Depends(get_db)
):
    task = db.query(Task).filter(
        Task.id == task_id
    ).first()

    if not task:
        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )

    # Store project before updating
    old_project_id = task.project_id

    # Update task
    task.name = task_update.name
    task.description = task_update.description
    task.status = task_update.status
    task.priority = task_update.priority
    task.project_id = task_update.project_id

    # Save task changes
    db.commit()

    # Recalculate progress
    update_project_progress(task.project_id, db)

    # If task moved to another project,
    # update the old project too
    if old_project_id != task.project_id:
        update_project_progress(old_project_id, db)

    # Save progress changes
    db.commit()

    db.refresh(task)

    return task

# DELETE TASK
@app.delete("/api/tasks/{task_id}")
def delete_task(
    task_id: int,
    db: Session = Depends(get_db)
):
    task = db.query(Task).filter(
        Task.id == task_id
    ).first()

    if not task:
        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )

    # Store project before deleting the task
    project_id = task.project_id

    db.delete(task)
    db.commit()

    # Automatically update project progress
    update_project_progress(project_id, db)
    db.commit()

    return {
        "message": "Task deleted successfully"
    }


# ---------------- TEAM SCHEMAS ----------------

class TeamMemberCreate(BaseModel):
    name: str
    email: str
    role: str = "Member"


class TeamMemberUpdate(BaseModel):
    name: str
    email: str
    role: str


# ---------------- GET TEAM ----------------

@app.get("/api/team")
def get_team(db: Session = Depends(get_db)):
    return db.query(TeamMember).all()


# ---------------- CREATE TEAM MEMBER ----------------

@app.post("/api/team")
def create_team_member(
    member: TeamMemberCreate,
    db: Session = Depends(get_db)
):
    new_member = TeamMember(
        name=member.name,
        email=member.email,
        role=member.role,
    )

    db.add(new_member)
    db.commit()
    db.refresh(new_member)

    return new_member


# ---------------- UPDATE TEAM MEMBER ----------------

@app.put("/api/team/{member_id}")
def update_team_member(
    member_id: int,
    member_update: TeamMemberUpdate,
    db: Session = Depends(get_db)
):
    member = db.query(TeamMember).filter(
        TeamMember.id == member_id
    ).first()

    if not member:
        raise HTTPException(
            status_code=404,
            detail="Team member not found"
        )

    member.name = member_update.name
    member.email = member_update.email
    member.role = member_update.role

    db.commit()
    db.refresh(member)

    return member


# ---------------- DELETE TEAM MEMBER ----------------

@app.delete("/api/team/{member_id}")
def delete_team_member(
    member_id: int,
    db: Session = Depends(get_db)
):
    member = db.query(TeamMember).filter(
        TeamMember.id == member_id
    ).first()

    if not member:
        raise HTTPException(
            status_code=404,
            detail="Team member not found"
        )

    db.delete(member)
    db.commit()

    return {
        "message": "Team member deleted successfully"
    }

# ============================================================
# AI TASK GENERATOR
# ============================================================



class AITaskRequest(BaseModel):
    project_description: str


@app.post("/api/ai/generate-tasks")
def generate_ai_tasks(request: AITaskRequest):
    try:
        result = generate_tasks(request.project_description)

        return result

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"AI task generation failed: {str(e)}"
        )

    # ============================================================
# AI PROJECT INSIGHTS
# ============================================================

class ProjectInsightsRequest(BaseModel):
    project_id: int


@app.post("/api/ai/project-insights")
def get_project_insights(
    request: ProjectInsightsRequest,
    db: Session = Depends(get_db)
):
    # Find project
    project = db.query(Project).filter(
        Project.id == request.project_id
    ).first()

    if not project:
        raise HTTPException(
            status_code=404,
            detail="Project not found"
        )

    # Get tasks belonging to project
    tasks = db.query(Task).filter(
        Task.project_id == request.project_id
    ).all()

    try:
        insights = generate_project_insights(
            project,
            tasks
        )

        return {
            "project_id": project.id,
            "project_name": project.name,
            "insights": insights
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"AI project insights failed: {str(e)}"
        )

    # ============================================================
# AI TASK PRIORITIZATION
# ============================================================

class TaskPrioritizationRequest(BaseModel):
    project_id: int


@app.post("/api/ai/prioritize-tasks")
def prioritize_project_tasks(
    request: TaskPrioritizationRequest,
    db: Session = Depends(get_db)
):
    # Find project
    project = db.query(Project).filter(
        Project.id == request.project_id
    ).first()

    if not project:
        raise HTTPException(
            status_code=404,
            detail="Project not found"
        )

    # Get tasks belonging to project
    tasks = db.query(Task).filter(
        Task.project_id == request.project_id
    ).all()

    if not tasks:
        raise HTTPException(
            status_code=404,
            detail="No tasks found for this project"
        )

    try:
        result = prioritize_tasks(tasks)

        return {
            "project_id": project.id,
            "project_name": project.name,
            "prioritized_tasks": result["prioritized_tasks"]
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"AI task prioritization failed: {str(e)}"
        )