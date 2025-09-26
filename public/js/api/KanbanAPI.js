// KanbanAPI.js - communicates with backend Node.js + SQLite
export default class KanbanAPI {
    
    static async getItems(columnId) {
        const res = await fetch(`http://localhost:3000/items/${columnId}`);
        return await res.json();
    }

    static async insertItem(columnId, content) {
        const res = await fetch("http://localhost:3000/items", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content, columnId, position: 0 })
        });
        return await res.json();
    }

    static async updateItem(itemId, newProps) {
        await fetch(`http://localhost:3000/items/${itemId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newProps)
        });
    }

    static async deleteItem(itemId) {
        await fetch(`http://localhost:3000/items/${itemId}`, {
            method: "DELETE"
        });
    }
}
