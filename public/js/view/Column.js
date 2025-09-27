import KanbanAPI from "../api/KanbanAPI.js";
import Item from "./Item.js";
import DropZone from "./DropZone.js";

export default class Column {
    constructor(id, title) {
        const topDropZone = DropZone.createDropZone();

        this.elements = {};
        this.elements.root = Column.createRoot();
        this.elements.title = this.elements.root.querySelector(".kanban__column-title");
        this.elements.items = this.elements.root.querySelector(".kanban__column-items");
        this.elements.addItem = this.elements.root.querySelector(".kanban__add-item");

        // Display the name of the column and its unique ID
        this.elements.root.dataset.id = id;
        this.elements.title.textContent = title;
        this.elements.items.appendChild(topDropZone);

        // Click handler para añadir items
        this.elements.addItem.addEventListener("click", async () => {
            try {
                const columnId = Number(id); // fuerza a número
                const newItem = await KanbanAPI.insertItem(columnId, "", 0); // posición inicial 0
                this.renderItem(newItem);
            } catch (error) {
                console.error("Error adding item:", error);
            }
        });

        // Cargar items existentes
        (async () => {
            try {
                const columnId = Number(id);
                const items = await KanbanAPI.getItems(columnId);
                items.forEach(item => this.renderItem(item));
            } catch (error) {
                console.error("Error loading items:", error);
            }
        })();
    }

    static createRoot() {
        const range = document.createRange();
        range.selectNode(document.body);
        return range.createContextualFragment(`
            <div class="kanban__column">
                <div class="kanban__column-title"></div>
                <div class="kanban__column-items"></div>
                <button class="kanban__add-item" type="button">+ Add</button>
            </div>
        `).children[0];
    }

    renderItem(data) {
        const item = new Item(data.id, data.content);
        this.elements.items.appendChild(item.elements.root);
    }
}
