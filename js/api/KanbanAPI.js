// All the code for the local storage components
export default class KanbanAPI {
    static getItems(columnId) {
        const column = read().find(column => column.id == columnId);
        if (!column) {
            return [];
        }
        return column.items;
    }

    static insertItem(columnId, content) {
        const data = read();
        const column = data.find(column => column.id == columnId); //resave data constant into our local storage
        const item = {
            id: Math.floor(Math.random() * 1000000),
            content
        };

        if (!column) {
            throw new Error("Column does not exist.");
        }
        
        column.items.push(item);
        save(data);
        return item;

    }

    static updateItem(itemId, newProps) {
        const data = read();
        const [item, currentColumn] = (() => {
            for (const column of data) {
                const item = column.items.find(item => item.id == itemId);
                if (item) {
                    return [item, column];
                }
            }
        })();   

        if (!item) {
            throw new Error("Item not found.");
        }

        item.content = newProps.content === undefined ? item.content : newProps.content;

        // Update column and position
        if(
           newProps.columnId !== undefined &&
              newProps.position !== undefined 
        ) {
            const targetColumn = data.find(column => column.id == newProps.columnId);
            
            // onsole.log(targetColumn);
            if (!targetColumn) {
                throw new Error("Target column not found.");
            }

            // Delete the item from the current column
            currentColumn.items.splice(currentColumn.items.indexOf(item), 1);
            // Move item into its new column and position. El 0 es que no borre ningun item
            targetColumn.items.splice(newProps.position, 0, item);
            
        } 
        save(data);

        // console.log(item, currentColumn);
    }    
    
    static deleteItem(itemId) {
        const data = read(); // Read data
        for (const column of data) {
            const item = column.items.find(item => item.id == itemId);
            if (item) {
                column.items.splice(column.items.indexOf(item), 1);
            }
        }
        save(data);
    }

}

function read() {
    const json = localStorage.getItem("kanban-data");
    if (!json) {
        return [
            { id: 1, items: [] },
            { id: 2, items: [] },
            { id: 3, items: [] },
        ];
    }
    return JSON.parse(json);

}

function save(data) {
    localStorage.setItem("kanban-data", JSON.stringify(data));
}