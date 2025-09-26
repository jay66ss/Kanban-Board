import KanbanAPI from "../api/KanbanAPI.js";
import Item from "./Item.js";
import DropZone from "./DropZone.js";

export default class Column {
    constructor(id, title) {
        // Constructor logic here

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

        // When the user clicks on the Add button, we want to create a new item in that column

        this.elements.addItem.addEventListener("click", () => {
            const newItem = KanbanAPI.insertItem(id, ""); // Starting item content: empty
            this.renderItem(newItem);
        });

        KanbanAPI.getItems(id).forEach(item => {
            // console.log(item);
            this.renderItem(item);

        });
    }

    static createRoot() {
        // Returns an HTML element as an object containing the basic structure of a column
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

    renderItem(data){
        const item = new Item(data.id, data.content);
        this.elements.items.appendChild(item.elements.root);
    }
}