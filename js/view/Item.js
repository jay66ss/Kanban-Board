import KanbanAPI from "../api/KanbanAPI.js";

export default class Item {
    constructor(id, content) {
        this.elements = {};
        this.elements.root = Item.createRoot();
        this.elements.input = this.elements.root.querySelector(".kanban__item-input");

        this.elements.root.dataset.id = id;
        this.elements.input.textContent = content;

        // We need a reference for the current content value
        this.content = content;

        // We want the user to have the ability of updating the content of an item
        // User clicks on the content to edit it and then clicks away -> onBlur event
        const onBlur = () => {
            const newContent = this.elements.input.textContent.trim();

            // Now we must check if the value has changed. If it changed -> Update it
            
            if (newContent == this.content) {
                return;
            }
            this.content = newContent;
            KanbanAPI.updateItem(id, {
                content: this.content
            });
        
        
            console.log(this.content); //Log the old and new content
            console.log(newContent);
            
        }; 

        this.elements.input.addEventListener("blur", onBlur);
        this.elements.root.addEventListener("dblclick", () => {
            const check = confirm("Are you sure you want to delete this item?");
            if (check) {
                KanbanAPI.deleteItem(id);


                this.elements.input.removeEventListener("blur", onBlur);
                this.elements.root.parentElement.removeChild(this.elements.root); // We're going to the parents (the column) and we say: lets remove the child elements of this element

            }
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
