import Column from "./Column.js";

export default class Kanban {
    constructor(root) {
        this.root = root;


        Kanban.columns().forEach(column => {
            const columnView = new Column(column.id, column.title);
            this.root.appendChild(columnView.elements.root); // Toma el HTML de la columna y lo añade al contenedor principal del tablero Kanban


        });
    }
    static columns() {
        return [
            { id: 1, title: "Not Started" },
            { id: 2, title: "In Progress" },
            { id: 3, title: "Completed" }
        ];
    }
}
