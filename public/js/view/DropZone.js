import KanbanAPI from "../api/KanbanAPI.js";

export default class DropZone {
    static createDropZone() {
        const range = document.createRange();
        range.selectNode(document.body);

        const dropZone = range.createContextualFragment(`
            <div class="kanban__dropzone"></div>
        `).children[0];

        // Drag over
        dropZone.addEventListener("dragover", e => {
            e.preventDefault();
            dropZone.classList.add("kanban__dropzone-active");
        });

        dropZone.addEventListener("dragleave", () => {
            dropZone.classList.remove("kanban__dropzone-active");
        });

        // Drop
dropZone.addEventListener("drop", async e => {
    e.preventDefault();
    dropZone.classList.remove("kanban__dropzone-active");

    const columnElement = dropZone.closest(".kanban__column");
    const columnId = Number(columnElement.dataset.id);
    const itemId = Number(e.dataTransfer.getData("text/plain"));
    const droppedItemElement = document.querySelector(`[data-id='${itemId}']`);

    if (droppedItemElement.contains(dropZone)) return;

    // Determinar dónde insertar
    let referenceNode;
    if (dropZone.parentElement.classList.contains("kanban__item")) {
        referenceNode = dropZone.parentElement.nextSibling;
    } else {
        referenceNode = columnElement.querySelector(".kanban__column-items").firstChild;
    }

    columnElement.querySelector(".kanban__column-items")
        .insertBefore(droppedItemElement, referenceNode);

    // Recalcular posición real según items visibles
    const items = Array.from(columnElement.querySelectorAll(".kanban__item"));
    const newPosition = items.indexOf(droppedItemElement);

    await KanbanAPI.updateItem(itemId, { columnId, position: newPosition });
});


        return dropZone;
    }
}
