import KanbanAPI from "../api/KanbanAPI.js";

export default class DropZone {
    static createDropZone() {
        const range = document.createRange();
        range.selectNode(document.body);

        const dropZone = range.createContextualFragment(`
            <div class="kanban__dropzone"></div>
        `).children[0];

        // Once we have a DropZone, we need to add the CSS class of active to give the user the impression that they can drop there
        dropZone.addEventListener("dragover", e => {
            e.preventDefault(); // We prevent the default behavior of the browser (as for example, displaying the Id when dragging, copy and paste, etc)
            dropZone.classList.add("kanban__dropzone-active");
        });

        dropZone.addEventListener("dragleave", () => {
            dropZone.classList.remove("kanban__dropzone-active");
        });

        dropZone.addEventListener("drop", e => {
            //When the user drops into a dropzone
            e.preventDefault(); // We prevent the default behavior of the browser (as for example, displaying the Id when dragging, copy and paste, etc)
            dropZone.classList.remove("kanban__dropzone-active");

            const columnElement = dropZone.closest(".kanban__column"); // Gives the HTML element for the column which this dropzone is inside of
            const columnId = Number(columnElement.dataset.id); // We get the ID of the column
            const dropZonesInColumn = Array.from(columnElement.querySelectorAll(".kanban__dropzone")); // We get all the dropzones in this column
            const droppedIndex = dropZonesInColumn.indexOf(dropZone); // We get the index of the dropzone that we dropped into
            const itemId = Number(e.dataTransfer.getData("text/plain")); // We get the ID of the item that we are dragging (that we set in the dragstart event listener)
            const droppedItemElement = document.querySelector(`[data-id='${itemId}']`); // We get the HTML element of the item that we are dragging
            const insertAfter = dropZone.parentElement.classList.contains("kanban__item") ? dropZone.parentElement : dropZone; 
            // We insert after the Kanban item itself if the dropzone's parent element is a kanban item, otherwise we insert it after the dropzone (which means at the start of the column) 
            // console.log(insertAfter);
            insertAfter.after(droppedItemElement)

            if (droppedItemElement.contains(dropZone)) {
                return; // If the item contains the dropzone, we don't want to do anything (this is to prevent the user from dropping an item into one of its own dropzones)
            }

            KanbanAPI.updateItem(itemId, {
                columnId,
                position: droppedIndex
            });
                
            
            // REMEMBER: Position is 0 based (first position is 0, second is 1, etc)
           
        });
            
        return dropZone;
    }

}