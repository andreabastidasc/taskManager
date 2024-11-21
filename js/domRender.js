import { fetchTasks, updateTaskStatus } from "./taskOperations.js";
import { formatDate, getStatusOptions } from "./utils.js";

import { COLORS } from "./colors.js";
import { playTaskSpeech } from "./speech.js";

export async function displayTasks() {
    const tasks = await fetchTasks();
    const tasksContainer = document.getElementById('tasks-container');
    tasksContainer.innerHTML = '';

    tasks.forEach(task => {
        const taskElement = createTaskElement(task);
        tasksContainer.appendChild(taskElement);
    });

    attachEventListeners();
}

function createTaskElement(task) {
    const icon = getTaskIcon(task.status);
    const statusDropdown = createStatusDropdown(task);
    const playButton = createPlayButton(task);

    const taskElement = document.createElement('div');
    taskElement.classList.add('task_card', 'col-12', 'rounded', `task_card--${task.status}`);
    taskElement.innerHTML = `
        ${createTaskContent(task, icon, statusDropdown)}
        ${playButton}
    `;

    return taskElement;
}

function createTaskContent(task, icon, statusDropdown) {
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
                ${formatDate(task.createdAt)}
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

function createPlayButton(task) {
    const playButtonColor = task.status === 'unfinished' ? COLORS.orange : COLORS.darkGreen;
    return `
        <button 
            class="task_card__button task_card_button--${task.status}" 
            data-task-id="${task.id}" 
            data-task-title="${task.title}" 
            data-task-description="${task.description}"
        >
            <i class="bi bi-play" style="font-size: 3rem; color: ${playButtonColor}; cursor: pointer;"></i>
        </button>
    `;
}

function attachEventListeners() {
    attachStatusDropdownListeners();
    attachPlayTaskListeners();
}

function attachStatusDropdownListeners() {
    const statusOptions = document.querySelectorAll('.status-option');

    statusOptions.forEach(option => {
        option.addEventListener('click', async (event) => {
            event.preventDefault();
            const taskId = option.getAttribute('data-task-id');
            const newStatus = option.getAttribute('data-status');

            await updateTaskStatus(taskId, newStatus);
            await displayTasks();
        });
    });
}

function attachPlayTaskListeners() {
    const playButtons = document.querySelectorAll('.task_card__button');

    playButtons.forEach(button => {
        button.addEventListener('click', () => {
            const taskTitle = button.getAttribute('data-task-title');
            const taskDescription = button.getAttribute('data-task-description');
            playTaskSpeech(taskTitle, taskDescription);
        });
    });
}


function getTaskIcon(status) {
    if (status === 'finished') {
        return `<i class="bi bi-check-circle" style="font-size: 1.5rem; color: ${COLORS.darkGreen};"></i>`;
    }
    return `<i class="bi bi-clock" style="font-size: 1.5rem; color: ${COLORS.orange};"></i>`;
}
