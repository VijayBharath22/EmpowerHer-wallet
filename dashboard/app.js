import { initializeLocalStorage, addTransaction, addGoal, addForumPost } from './data.js';
import { showModal, hideModal, showNotification, updateDashboard as updateUIDashboard } from './ui.js';

// Global state
const state = {
    currentUser: null,
    darkMode: false,
};

function updateDashboard() {
    // This function orchestrates all UI updates.
    updateUIDashboard();
}

// Event Handlers
function handleAddTransaction(event, type) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    data.amount = parseFloat(data.amount);

    // --- Validation ---
    if (isNaN(data.amount) || data.amount <= 0) {
        showNotification('Amount must be greater than 0', 'error');
        return;
    }
    if (!data.date) {
        showNotification('Please select a date', 'error');
        return;
    }
    if (!data.category || data.category.trim() === '') {
        showNotification('Please choose a category', 'error');
        return;
    }

    addTransaction(type, data);
    hideModal(`${type.slice(0, -1)}Modal`);
    updateDashboard();
    showNotification(`New ${type.slice(0, -1)} added successfully!`);
    form.reset();
}


function handleAddGoal(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    data.target = parseFloat(data.target);

    // --- Validation ---
    if (!data.name || data.name.trim() === '') {
        showNotification('Goal name cannot be empty', 'error');
        return;
    }
    if (isNaN(data.target) || data.target <= 0) {
        showNotification('Target amount must be greater than 0', 'error');
        return;
    }
    if (!data.deadline) {
        showNotification('Please select a deadline date', 'error');
        return;
    }

    addGoal(data);
    hideModal('goalModal');
    updateDashboard();
    showNotification('New goal added successfully!');
    form.reset();
}


function handleAddForumPost(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // --- Validation ---
    if (!data.author || data.author.trim() === '') {
        showNotification('Author name cannot be empty', 'error');
        return;
    }
    if (!data.content || data.content.trim() === '') {
        showNotification('Post content cannot be empty', 'error');
        return;
    }

    addForumPost(data);
    hideModal('forumModal');
    updateDashboard();
    showNotification('Your story has been shared successfully!');
    form.reset();
}


// Setup Event Listeners
function setupEventListeners() {
    // Use event delegation for modal triggers for robustness
    document.body.addEventListener('click', function(event) {
        const addIncomeBtn = event.target.closest('.income .add-btn');
        const addExpenseBtn = event.target.closest('.expenditure .add-btn');
        const addForumPostBtn = event.target.closest('.forum .add-btn');
        const addChallengeBtn = event.target.closest('.challenges .add-btn');
        const addVaultBtn = event.target.closest('.hervault .add-btn');

        if (addIncomeBtn) showModal('incomeModal');
        if (addExpenseBtn) showModal('expenseModal');
        if (addForumPostBtn) showModal('forumModal');
        if (addChallengeBtn) showModal('challengeModal');
        if (addVaultBtn) showModal('vaultAddModal');
    });

    // Use event delegation for form submissions
    document.body.addEventListener('submit', function(event) {
        if (event.target.id === 'incomeForm') handleAddTransaction(event, 'incomes');
        if (event.target.id === 'expenseForm') handleAddTransaction(event, 'expenses');
        if (event.target.id === 'goalForm') handleAddGoal(event);
        if (event.target.id === 'forumForm') handleAddForumPost(event);
    });
}
function setupActiveNav() {
    const navLinks = document.querySelectorAll('.nav-links a');

    // Click event for each link
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            // Remove active from all links
            navLinks.forEach(l => l.classList.remove('active'));
            // Add active to clicked one
            this.classList.add('active');
        });
    });

    // Set active link when page loads or hash changes
    function setActiveFromHash() {
        const hash = window.location.hash || '#';
        navLinks.forEach(link => {
            const linkHash = link.getAttribute('href');
            link.classList.toggle('active', linkHash === hash);
        });
    }

    window.addEventListener('hashchange', setActiveFromHash);
    setActiveFromHash(); // run on page load
}

function setupThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');

    // Load saved preference
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
}

// Initialize the application
function init() {
    initializeLocalStorage();
    updateDashboard();
    setupEventListeners();
    setupActiveNav();
    setupThemeToggle(); // <-- add here
}



// Run the app
document.addEventListener('DOMContentLoaded', init);
