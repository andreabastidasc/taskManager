import { createTask } from "./taskOperations.js";

export function setupModalHandlers() {
    const formModal = document.getElementById('form-modal');
    const modalTitle = formModal.querySelector('.modal-title');
    const modalBody = formModal.querySelector('.modal-body');
    const saveButton = formModal.querySelector('.btn-primary');

    document.addEventListener('click', (event) => {
        if (event.target.matches('[data-bs-toggle="modal"]')) {
            const action = event.target.getAttribute('data-action');
            handleModalAction(action, modalTitle, modalBody, saveButton, formModal);
        }
    });
}

function handleModalAction(action, modalTitle, modalBody, saveButton, formModal) {
    if (action === 'create') {
        setupCreateTaskModal(modalTitle, modalBody, saveButton, formModal);
    }
}

function setupCreateTaskModal(modalTitle, modalBody, saveButton, formModal) {
    modalTitle.textContent = 'Create a New Task';
    modalBody.innerHTML = `
        <form id="taskForm">
            <div class="mb-3">
                <label for="taskTitle" class="form-label">Task Title</label>
                <input type="text" class="form-control" id="taskTitle" required>
            </div>
            <div class="mb-3">
                <label for="taskDescription" class="form-label">Task Description</label>
                <textarea class="form-control" id="taskDescription" rows="3" required></textarea>
            </div>
        </form>
    `;
    saveButton.textContent = 'Create Task';
    saveButton.onclick = async () => handleCreateTask(formModal);
}

async function handleCreateTask(formModal) {
    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskDescription').value;

    const task = {
        title,
        description,
        status: 'unfinished',
        createdAt: new Date().toISOString(),
    };

    await createTask(task);
    closeModal(formModal);
}

function closeModal(formModal) {
    const modalInstance = bootstrap.Modal.getInstance(formModal);
    modalInstance.hide();
}

