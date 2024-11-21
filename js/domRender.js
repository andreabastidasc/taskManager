import { fetchTasks, updateTaskStatus } from "./taskOperations.js";

import { COLORS } from "./colors.js";
import { setupModalHandlers } from "./modals.js";

function getTaskIcon(status) {
    if (status === 'finished') {
        return `<i class="bi bi-check-circle" style="font-size: 1.5rem; color: ${COLORS.darkGreen};"></i>`;
    }

    return `<i class="bi bi-clock" style="font-size: 1.5rem; color: ${COLORS.orange};"></i>`;
}

export function displayTasks(tasks) {
    const tasksContainer = document.getElementById('tasks-container');
    tasksContainer.innerHTML = '';
    console.log('DISPLAY TASKS')

    tasks.forEach(task => {
        const taskElement = createTaskElement(task);
        tasksContainer.appendChild(taskElement);
    });

    attachStatusDropdownListeners();
}

function createTaskElement(task) {
    const taskElement = document.createElement('div');
    const icon = getTaskIcon(task.status);
    const statusDropdown = createStatusDropdown(task);

    taskElement.classList.add('task_card', 'col-12', 'rounded', `task_card--${task.status}`);
    taskElement.innerHTML = `
        ${createTaskContent(task, icon, statusDropdown)}
    `;

    return taskElement;
}

function formatDate(dateString) {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}

function createTaskContent(task, icon, statusDropdown) {
    const taskDate = formatDate(task.createdAt);

    return `
        <div class="task_card__content">
            <h5 class="m-0">${task.title}</h5>
            <p class="m-0 mt-2">
                <strong>Description:</strong> 
                ${task.description}
            </p>
            <div class="d-flex align-items-center gap-2">
                ${statusDropdown}
                ${icon}
                ${taskDate}
            </div>
        </div>
    `;
}

function createStatusDropdown(task) {
    const selectColor = task.status === 'finished' ? COLORS.darkGreen : COLORS.orange;
    const dropdownId = `statusDropdown-${task.id}`;
    const statusOptions = getStatusOptions(task.status)
        .map(status => `
            <li>
                <a 
                    class="dropdown-item status-option text-white" 
                    data-task-id="${task.id}" 
                    data-status="${status}"
                    href="#"
                >
                   ${status}
                </a>
            </li>
        `).join('');

    return `
        <div class="dropend">
            <button 
                class="btn btn-sm dropdown-toggle" 
                type="button" 
                style="
                    color: ${selectColor}; 
                    border-color: ${selectColor}; 
                    font-size: 1rem; 
                    text-transform: capitalize
                "
                id="${dropdownId}" 
                data-bs-toggle="dropdown" 
                aria-expanded="false"
            >
                ${task.status}
            </button>
            <ul 
                class="dropdown-menu text-white" 
                aria-labelledby="${dropdownId}"
                style="background-color: ${selectColor}; color: #FFFFFF;"
            >
                ${statusOptions}
            </ul>
        </div>
    `;
}

function getStatusOptions(currentStatus) {
    const allStatuses = ['unfinished', 'finished'];
    return allStatuses.filter(status => status !== currentStatus);
}

function attachStatusDropdownListeners() {
    const statusOptions = document.querySelectorAll('.status-option');

    statusOptions.forEach(option => {
        option.addEventListener('click', async (event) => {
            event.preventDefault();
            const taskId = option.getAttribute('data-task-id');
            const newStatus = option.getAttribute('data-status');

            await updateTaskStatus(taskId, newStatus);

            await fetchTasks();
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    setupModalHandlers();
});