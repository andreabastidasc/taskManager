import { availableVoices } from "./modals.js";

export function playTaskSpeech(title, description) {
    stopSpeaking();

    const utterance = new SpeechSynthesisUtterance();
    const language = localStorage.getItem('speech-language');
    const speed = parseFloat(localStorage.getItem('speech-speed')) || 1;

    utterance.text = `Task Title: ${title}. Task Description: ${description}`;
    utterance.rate = speed;

    if (availableVoices.length === 0) {
        console.warn("No voices loaded yet.");
    } else {
        const selectedVoice = availableVoices.find(voice => voice.name === language);
        if (selectedVoice) {
            utterance.voice = selectedVoice;
        } else {
            console.warn("Selected voice not found. Using default voice.");
        }
    }

    window.speechSynthesis.speak(utterance);
}

function stopSpeaking() {
    if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
    }
}
