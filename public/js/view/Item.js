import KanbanAPI from "../api/KanbanAPI.js";
import DropZone from "./DropZone.js";

export default class Item {
    constructor(id, content) {
        const bottomDropZone = DropZone.createDropZone();
        
        this.elements = {};
        this.elements.root = Item.createRoot();
        this.elements.input = this.elements.root.querySelector(".kanban__item-input");

        this.elements.root.dataset.id = id;
        this.elements.input.textContent = content;

        // We need a reference for the current content value
        this.content = content;

        this.elements.root.appendChild(bottomDropZone);

        // We want the user to have the ability of updating the content of an item
        // User clicks on the content to edit it and then clicks away -> onBlur event
       const onBlur = async () => {
            const newContent = this.elements.input.textContent.trim();
            if (newContent == this.content) return;
            this.content = newContent;
            await KanbanAPI.updateItem(id, { content: this.content });
        };


        this.elements.input.addEventListener("blur", onBlur);
        this.elements.root.addEventListener("dblclick", async () => {
            const check = confirm("Are you sure you want to delete this item?");
            if (check) {
                await KanbanAPI.deleteItem(id);
                this.elements.input.removeEventListener("blur", onBlur);
                this.elements.root.parentElement.removeChild(this.elements.root);
            }
        });


        // Drag and Drop functionality
        this.elements.root.addEventListener("dragstart", e => {
            e.dataTransfer.setData("text/plain", id); // We set the data that we want to transfer. In this case, the ID of the item (it gets attached)
            
        });
        this.elements.input.addEventListener("drop", e => {
            e.preventDefault(); // We prevent the default behavior of the browser (as for example, displaying the Id when dragging, copy and paste, etc)
        });
    }

    static createRoot(){ // Root for an individual ite
        const range = document.createRange();
        range.selectNode(document.body);

        return range.createContextualFragment(`
            <div class="kanban__item" draggable="true">
                <div class="kanban__item-input" contenteditable></div>
            </div>
        `).children[0];
    }
}
