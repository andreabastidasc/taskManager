import { preloadVoices, setupModalHandlers } from './modals.js'

import { displayTasks } from './domRender.js';

const formModal = document.getElementById('form-modal');
const configModal = document.getElementById('config-modal');
const offcanvas = document.getElementById('offcanvasNavbar');
const offcanvasInstance = new bootstrap.Offcanvas(offcanvas);
const createTaskButton = document.querySelector('[data-bs-target="#form-modal"]');
const settingsButton = document.querySelector('[data-bs-target="#config-modal"]');

document.addEventListener('DOMContentLoaded', async () => {
    setupModalHandlers();
    displayTasks();

    await preloadVoices();
});

createTaskButton.addEventListener('click', () => {
    if (offcanvasInstance._isShown) {
        offcanvasInstance.hide();
    }
});

settingsButton.addEventListener('click', () => {
    if (offcanvasInstance._isShown) {
        offcanvasInstance.hide();
    }
});

formModal.addEventListener('hidden.bs.modal', function () {
    document.body.classList.remove("modal-open");
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) {
        backdrop.remove();
    }
});

configModal.addEventListener('hidden.bs.modal', function () {
    document.body.classList.remove("modal-open");
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) {
        backdrop.remove();
    }
});
