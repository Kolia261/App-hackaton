from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import common

app = FastAPI()

class UserList(BaseModel):
    users: list[str]

class Task(BaseModel):
    title: str
    completed: bool = False

class UserTasksAndGoals(BaseModel):
    tasks: List[Task] = []
    goals: List[str] = []

@app.get("/get_tasks_and_goals")
async def get_tasks_and_goals():
    return common.tasks_and_goals

@app.get("/get_code/{code}")
async def get_code(code: str):
    if code in common.fake_db:
        user_list = UserList(users=common.fake_db[code])
        return user_list
    
    raise HTTPException(status_code=404, detail="Список не найден")