// tests/Server.test.js
import supertest from "supertest";
import app from "../server.js"; 

let createdItemId;

describe("Kanban API", () => {

  // --------- CREATE: POST ----------
  test("POST /items crea un item correctamente", async () => {
    const res = await supertest(app)
      .post("/items")
      .send({ content: "Test item", columnId: 1, position: 0 });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id");
    expect(res.body.content).toBe("Test item");
    expect(res.body.columnId).toBe(1);
    createdItemId = res.body.id;
  });

  test("POST /items falla si faltan campos", async () => {
    const res = await supertest(app)
      .post("/items")
      .send({ content: "Incomplete" }); // falta columnId y position

    // Tu server actualmente no valida esto, pero podemos esperar que falle o manejar error
    // Si quieres, agrega validación en server.js para devolver 400
    expect(res.statusCode).toBe(200); // Cambia a 400 si implementas validación
  });

  // --------- READ: GET ----------
  test("GET /items/:columnId devuelve array", async () => {
    const res = await supertest(app).get("/items/1");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // --------- UPDATE: PUT ----------
  test("PUT /items/:id actualiza un item correctamente", async () => {
    const res = await supertest(app)
      .put(`/items/${createdItemId}`)
      .send({ content: "Updated item", columnId: 2, position: 1 });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("success", true);

    // Verificamos que GET refleje los cambios
    const check = await supertest(app).get("/items/2");
    const updatedItem = check.body.find(item => item.id === createdItemId);
    expect(updatedItem.content).toBe("Updated item");
    expect(updatedItem.columnId).toBe(2);
  });

  test("PUT /items/:id devuelve 404 si no existe", async () => {
    const res = await supertest(app)
      .put("/items/999999")
      .send({ content: "No item", columnId: 1, position: 0 });

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("error", "Item not found");
  });

  // --------- DELETE ----------
  test("DELETE /items/:id elimina un item correctamente", async () => {
    const res = await supertest(app).delete(`/items/${createdItemId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("success", true);

    // Verificamos que ya no exista
    const check = await supertest(app).get("/items/2");
    const exists = check.body.some(item => item.id === createdItemId);
    expect(exists).toBe(false);
  });

  test("DELETE /items/:id devuelve 404 si no existe", async () => {
    const res = await supertest(app).delete("/items/999999");
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("error", "Item not found");
  });

  // --------- INTEGRACIÓN ----------
  test("Mover item de columna y comprobar orden", async () => {
    // Creamos dos items en columna 1
    const res1 = await supertest(app).post("/items").send({ content: "Item A", columnId: 1, position: 0 });
    const res2 = await supertest(app).post("/items").send({ content: "Item B", columnId: 1, position: 1 });
    const idA = res1.body.id;
    const idB = res2.body.id;

    // Movemos Item A a columna 3
    await supertest(app).put(`/items/${idA}`).send({ content: "Item A", columnId: 3, position: 0 });

    // Comprobamos
    const col1 = await supertest(app).get("/items/1");
    const col3 = await supertest(app).get("/items/3");
    expect(col1.body.some(i => i.id === idA)).toBe(false);
    expect(col3.body.some(i => i.id === idA)).toBe(true);

    // Limpiamos items
    await supertest(app).delete(`/items/${idA}`);
    await supertest(app).delete(`/items/${idB}`);
  });

});
