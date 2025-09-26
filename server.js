// server.js (cópialo entero y reemplaza el anterior)
import express from "express";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// --- Logging middleware para ver todas las peticiones ---
app.use((req, res, next) => {
  console.log(new Date().toISOString(), req.method, req.url);
  next();
});

// Servir archivos estáticos desde /public
const publicPath = path.join(__dirname, "public");
console.log("Serving static files from:", publicPath);
app.use(express.static(publicPath));

// Conexión a SQLite (async top-level)
const db = await open({
  filename: path.join(__dirname, "kanban.db"),
  driver: sqlite3.Database
});

await db.run(`
  CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT,
    columnId INTEGER,
    position INTEGER
  )
`);

// Rutas API
app.get("/items/:columnId", async (req, res) => {
  const columnId = req.params.columnId;
  const items = await db.all("SELECT * FROM items WHERE columnId = ? ORDER BY position", columnId);
  res.json(items);
});

app.post("/items", async (req, res) => {
  const { content, columnId, position } = req.body;
  const result = await db.run("INSERT INTO items (content, columnId, position) VALUES (?, ?, ?)", content, columnId, position);
  res.json({ id: result.lastID, content, columnId, position });
});

app.put("/items/:id", async (req, res) => {
  const { content, columnId, position } = req.body;
  await db.run("UPDATE items SET content = ?, columnId = ?, position = ? WHERE id = ?", content, columnId, position, req.params.id);
  res.json({ success: true });
});

app.delete("/items/:id", async (req, res) => {
  await db.run("DELETE FROM items WHERE id = ?", req.params.id);
  res.json({ success: true });
});

// Ruta raíz explícita (para evitar 404 en /)
app.get("/", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

// Catch-all para rutas no encontradas (para depuración)
app.use((req, res) => {
  res.status(404).json({ error: "Not Found", path: req.path });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
// Ahora puedes acceder a tu frontend en http://localhost:5500 y a la API en http://localhost:3000