import sqlite3

conn = sqlite3.connect("database.db")

cur = conn.cursor()

cur.execute('''
    CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        finished BOOLEAN DEFAULT FALSE,
        data TEXT
    )
''')

conn.commit()

cur.close()
conn.close()

print("Таблица создана успешно!")
