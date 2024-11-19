function getTaskIcon(status) {
    if (status === 'unfinished') {
        return `<i class="bi bi-clock" style="font-size: 1.5rem; color: ${COLORS.yellow};"></i>`;
    } else if (status === 'finished') {
        return `<i class="bi bi-check-circle" style="font-size: 1.5rem; color: ${COLORS.green};"></i>`;
    }

    return `<i class="bi bi-question-circle" style="font-size: 1.5rem; color: #d9534f;"></i>`;
}

function displayTasks(tasks) {
    const tasksContainer = document.getElementById('tasks-container');

    tasksContainer.innerHTML = '';

    tasks.forEach(task => {
        const taskElement = document.createElement('div');
        const icon = getTaskIcon(task.status);
        const playButton = `<i class="bi bi-play" style="font-size: 3rem; color: ${COLORS.primaryBlue}; cursor: pointer;"></i>`;
        const taskStatusClass = task.status === 'unfinished' ? 'task_card--unfinished' : 'task_card--finished';

        taskElement.classList.add('task_card', 'col-12', 'rounded', taskStatusClass);

        taskElement.innerHTML = `
            <div class="task_card__content">
                <h5 class="m-0">${task.title}</h5>
                <p class="m-0 mt-2"><strong>Description:</strong> ${task.description}</p>
                <p class="m-0"><strong>Status:</strong> ${task.status} ${icon}</p>
            </div>
            <button class="task_card__button">
                ${playButton}
            </button>
        `;

        tasksContainer.appendChild(taskElement);
    });
}
