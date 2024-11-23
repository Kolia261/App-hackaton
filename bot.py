import telebot
import string
import random
import sqlite3
import os

TOKEN = os.getenv('TOKEN')

bot = telebot.TeleBot(TOKEN)

tasks_and_goals = {}

@bot.message_handler(commands=['start'])
def start(message):
    bot.send_message(message.chat.id, "Привет! Это панель управления для родителей. Доступны следующие команды:\n"
                                      "/view_tasks - просмотреть список задач\n"
                                      "/add_task - добавить новую задачу\n"
                                      "/set_goal - установить цель для ребенка\n"
                                      "/save_code - сохранить код входа для ребенка")

@bot.message_handler(commands=['view_tasks'])
def view_tasks(message):
    user_id = message.from_user.id
    if user_id in tasks_and_goals:
        tasks = tasks_and_goals[user_id].get('tasks', [])
        goals = tasks_and_goals[user_id].get('goals', [])
        
        response = f'Задачи: {", ".join(tasks)}\nЦели: {", ".join(goals)}'
    else:
        response = 'У вас нет ни задач, ни целей.'
    
    bot.send_message(message.chat.id, response)
@bot.message_handler(commands=['add_task'])
def add_task(message):
    msg = bot.reply_to(message, 'Введите название задачи:')
    bot.register_next_step_handler(msg, process_add_task)

def process_add_task(message):
    task = message.text.strip()
    user_id = message.from_user.id
    if user_id not in tasks_and_goals:
        tasks_and_goals[user_id] = {'tasks': [], 'goals': []}
    
    tasks_and_goals[user_id]['tasks'].append(task)
    bot.send_message(message.chat.id, f'Задача "{task}" успешно добавлена.')

@bot.message_handler(commands=['set_goal'])
def set_goal(message):
    msg = bot.reply_to(message, 'Введите цель для ребенка:')
    bot.register_next_step_handler(msg, process_set_goal)

def process_set_goal(message):
    goal = message.text.strip()
    user_id = message.from_user.id
    if user_id not in tasks_and_goals:
        tasks_and_goals[user_id] = {'tasks': [], 'goals': []}
    
    tasks_and_goals[user_id]['goals'].append(goal)
    bot.send_message(message.chat.id, f'Цель "{goal}" успешно установлена.')

conn = sqlite3.connect('users.db')
cursor = conn.cursor()

cursor.execute('''
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    user_id INTEGER UNIQUE,
    secret_code TEXT
);
''')
conn.commit()

def generate_random_code(length=6):
    characters = string.ascii_letters + string.digits
    code = ''.join(random.choice(characters) for _ in range(length))
    return code

@bot.message_handler(commands=['save_code'])
def save_code(message):
    msg = bot.reply_to(message, 'Сейчас бот сгенерирует код:')
    bot.register_next_step_handler(msg, process_save_code)

def process_save_code(message):
    secret_code = generate_random_code()
    user_id = message.from_user.id

    cursor.execute("SELECT * FROM users WHERE user_id=?", (user_id,))
    row = cursor.fetchone()

    if row is None:
        cursor.execute(
            "INSERT INTO users (user_id, secret_code) VALUES (?, ?)",
            (user_id, secret_code),
        )
        conn.commit()
        bot.send_message(message.chat.id, f'Код входа для ребенка сохранен: {secret_code}.')
    else:
        bot.send_message(
            message.chat.id,
            'У вас уже есть сохраненный код. Чтобы обновить его, напишите /update_code.',
        )

@bot.message_handler(commands=['update_code'])
def update_code(message):
    new_secret_code = generate_random_code()

    user_id = message.from_user.id
    cursor.execute(
        "UPDATE users SET secret_code=? WHERE user_id=?",
        (new_secret_code, user_id),
    )
    conn.commit()

    bot.send_message(
        message.chat.id, 
        f'Ваш код был успешно обновлен до: {new_secret_code}.',
    )
if __name__ == '__main__':
    bot.polling(none_stop=True)
