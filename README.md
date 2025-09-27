# Kanban-Board
This is an interactive Kanban board built with pure JavaScript, CSS, and HTML. It lets you organize tasks into columns, drag them between columns and also edit them. All changes are automatically saved in the browser’s localStorage, so your tasks persist even if you close the page.
How to Use:

Terminal: node server.js
-Columns
The board has three default columns:
    Not Started – tasks that haven’t been started yet.
    In Progress – tasks currently being worked on.
    Completed – finished tasks.
Each column has a +Add button to create a new empty item.
-Items
Each item represents a task.
-> To edit an item: click on the item content to modify it.
Changes are saved automatically when you click outside the item.
-> To delete an item: double-click on an item and confirm the deletion.
-> Drag & Drop
Drag items to any position within the same column or to another column.
When dropped, the position is updated automatically.
Each item has “dropzones” above and below to help place it exactly where you want.


-Requirements
Modern browser with ES6 Module support (Safari, Firefox, Edge, or Google Chrome).

-Dependencies: 
npm install
node server.js
