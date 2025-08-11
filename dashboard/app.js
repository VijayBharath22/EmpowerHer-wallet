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

// Initialize the application
function init() {
    initializeLocalStorage();
    updateDashboard();
    setupEventListeners();
}

// Run the app
document.addEventListener('DOMContentLoaded', init);
