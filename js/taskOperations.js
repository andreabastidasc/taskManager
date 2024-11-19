const apiUrl = 'https://673b84ca339a4ce4451c7db4.mockapi.io/api/v1/tasks';

async function fetchTasks() {
    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const tasks = await response.json();
        const sortedTasks = sortTasks(tasks);

        displayTasks(sortedTasks);
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

function sortTasks(tasks) {
    const unfinishedTasks = tasks.filter(task => task.status !== 'finished');
    const finishedTasks = tasks.filter(task => task.status === 'finished');

    unfinishedTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    finishedTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return [...unfinishedTasks, ...finishedTasks];
}

document.addEventListener('DOMContentLoaded', fetchTasks);
