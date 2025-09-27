import Column from "./Column.js";

export default class Kanban {
    constructor(root) {
        this.root = root;


        Kanban.columns().forEach(column => {
            const columnView = new Column(column.id, column.title);
            this.root.appendChild(columnView.elements.root); // Adds the column to the main Kanban board


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
