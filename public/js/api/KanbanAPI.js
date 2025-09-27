// KanbanAPI.js - communicates with backend Node.js + SQLite
export default class KanbanAPI {
    
    static async getItems(columnId) {
        const res = await fetch(`http://localhost:3000/items/${columnId}`);
        if (!res.ok) throw new Error(`Error ${res.status}: ${await res.text()}`);
        return await res.json();
    }

  // KanbanAPI.js
    static async insertItem(columnId, content, position = 0) { // position opcional, default 0
        const res = await fetch("http://localhost:3000/items", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content, columnId, position })
        });
        if (!res.ok) throw new Error(`Error ${res.status}: ${await res.text()}`);
        return await res.json();
    }


    static async updateItem(itemId, newProps) {
        const res = await fetch(`http://localhost:3000/items/${itemId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newProps)
        });
        if (!res.ok) throw new Error(`Error ${res.status}: ${await res.text()}`);
        return await res.json();
    }

    static async deleteItem(itemId) {
        const res = await fetch(`http://localhost:3000/items/${itemId}`, {
            method: "DELETE"
        });
        if (!res.ok) throw new Error(`Error ${res.status}: ${await res.text()}`);
        return await res.json();
    }
}
