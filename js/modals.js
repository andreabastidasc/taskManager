import { createTask } from "./taskOperations.js";

export function setupModalHandlers() {
    const formModal = document.getElementById('form-modal');
    const modalTitle = formModal.querySelector('.modal-title');
    const modalBody = formModal.querySelector('.modal-body');
    const saveButton = formModal.querySelector('.btn-primary');

    const configModal = document.getElementById('config-modal');
    const configModalTitle = configModal.querySelector('.modal-title');
    const configModalBody = configModal.querySelector('.modal-body');
    const configSaveButton = configModal.querySelector('.btn-primary');

    document.addEventListener('click', (event) => {
        if (event.target.matches('[data-bs-toggle="modal"]')) {
            const action = event.target.getAttribute('data-action');
            handleModalAction(
                action, 
                modalTitle, 
                modalBody, 
                saveButton, 
                formModal, 
                configModalTitle, 
                configModalBody, 
                configSaveButton, 
                configModal
            );
        }
    });
}

function handleModalAction(
    action, 
    modalTitle, 
    modalBody, 
    saveButton, 
    formModal, 
    configModalTitle, 
    configModalBody, 
    configSaveButton, 
    configModal
) {
    if (action === 'create') {
        setupCreateTaskModal(modalTitle, modalBody, saveButton, formModal);
    } else if (action === 'settings') {
        setupConfigModal(configModalTitle, configModalBody, configSaveButton, configModal);
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
    
function setupConfigModal(modalTitle, modalBody, saveButton, formModal) {
    modalTitle.textContent = 'Configuration';
    modalBody.innerHTML = `
        <div class="mb-3">
            <label for="voiceSelect" class="form-label">Select Voice</label>
            <select class="form-select" id="voiceSelect"></select>
        </div>
        <div class="mb-3">
            <label for="speedRange" class="form-label">Speech Speed</label>
            <input type="range" class="form-range" id="speedRange" min="-0.9" max="1.2" step="0.1" value="1">
            <div id="speedValue">1</div>
        </div>
    `;

    saveButton.textContent = 'Save Config';
    saveButton.onclick = () => handleConfigSave();

    initializeSpeechSettings();
}

function initializeSpeechSettings() {
    const voiceSelect = document.getElementById('voiceSelect');
    const speedRange = document.getElementById('speedRange');
    const speedValue = document.getElementById('speedValue');

    window.speechSynthesis.onvoiceschanged = () => {
        const voices = window.speechSynthesis.getVoices();

        voiceSelect.innerHTML = '';
        voices.forEach(voice => {
            const option = document.createElement('option');
            option.value = voice.name;
            option.textContent = `${voice.name} (${voice.lang})`;
            voiceSelect.appendChild(option);
        });
        
        const savedVoice = localStorage.getItem('speechVoice') || voices[0]?.name;
        voiceSelect.value = savedVoice;
    };
    speedValue.textContent = speedRange.value;

    speedRange.addEventListener('input', function () {
        speedValue.textContent = speedRange.value;
    });

    const savedSpeed = parseFloat(localStorage.getItem('speechSpeed') || '1');
    speedRange.value = savedSpeed;
    speedValue.textContent = savedSpeed;
}

function handleConfigSave() {
    const language = document.getElementById('voiceSelect').value;
    const speed = parseFloat(document.getElementById('speedRange').value);

    localStorage.setItem('speech-language', language);
    localStorage.setItem('speech-speed', speed);

    closeModal(document.getElementById('config-modal'));
}

function closeModal(formModal) {
    const modalInstance = bootstrap.Modal.getInstance(formModal);
    modalInstance.hide();
}

