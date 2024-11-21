import { createTask } from "./taskOperations.js";

export let availableVoices = [];

export function preloadVoices() {
    return new Promise((resolve, reject) => {
        const synth = window.speechSynthesis;
        const checkVoices = setInterval(() => {
            const voices = synth.getVoices();
            if (voices.length !== 0) {
                clearInterval(checkVoices);
                availableVoices = voices;
                resolve(voices);
            }
        }, 10);

        setTimeout(() => {
            clearInterval(checkVoices);
            if (availableVoices.length === 0) {
                console.warn("Voices failed to load. Ensure browser support for SpeechSynthesis.");
            }
            resolve(availableVoices);
        }, 5000);
    });
}

export function setupModalHandlers() {
    document.addEventListener("click", (event) => {
        if (event.target.matches("[data-bs-toggle='modal']")) {
            const action = event.target.getAttribute("data-action");
            handleModalAction(action);
        }
    });
}

function handleModalAction(action) {
    if (action === "create") {
        setupCreateTaskModal();
    } else if (action === "settings") {
        setupConfigModal();
    }
}

function setupCreateTaskModal() {
    const formModal = document.getElementById("form-modal");
    updateModalContent(
        formModal,
        "Create a New Task",
        `
            <form id="taskForm">
                <div class="mb-3">
                    <label for="taskTitle" class="form-label">Task Title</label>
                    <input type="text" class="form-control" id="taskTitle" required>
                </div>
                <div class="mb-3">
                    <label for="taskDescription" class="form-label">Task Description</label>
                    <textarea class="form-control" id="taskDescription" rows="3" required></textarea>
                </div>
                <div class="mb-3">
                    <label for="taskStatus" class="form-label">Task Status</label>
                    <select class="form-control" id="taskStatus" required>
                        <option value="unfinished">Unfinished</option>
                        <option value="finished">Finished</option>
                    </select>
                </div>
            </form>
        `,
        "Create Task",
        async () => handleCreateTask(formModal)
    );

    disableSubmitButton(formModal);
    addInputEventListeners(formModal);
}

function disableSubmitButton(formModal) {
    const saveButton = formModal.querySelector('.btn-primary');
    saveButton.disabled = true;
}

function addInputEventListeners(formModal) {
    const taskTitle = formModal.querySelector('#taskTitle');
    const taskDescription = formModal.querySelector('#taskDescription');
    const saveButton = formModal.querySelector('.btn-primary');

    taskTitle.addEventListener('input', () => toggleSubmitButton(taskTitle, taskDescription, saveButton));
    taskDescription.addEventListener('input', () => toggleSubmitButton(taskTitle, taskDescription, saveButton));
}

function toggleSubmitButton(taskTitle, taskDescription, saveButton) {
    saveButton.disabled = !taskTitle.value || !taskDescription.value;
}

async function handleCreateTask(formModal) {
    const title = document.getElementById("taskTitle").value;
    const description = document.getElementById("taskDescription").value;
    const taskStatus = formModal.querySelector('#taskStatus').value;

    const task = {
        title,
        description,
        status: taskStatus,
        createdAt: new Date().toISOString(),
    };

    await createTask(task);
    closeModal(formModal);
}

function setupConfigModal() {
    const configModal = document.getElementById("config-modal");
    updateModalContent(
        configModal,
        "Configuration",
        `
            <div class="mb-3">
                <label for="voiceSelect" class="form-label">Select Voice</label>
                <select class="form-select" id="voiceSelect"></select>
            </div>
            <div class="mb-3">
                <label for="speedRange" class="form-label">Speech Speed</label>
                <input type="range" class="form-range" id="speedRange" min="-0.9" max="1.2" step="0.1" value="1">
                <div id="speedValue">1</div>
            </div>
        `,
        "Save Config",
        handleConfigSave
    );

    initializeSpeechSettings();
}

function initializeSpeechSettings() {
    const voiceSelect = document.getElementById("voiceSelect");
    const speedRange = document.getElementById("speedRange");
    const speedValue = document.getElementById("speedValue");

    voiceSelect.innerHTML = "";
    availableVoices.forEach((voice) => {
        const option = document.createElement("option");
        option.value = voice.name;
        option.textContent = `${voice.name} (${voice.lang})`;
        voiceSelect.appendChild(option);
    });

    const savedVoice = localStorage.getItem("speech-language") || availableVoices[0]?.name;
    const savedSpeed = parseFloat(localStorage.getItem("speech-speed")) || 1;

    if (savedVoice) {
        voiceSelect.value = savedVoice;
    }
    speedRange.value = savedSpeed;
    speedValue.textContent = savedSpeed;

    speedRange.addEventListener("input", () => {
        speedValue.textContent = speedRange.value;
    });
}

function handleConfigSave() {
    const language = document.getElementById("voiceSelect").value;
    const speed = parseFloat(document.getElementById("speedRange").value);

    localStorage.setItem("speech-language", language);
    localStorage.setItem("speech-speed", speed);

    closeModal(document.getElementById("config-modal"));
}

function updateModalContent(modal, title, body, buttonText, buttonHandler) {
    const modalTitle = modal.querySelector(".modal-title");
    const modalBody = modal.querySelector(".modal-body");
    const saveButton = modal.querySelector(".btn-primary");

    modalTitle.textContent = title;
    modalBody.innerHTML = body;
    saveButton.textContent = buttonText;

    saveButton.onclick = buttonHandler;

    const modalInstance = new bootstrap.Modal(modal);
    modalInstance.show();
}

function closeModal(modal) {
    const modalInstance = bootstrap.Modal.getInstance(modal);
    if (modalInstance) {
        modalInstance.hide();
    }

}

