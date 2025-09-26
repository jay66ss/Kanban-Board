import KanbanAPI from "./api/KanbanAPI.js";

const newItem = KanbanAPI.insertItem(2, "Hello World!");
KanbanAPI.updateItem(newItem.id, { 
    columnId: 1,
    position: 0,
    content: "Updated Content"
});
console.log(KanbanAPI.getItems(1)); // Muestra los items de la columna 1
KanbanAPI.deleteItem(791083);
