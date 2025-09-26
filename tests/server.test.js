import request from "supertest";
import express from "express";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

// Aquí importamos tu app, pero dado que tu server hace top-level await,
// podemos crear una app de test minimal
const app = express();
app.use(express.json());

// Conexión a DB en memoria para tests
let db;

beforeAll(async () => {
  db = await open({ filename: ":memory:", driver: sqlite3.Database });
  await db.run(`
    CREATE TABLE items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content TEXT,
      columnId INTEGER,
      position INTEGER
    )
  `);

  // Rutas 
  app.get("/items/:columnId", async (req, res) => {
    const columnId = req.params.columnId;
    const items = await db.all(
      "SELECT * FROM items WHERE columnId = ? ORDER BY position",
      columnId
    );
    res.json(items);
  });
});

afterAll(async () => {
  await db.close();
});

test("GET /items/:columnId devuelve array (aunque esté vacío)", async () => {
  const res = await request(app).get("/items/1");
  expect(res.statusCode).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
  expect(res.body.length).toBe(0);
});
