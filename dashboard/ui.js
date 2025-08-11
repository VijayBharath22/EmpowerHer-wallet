import { getIncomes, getExpenses, getForumPosts, getGoals, getChallenges } from './data.js';

// --- Modal Functions ---
export function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        const closeHandler = (e) => {
            if (e.target === modal || e.target.closest('.close-modal')) {
                hideModal(modalId);
                modal.removeEventListener('click', closeHandler);
            }
        };
        modal.addEventListener('click', closeHandler);
    }
}

export function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        const form = modal.querySelector('form');
        if (form) form.reset();
    }
}

// --- Notification --- 
export function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }, 100);
}

// --- UI Rendering Functions ---

function updateTotals() {
    const incomes = getIncomes();
    const expenses = getExpenses();
    const totalIncome = incomes.reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
    const balance = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(0) : 0;

    document.querySelector('.income .amount').textContent = `₹${totalIncome.toLocaleString()}`;
    document.querySelector('.expenditure .amount').textContent = `₹${totalExpenses.toLocaleString()}`;
    const balanceEl = document.querySelector('.balance .amount');
    balanceEl.textContent = `₹${balance.toLocaleString()}`;
    balanceEl.classList.toggle('positive', balance >= 0);
    balanceEl.classList.toggle('negative', balance < 0);
    document.querySelector('.balance-details .positive').textContent = `${savingsRate}%`;
}

function updateTransactionLists() {
    const recentIncomes = getIncomes().slice(0, 3);
    const recentExpenses = getExpenses().slice(0, 3);

    const renderList = (items, elementId, type) => {
        const element = document.getElementById(elementId);
        if (!element) return;
        element.innerHTML = items.map(item => `
            <div class="transaction">
                <div class="transaction-header">
                    <span class="amount ${type}">₹${item.amount.toLocaleString()}</span>
                    <span class="date">${new Date(item.date).toLocaleDateString()}</span>
                </div>
                <div class="transaction-details">
                    <span class="category">${item.category}</span>
                    ${item.note ? `<span class="note">${item.note}</span>` : ''}
                </div>
            </div>
        `).join('');
    };

    renderList(recentIncomes, 'recentIncome', 'positive');
    renderList(recentExpenses, 'recentExpenses', 'negative');
}

function updateForumPosts() {
    const posts = getForumPosts().slice(0, 3);
    const forumEl = document.getElementById('forumPosts');
    if (!forumEl) return;
    forumEl.innerHTML = posts.map(post => `
        <div class="forum-post">
            <div class="post-header">
                <strong>${post.author}</strong>
                <span class="date">${new Date(post.date).toLocaleDateString()}</span>
            </div>
            <p class="post-content">${post.content}</p>
            <div class="post-footer">
                <button class="like-btn"><i class="fas fa-heart"></i> ${post.likes}</button>
                <button class="comment-btn"><i class="fas fa-comment"></i> ${post.comments.length}</button>
            </div>
        </div>
    `).join('');
}

let balanceChart = null;
function initializeBalanceChart() {
    const ctx = document.getElementById('balanceChart').getContext('2d');
    const incomes = getIncomes();
    const expenses = getExpenses();

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const incomeData = Array(12).fill(0);
    const expenseData = Array(12).fill(0);

    incomes.forEach(t => { incomeData[new Date(t.date).getMonth()] += t.amount; });
    expenses.forEach(t => { expenseData[new Date(t.date).getMonth()] += t.amount; });
    
    if (balanceChart) {
        balanceChart.data.datasets[0].data = incomeData;
        balanceChart.data.datasets[1].data = expenseData;
        balanceChart.update();
        return;
    }

    balanceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [
                { label: 'Income', data: incomeData, borderColor: 'hsl(333, 100%, 50%)', backgroundColor: 'hsla(333, 100%, 50%, 0.1)', tension: 0.4, fill: true },
                { label: 'Expenses', data: expenseData, borderColor: 'hsl(170, 100%, 40%)', backgroundColor: 'hsla(170, 100%, 40%, 0.1)', tension: 0.4, fill: true }
            ]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, ticks: { callback: value => '₹' + value.toLocaleString() } } }
        }
    });
}

// --- Main Dashboard Update Function ---
export function updateDashboard() {
    updateTotals();
    updateTransactionLists();
    updateForumPosts();
    initializeBalanceChart();
    // Future functions to update goals, challenges, etc. can be added here
}
