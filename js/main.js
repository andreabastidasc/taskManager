import { displayTasks } from './domRender.js';
import { setupModalHandlers } from './modals.js'

document.addEventListener('DOMContentLoaded', () => {
    setupModalHandlers();
    displayTasks();
});
