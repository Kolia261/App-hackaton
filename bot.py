import os
import random
import string
import sqlite3
import telebot

TOKEN = os.getenv('TOKEN')
bot = telebot.TeleBot('6456632705:AAFKER6dKXXchVLVkuPqSl3S0lSCAc-fFys')

conn = sqlite3.connect('tasks_and_goals.db', check_same_thread=False)
cursor = conn.cursor()

cursor.execute('''
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    user_id INTEGER UNIQUE,
    secret_code TEXT
);
''')

cursor.execute('''
CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY,
    user_id INTEGER,
    task TEXT,
    FOREIGN KEY (user_id) REFERENCES users (user_id)
);
''')

cursor.execute('''
CREATE TABLE IF NOT EXISTS goals (
    id INTEGER PRIMARY KEY,
    user_id INTEGER,
    goal TEXT,
    FOREIGN KEY (user_id) REFERENCES users (user_id)
);
''')

conn.commit()

# ALLOWED_USER_ID = os.getenv("TG_ID")  
# print(ALLOWED_USER_ID)
# def is_allowed_user(user_id):
#     return str(user_id) == ALLOWED_USER_ID
    

@bot.message_handler(commands=['start'])
def start(message):
    # if not is_allowed_user(message.from_user.id):
    #     bot.send_message(message.chat.id, "У вас нет доступа к этому боту.")
    #     return
    bot.send_message(message.chat.id, "Привет! Это панель управления для родителей. Доступны следующие команды:\n"
                                      "/view_tasks - просмотреть список задач\n"
                                      "/add_task - добавить новую задачу\n"
                                      "/set_goal - установить цель для ребенка\n"
                                      "/save_code - сохранить код входа для ребенка")

@bot.message_handler(commands=['view_tasks'])
def view_tasks(message):
    # if not is_allowed_user(message.from_user.id):
    #     bot.send_message(message.chat.id, "У вас нет доступа к этому боту.")
    #     return

    user_id = message.from_user.id
    cursor.execute("SELECT task FROM tasks WHERE user_id=?", (user_id,))
    tasks = cursor.fetchall()

    cursor.execute("SELECT goal FROM goals WHERE user_id=?", (user_id,))
    goals = cursor.fetchall()

    task_list = [task[0] for task in tasks]
    goal_list = [goal[0] for goal in goals]

    response = (
    f'Задачи: {", ".join(task_list) if task_list else "Нет задач"}\n'
    f'Цели: {", ".join(goal_list) if goal_list else "Нет целей"}'
)
    
    bot.send_message(message.chat.id, response)

@bot.message_handler(commands=['add_task'])
def add_task(message):
    # if not is_allowed_user(message.from_user.id):
    #     bot.send_message(message.chat.id, "У вас нет доступа к этому боту.")
    #     return

    msg = bot.reply_to(message, 'Введите название задачи:')
    bot.register_next_step_handler(msg, process_add_task)

def process_add_task(message):
    task = message.text.strip()
    user_id = message.from_user.id

    cursor.execute("INSERT INTO tasks (user_id, task, finished, data) VALUES (?, ?)", (user_id, task, False, "nothing"))
    conn.commit()
    
    bot.send_message(message.chat.id, f'Задача "{task}" успешно добавлена.')

@bot.message_handler(commands=['set_goal'])
def set_goal(message):
    # if not is_allowed_user(message.from_user.id):
    #     bot.send_message(message.chat.id, "У вас нет доступа к этому боту.")
    #     return

    msg = bot.reply_to(message, 'Введите цель для ребенка:')
    bot.register_next_step_handler(msg, process_set_goal)

def process_set_goal(message):
    goal = message.text.strip()
    user_id = message.from_user.id

    cursor.execute("INSERT INTO goals (user_id, goal) VALUES (?, ?)", (user_id, goal))
    conn.commit()

    bot.send_message(message.chat.id, f'Цель "{goal}" успешно установлена.')


def generate_random_code(length=6):
    characters = string.ascii_letters + string.digits
    code = ''.join(random.choice(characters) for _ in range(length))
    return code


@bot.message_handler(commands=['save_code'])
def save_code(message):
    # if not is_allowed_user(message.from_user.id):
    #     bot.send_message(message.chat.id, "У вас нет доступа к этому боту.")
    #     return

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
    # if not is_allowed_user(message.from_user.id):
    #     bot.send_message(message.chat.id, "У вас нет доступа к этому боту.")
    #     return

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

if __name__ == "__main__":
    bot.polling(none_stop=True)
