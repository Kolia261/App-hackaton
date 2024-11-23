import sqlite3
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List

conn = sqlite3.connect('tasks_and_goals.db', check_same_thread=False)
cursor = conn.cursor()

app = FastAPI()

class UserList(BaseModel):
    users: List[int]

class Task(BaseModel):
    title: str
    completed: bool = False

class UserTasksAndGoals(BaseModel):
    tasks: List[Task] = []
    goals: List[str] = []

@app.get("/get_tasks_and_goals/{user_id}", response_model=UserTasksAndGoals)
async def get_tasks_and_goals(user_id: int):
    cursor.execute("SELECT task FROM tasks WHERE user_id=?", (user_id,))
    tasks = cursor.fetchall()
    
    cursor.execute("SELECT goal FROM goals WHERE user_id=?", (user_id,))
    goals = cursor.fetchall()
    
    task_list = [Task(title=task[0], completed=False) for task in tasks]
    goal_list = [goal[0] for goal in goals]

    return UserTasksAndGoals(tasks=task_list, goals=goal_list)

@app.get("/get_code/{code}", response_model=UserList)
async def get_code(code: str):
    cursor.execute("SELECT user_id FROM users WHERE secret_code=?", (code,))
    user = cursor.fetchone()
    
    if user:
        return UserList(users=[user[0]])
    
    raise HTTPException(status_code=404, detail="Список не найден")
