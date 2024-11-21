export function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

export function getStatusOptions(currentStatus) {
    const allStatuses = ['unfinished', 'finished'];
    return allStatuses.filter(status => status !== currentStatus);

}

export function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toast-container');
    const toast = document.createElement('div');
    const toastClass = type === 'success' ? 'bg-success' : 'bg-danger';
    
    toast.classList.add('toast', 'align-items-center', 'text-white', toastClass, 'border-0');
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');

    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">${message}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    const toastInstance = new bootstrap.Toast(toast);
    toastInstance.show();
}
