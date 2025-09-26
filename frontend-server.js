import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public"))); // tu frontend dentro de "public"

app.listen(5500, () => console.log("Frontend running on http://localhost:5500"));
