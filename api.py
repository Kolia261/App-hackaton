import sqlite3
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from starlette.middleware.cors import CORSMiddleware as CORSMiddleware
import logging


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


conn = sqlite3.connect('tasks_and_goals.db', check_same_thread=False)
cursor = conn.cursor()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UserList(BaseModel):
    users: List[int]

class Task(BaseModel):
    title: str
    id: int
    completed: bool = False

class UserTasksAndGoals(BaseModel):
    tasks: List[Task] = []
    goals: List[str] = []

@app.get("/get_tasks_and_goals/{user_id}", response_model=UserTasksAndGoals)
async def get_tasks_and_goals(user_id: int):
    cursor.execute("SELECT * FROM tasks WHERE user_id=?", (user_id,))
    tasks = cursor.fetchall()

    # удали потом
    logger.info(f"Задачи для пользователя {user_id}: {tasks}")

    
    cursor.execute("SELECT goal FROM goals WHERE user_id=?", (user_id,))
    goals = cursor.fetchall()
    
    task_list = [Task(title=task[2], id=task[0], completed=task[3]) for task in tasks]
    goal_list = [goal[0] for goal in goals]

    return UserTasksAndGoals(tasks=task_list, goals=goal_list)

@app.get("/get_code/{code}", response_model=UserList)
async def get_code(code: str):
    cursor.execute("SELECT user_id FROM users WHERE secret_code=?", (code,))
    user = cursor.fetchone()
    
    if user:
        return UserList(users=[user[0]])
    
    raise HTTPException(status_code=404, detail="Список не найден")

# TODO: complete task @app.update("/update/{task_id}")
def update_task_status(task_id: int):
    cursor.execute("UPDATE tasks SET completed = ? WHERE id = ?", (True, task_id))
    conn.commit()
    
    if cursor.rowcount > 0:
        logger.info(f"Задача с ID {task_id} успешно обновлена.")
    else:
        logger.warning(f"Задача с ID {task_id} не найдена.")

@app.put("/update/{task_id}")
async def update_task_status_endpoint(task_id: int):
    update_task_status(task_id)
    return {"message": f"Задача с ID {task_id} обновлена."}