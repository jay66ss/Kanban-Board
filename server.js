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

// --- Logging middleware ---
app.use((req, res, next) => {
  console.log(new Date().toISOString(), req.method, req.url);
  next();
});

const publicPath = path.join(__dirname, "public");
app.use(express.static(publicPath));

async function initDBAndServer() {
  // SQLite DB
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

  // POST /items
app.post("/items", async (req, res) => {
  const { content, columnId, position } = req.body;

  if (columnId === undefined || position === undefined) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  if (typeof columnId !== "number" || typeof position !== "number") {
    return res.status(400).json({ error: "columnId and position must be numbers" });
  }

  // content vacío ahora es válido
  const result = await db.run(
    "INSERT INTO items (content, columnId, position) VALUES (?, ?, ?)",
    content ?? "", columnId, position
  );

  res.status(201).json({ id: result.lastID, content: content ?? "", columnId, position });
});

// PUT /items/:id
app.put("/items/:id", async (req, res) => {
  const { content, columnId, position } = req.body;

  if (columnId === undefined || position === undefined) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  if (typeof columnId !== "number" || typeof position !== "number") {
    return res.status(400).json({ error: "columnId and position must be numbers" });
  }

  const item = await db.get("SELECT * FROM items WHERE id = ?", req.params.id);
  if (!item) return res.status(404).json({ error: "Item not found" });

  await db.run(
    "UPDATE items SET content = ?, columnId = ?, position = ? WHERE id = ?",
    content ?? "", columnId, position, req.params.id
  );

  res.json({ success: true });
});


  app.delete("/items/:id", async (req, res) => {
    const item = await db.get("SELECT * FROM items WHERE id = ?", req.params.id);
    if (!item) return res.status(404).json({ error: "Item not found" });

    await db.run("DELETE FROM items WHERE id = ?", req.params.id);
    res.json({ success: true });
  });

  app.get("/", (req, res) => res.sendFile(path.join(publicPath, "index.html")));
  app.use((req, res) => res.status(404).json({ error: "Not Found", path: req.path }));

  
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Server running on http://localhost:${port}`));

  return db;
}


const db = await initDBAndServer();

export default app;
