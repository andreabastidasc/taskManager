import { displayTasks } from "./domRender.js";

const apiUrl = 'https://673b84ca339a4ce4451c7db4.mockapi.io/api/v1/tasks';

export async function fetchTasks() {
    try {
        const spinner = document.getElementById('spinner');
        const placeholder = document.getElementById('placeholder');

        if (spinner) {
            spinner.style.display = 'block';
        }

        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const tasks = await response.json();
        const sortedTasks = sortTasks(tasks);

        if (tasks.length === 0 && placeholder) {
            placeholder.style.display = 'block';
        }

        displayTasks(sortedTasks);
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

export async function createTask(task) {
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(task),
        });

        if (!response.ok) {
            throw new Error(`Failed to create task: ${response.statusText}`);
        }

        const newTask = await response.json();

        await fetchTasks();
    } catch (error) {
        console.error('Error creating task:', error);
    }
}

function sortTasks(tasks) {
    const unfinishedTasks = tasks.filter(task => task.status !== 'finished');
    const finishedTasks = tasks.filter(task => task.status === 'finished');

    unfinishedTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    finishedTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return [...unfinishedTasks, ...finishedTasks];
}

export async function updateTaskStatus(taskId, status) {
    try {
        const endDate = status === 'finished' ? new Date().toISOString() : null;

        const updatedTask = {
            status: status,
            endDate: endDate
        };

        const response = await fetch(`${apiUrl}/${taskId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedTask),
        });

        if (!response.ok) throw new Error('Failed to update task status');
    } catch (error) {
        console.error('Error updating task:', error);
    }
}

document.addEventListener('DOMContentLoaded', fetchTasks);
