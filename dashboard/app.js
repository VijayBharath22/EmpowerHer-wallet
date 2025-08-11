// Global state management
const state = {
    currentUser: null,
    darkMode: false,
    notifications: []
};

// Initialize local storage with sample data if empty
function initializeLocalStorage() {
    const sampleData = {
        incomes: [
            { id: 1, amount: 25000, date: '2025-03-01', category: 'salary', note: 'Monthly salary' },
            { id: 2, amount: 5000, date: '2025-03-05', category: 'investment', note: 'Stock dividends' }
        ],
        expenses: [
            { id: 1, amount: 10000, date: '2025-03-02', category: 'rent', note: 'Monthly rent' },
            { id: 2, amount: 5000, date: '2025-03-04', category: 'groceries', note: 'Weekly groceries' }
        ],
        goals: [
            { id: 1, name: 'Emergency Fund', target: 50000, current: 30000, deadline: '2025-06-01' },
            { id: 2, name: 'Vacation', target: 20000, current: 5000, deadline: '2025-12-01' }
        ],
        forumPosts: [
            { id: 1, author: 'Sarah', content: 'Started my investment journey today!', date: '2025-03-07', likes: 5, comments: [] },
            { id: 2, author: 'Priya', content: 'Completed the No-Spend Week challenge!', date: '2025-03-06', likes: 3, comments: [] }
        ],
        challenges: [
            { id: 1, name: '30-Day Rupee Rise', type: 'saving', current: 15, target: 30, amount: 465 },
            { id: 2, name: 'No-Spend Week', type: 'restriction', current: 5, target: 7, saved: 1000 }
        ],
        vault: [] // Encrypted credentials will be stored here
    };

    Object.entries(sampleData).forEach(([key, value]) => {
        if (!localStorage.getItem(key)) {
            localStorage.setItem(key, JSON.stringify(value));
        }
    });
}

// Balance Chart
function initializeBalanceChart() {
    const ctx = document.getElementById('balanceChart').getContext('2d');
    const incomes = JSON.parse(localStorage.getItem('incomes')) || [];
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];

    // Process data for chart
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const incomeData = months.map(() => Math.floor(Math.random() * 30000 + 20000));
    const expenseData = months.map(() => Math.floor(Math.random() * 20000 + 10000));

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [
                {
                    label: 'Income',
                    data: incomeData,
                    borderColor: getComputedStyle(document.documentElement).getPropertyValue('--primary').trim(),
                    backgroundColor: 'rgba(255, 105, 180, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Expenses',
                    data: expenseData,
                    borderColor: getComputedStyle(document.documentElement).getPropertyValue('--secondary').trim(),
                    backgroundColor: 'rgba(64, 224, 208, 0.1)',
                    tension: 0.4,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `₹${context.raw.toLocaleString()}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: value => '₹' + value.toLocaleString()
                    }
                }
            }
        }
    });
}

// Modal Functions
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        // Add event listener for clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                hideModal(modalId);
            }
        });

        // Add event listener for close button
        const closeBtn = modal.querySelector('.close-modal');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => hideModal(modalId));
        }
    }
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        // Reset form if exists
        const form = modal.querySelector('form');
        if (form) {
            form.reset();
        }
    }
}

// Transaction Management
function addTransaction(type, data) {
    const transactions = JSON.parse(localStorage.getItem(type)) || [];
    const newTransaction = {
        id: Date.now(),
        ...data,
        date: data.date || new Date().toISOString().split('T')[0]
    };
    
    transactions.unshift(newTransaction);
    localStorage.setItem(type, JSON.stringify(transactions));
    updateDashboard();
    showNotification(`New ${type.slice(0, -1)} added successfully!`);
}

// Goals Management
function addGoal(data) {
    const goals = JSON.parse(localStorage.getItem('goals')) || [];
    const newGoal = {
        id: Date.now(),
        ...data,
        current: 0
    };
    
    goals.push(newGoal);
    localStorage.setItem('goals', JSON.stringify(goals));
    updateDashboard();
    showNotification('New goal added successfully!');
}

function updateGoalProgress(goalId, amount) {
    const goals = JSON.parse(localStorage.getItem('goals')) || [];
    const goalIndex = goals.findIndex(g => g.id === goalId);
    
    if (goalIndex !== -1) {
        goals[goalIndex].current += amount;
        if (goals[goalIndex].current >= goals[goalIndex].target) {
            showNotification(`Congratulations! You've achieved your ${goals[goalIndex].name} goal! 🎉`);
        }
        localStorage.setItem('goals', JSON.stringify(goals));
        updateDashboard();
    }
}

// Forum Management
function addForumPost(data) {
    const posts = JSON.parse(localStorage.getItem('forumPosts')) || [];
    const newPost = {
        id: Date.now(),
        ...data,
        date: new Date().toISOString().split('T')[0],
        likes: 0,
        comments: []
    };
    
    posts.unshift(newPost);
    localStorage.setItem('forumPosts', JSON.stringify(posts));
    updateDashboard();
    showNotification('Your story has been shared successfully!');
}

// Challenge Management
function joinChallenge(challengeType) {
    const challenges = JSON.parse(localStorage.getItem('challenges')) || [];
    let newChallenge;
    
    switch (challengeType) {
        case 'rupeeRise':
            newChallenge = {
                id: Date.now(),
                name: '30-Day Rupee Rise',
                type: 'saving',
                current: 1,
                target: 30,
                amount: 0
            };
            break;
        case 'noSpend':
            newChallenge = {
                id: Date.now(),
                name: 'No-Spend Week',
                type: 'restriction',
                current: 0,
                target: 7,
                saved: 0
            };
            break;
    }
    
    if (newChallenge) {
        challenges.push(newChallenge);
        localStorage.setItem('challenges', JSON.stringify(challenges));
        updateDashboard();
        showNotification(`You've joined the ${newChallenge.name} challenge!`);
    }
}

// HerVault Management
function addToVault(data) {
    const vault = JSON.parse(localStorage.getItem('vault')) || [];
    const encryptedData = {
        id: Date.now(),
        title: data.title,
        credential: encryptData(data.credential, generateVaultKey()),
        createdAt: new Date().toISOString()
    };
    
    vault.push(encryptedData);
    localStorage.setItem('vault', JSON.stringify(vault));
    updateDashboard();
    showNotification('Credential saved securely!');
}

// Encryption functions for HerVault
function generateVaultKey() {
    // In a real app, this would be a secure key management system
    return 'your-secure-key';
}

function encryptData(data, key) {
    // Simple XOR encryption (for demo purposes - use proper encryption in production)
    return btoa(data.split('').map(char => 
        String.fromCharCode(char.charCodeAt(0) ^ key.charCodeAt(0))
    ).join(''));
}

function decryptData(encryptedData, key) {
    // Simple XOR decryption (for demo purposes - use proper encryption in production)
    return atob(encryptedData).split('').map(char =>
        String.fromCharCode(char.charCodeAt(0) ^ key.charCodeAt(0))
    ).join('');
}

// Notification System
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }, 100);
}

// Update Dashboard
function updateDashboard() {
    // Calculate total income
    const incomes = JSON.parse(localStorage.getItem('incomes')) || [];
    const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
    const incomeElement = document.querySelector('.income .amount');
    if (incomeElement) {
        incomeElement.textContent = `₹${totalIncome.toLocaleString()}`;
    }

    // Calculate total expenses
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const expenseElement = document.querySelector('.expenditure .amount');
    if (expenseElement) {
        expenseElement.textContent = `₹${totalExpenses.toLocaleString()}`;
    }

    // Update balance
    const balance = totalIncome - totalExpenses;
    const balanceElement = document.querySelector('.balance .amount');
    if (balanceElement) {
        balanceElement.textContent = `₹${balance.toLocaleString()}`;
        balanceElement.classList.remove('positive', 'negative');
        balanceElement.classList.add(balance >= 0 ? 'positive' : 'negative');
    }

    // Update savings rate
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome * 100).toFixed(0) : 0;
    const savingsRateElement = document.querySelector('.balance-details .detail-item .positive');
    if (savingsRateElement) {
        savingsRateElement.textContent = `${savingsRate}%`;
    }

    // Update Income List
    const recentIncomeEl = document.getElementById('recentIncome');
    if (recentIncomeEl) {
        recentIncomeEl.innerHTML = incomes.slice(0, 3).map(income => `
            <div class="transaction">
                <div class="transaction-header">
                    <span class="amount positive">₹${income.amount.toLocaleString()}</span>
                    <span class="date">${new Date(income.date).toLocaleDateString()}</span>
                </div>
                <div class="transaction-details">
                    <span class="category">${income.category}</span>
                    ${income.note ? `<span class="note">${income.note}</span>` : ''}
                </div>
            </div>
        `).join('');
    }

    // Update Expense List
    const recentExpensesEl = document.getElementById('recentExpenses');
    if (recentExpensesEl) {
        recentExpensesEl.innerHTML = expenses.slice(0, 3).map(expense => `
            <div class="transaction">
                <div class="transaction-header">
                    <span class="amount negative">₹${expense.amount.toLocaleString()}</span>
                    <span class="date">${new Date(expense.date).toLocaleDateString()}</span>
                </div>
                <div class="transaction-details">
                    <span class="category">${expense.category}</span>
                    ${expense.note ? `<span class="note">${expense.note}</span>` : ''}
                </div>
            </div>
        `).join('');
    }

    // Update Forum Posts
    const posts = JSON.parse(localStorage.getItem('forumPosts')) || [];
    const forumPostsEl = document.getElementById('forumPosts');
    if (forumPostsEl) {
        forumPostsEl.innerHTML = posts.slice(0, 3).map(post => `
            <div class="forum-post">
                <div class="post-header">
                    <strong>${post.author}</strong>
                    <span class="date">${new Date(post.date).toLocaleDateString()}</span>
                </div>
                <p class="post-content">${post.content}</p>
                <div class="post-footer">
                    <button class="like-btn" onclick="likePost(${post.id})">
                        <i class="fas fa-heart"></i> ${post.likes}
                    </button>
                    <button class="comment-btn" onclick="showComments(${post.id})">
                        <i class="fas fa-comment"></i> ${post.comments.length}
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Update Goals
    updateGoalsDisplay();
    updateChallengesDisplay();
}

// Initialize Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    initializeLocalStorage();
    initializeBalanceChart();
    updateDashboard();
    setupEventListeners();
});

// Setup Event Listeners
function setupEventListeners() {
    // Income Form
    const incomeForm = document.getElementById('incomeForm');
    if (incomeForm) {
        incomeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            addTransaction('incomes', {
                amount: parseFloat(formData.get('amount')),
                date: formData.get('date'),
                category: formData.get('category'),
                note: formData.get('note')
            });
            hideModal('incomeModal');
            e.target.reset();
        });
    }

    // Expense Form
    const expenseForm = document.getElementById('expenseForm');
    if (expenseForm) {
        expenseForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            addTransaction('expenses', {
                amount: parseFloat(formData.get('amount')),
                date: formData.get('date'),
                category: formData.get('category'),
                note: formData.get('note')
            });
            hideModal('expenseModal');
            e.target.reset();
        });
    }

    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('show');
        });
    }
}

// Initialize the app
updateDashboard();
