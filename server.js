const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const port = 3000;

// Дозволяємо браузеру отримувати дані з цього сервера
app.use(cors());

// 1. Підключення до бази даних (або її створення, якщо немає)
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('Помилка відкриття БД:', err.message);
    } else {
        console.log('Підключено до бази даних SQLite.');
        // Створюємо таблицю items, якщо вона не існує
        db.run(`CREATE TABLE IF NOT EXISTS items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL
        )`, () => {
            // Додамо пару тестових записів, якщо таблиця порожня
            db.get("SELECT count(*) as count FROM items", (err, row) => {
                if (row.count === 0) {
                    const insert = 'INSERT INTO items (name) VALUES (?)';
                    db.run(insert, ['Купити молоко']);
                    db.run(insert, ['Зробити лабораторну']);
                    db.run(insert, ['Вивчити Git']);
                    console.log('Додано тестові дані.');
                }
            });
        });
    }
});

// 2. Створення Endpoint (точки доступу) GET /items
app.get('/items', (req, res) => {
    const sql = "SELECT * FROM items";
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.json({
            "message": "success",
            "data": rows
        });
    });
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер працює на порту ${port} (http://localhost:${port})`);
});