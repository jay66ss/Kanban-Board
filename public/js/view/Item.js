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

        this.content = content;

        this.elements.root.appendChild(bottomDropZone);

        // Update item content on blur
const onBlur = async () => {
    const newContent = this.elements.input.textContent.trim();
    if (newContent === this.content) return;

    const columnElement = this.elements.root.closest(".kanban__column");
    const columnId = Number(columnElement?.dataset.id);
    const itemsInColumn = Array.from(columnElement.querySelectorAll(".kanban__item"));
    const position = Number(itemsInColumn.indexOf(this.elements.root));

    console.log("Updating item:", {
        id,
        content: newContent,
        columnId,
        position
    });

    if (isNaN(columnId) || isNaN(position)) {
        console.error("columnId or position is not a number!", columnId, position);
        return;
    }

    this.content = newContent;

    try {
        await KanbanAPI.updateItem(id, { content: this.content, columnId, position });
    } catch (error) {
        console.error("Error updating item:", error);
        this.elements.input.textContent = this.content;
    }
};

        this.elements.input.addEventListener("blur", onBlur);

        // Delete item on double-click
        this.elements.root.addEventListener("dblclick", async () => {
            const check = confirm("Are you sure you want to delete this item?");
            if (!check) return;

            try {
                await KanbanAPI.deleteItem(id);
                this.elements.input.removeEventListener("blur", onBlur);
                this.elements.root.parentElement.removeChild(this.elements.root);
            } catch (error) {
                console.error("Error deleting item:", error);
                alert("Failed to delete item. Please try again.");
            }
        });

        // Drag and drop functionality
        this.elements.root.addEventListener("dragstart", e => {
            e.dataTransfer.setData("text/plain", id);
        });

        this.elements.input.addEventListener("drop", e => e.preventDefault());
    }

    static createRoot() {
        const range = document.createRange();
        range.selectNode(document.body);

        return range.createContextualFragment(`
            <div class="kanban__item" draggable="true">
                <div class="kanban__item-input" contenteditable></div>
            </div>
        `).children[0];
    }
}
