function getTaskIcon(status) {
    if (status === 'finished') {
        return `<i class="bi bi-check-circle" style="font-size: 1.5rem; color: ${COLORS.darkGreen};"></i>`;
    }

    return `<i class="bi bi-clock" style="font-size: 1.5rem; color: ${COLORS.orange};"></i>`;
}

function displayTasks(tasks) {
    const tasksContainer = document.getElementById('tasks-container');

    tasksContainer.innerHTML = '';

    tasks.forEach(task => {
        const taskElement = document.createElement('div');
        const icon = getTaskIcon(task.status);
        const playButtonColor = task.status === 'unfinished' ? COLORS.orange : COLORS.darkGreen
        const playButton = `<i class="bi bi-play" style="font-size: 3rem; color: ${playButtonColor}; cursor: pointer;"></i>`;

        taskElement.classList.add('task_card', 'col-12', 'rounded', `task_card--${task.status}`);

        taskElement.innerHTML = `
            <div class="task_card__content">
                <h5 class="m-0">${task.title}</h5>
                <p class="m-0 mt-2"><strong>Description:</strong> ${task.description}</p>
                <div class="d-flex align-items-center gap-2">
                    <p class="m-0"><strong>Status:</strong> ${task.status}</p>
                    ${icon}
                </div>
                
            </div>
            <button class="task_card__button task_card_button--${task.status}">
                ${playButton}
            </button>
        `;

        tasksContainer.appendChild(taskElement);
    });
}
