export default class Column {
    constructor(id, title) {
        // Constructor logic here
    }

    static createRoot() {
    // Returns an HTML element as an object containing the basic structure of a column
    const range = document.createRange();
    range.selectNode(document.body);
    // La siguiente línea convierte el HTML en nodos DOM reales, listos para insertar en la página
    return range.createContextualFragment(`
            <div class="kanban__column">
                <div class="kanban__column-title"></div>
                <div class="kanban__column-items"></div>
                <button class="kanban__add-item" type="button">+ Add</button>
            </div>
        `).children[0]; // Virtual DOM tree
    }
}