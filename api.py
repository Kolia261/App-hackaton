from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()

class UserList(BaseModel):
    users: list[str]

fake_db = {
    '1234': ['Иван', 'Петр', 'Анна'],
    '5678': ['Сергей', 'Ольга']
}

@app.get("/get_code/{code}")
async def get_code(code: str):
    if code in fake_db:
        user_list = UserList(users=fake_db[code])
        return user_list
    
    raise HTTPException(status_code=404, detail="Список не найден")