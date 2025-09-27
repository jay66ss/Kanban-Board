/**
 * @jest-environment jsdom
 */
import { jest } from "@jest/globals";

let Kanban;
let KanbanAPI;

beforeAll(async () => {
  // Mock KanbanAPI
  jest.unstable_mockModule("../public/js/api/KanbanAPI.js", () => ({
    default: {
      getItems: jest.fn(),
      insertItem: jest.fn(),
      updateItem: jest.fn(),
      deleteItem: jest.fn()
    }
  }));

  // Importa KanbanAPI después de mockear
  KanbanAPI = (await import("../public/js/api/KanbanAPI.js")).default;

  // Mock DropZone para no depender del DOM real
  jest.unstable_mockModule("../public/js/view/DropZone.js", () => ({
    default: class {
      static createDropZone() {
        const div = document.createElement("div");
        div.classList.add("kanban__dropzone");
        return div;
      }
    }
  }));

  // Importa Kanban dinámicamente después de los mocks
  Kanban = (await import("../public/js/view/Kanban.js")).default;
});

describe("Kanban Board Frontend", () => {
  let root;

  beforeEach(() => {
    document.body.innerHTML = `<div class="kanban"></div>`;
    root = document.querySelector(".kanban");

    // Mock implementaciones
    KanbanAPI.getItems.mockResolvedValue([
      { id: 11, content: "Item 1-1" },
      { id: 12, content: "Item 1-2" }
    ]);

    KanbanAPI.insertItem.mockImplementation(async (columnId, content) => ({
      id: 99,
      content,
      columnId,
      position: 0
    }));

    KanbanAPI.updateItem.mockResolvedValue();
    KanbanAPI.deleteItem.mockResolvedValue();
  });

  test("Renderiza 3 columnas", () => {
    new Kanban(root);
    expect(document.querySelectorAll(".kanban__column")).toHaveLength(3);
  });

  
  test("Click en 'Add' llama a insertItem y agrega un item al DOM", async () => {
    new Kanban(root);
    await new Promise(process.nextTick);
    const addButton = document.querySelector(".kanban__column .kanban__add-item");
    addButton.click();
    await new Promise(process.nextTick);

    expect(KanbanAPI.insertItem).toHaveBeenCalled();
    const newItem = document.querySelector(`[data-id="99"]`);
    expect(newItem).not.toBeNull();
  });

  test("Editar item y hacer blur llama a updateItem", async () => {
    new Kanban(root);
    await new Promise(process.nextTick);
    const itemInput = document.querySelector(".kanban__item-input");
    itemInput.textContent = "Nuevo contenido";

    itemInput.dispatchEvent(new Event("blur"));
    expect(KanbanAPI.updateItem).toHaveBeenCalled();
  });

  
});
