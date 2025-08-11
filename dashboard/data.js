// data.js

// Initialize local storage with sample data if empty
export function initializeLocalStorage() {
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

// Transaction Management
export function addTransaction(type, data) {
    const transactions = JSON.parse(localStorage.getItem(type)) || [];
    const newTransaction = {
        id: Date.now(),
        ...data,
        date: data.date || new Date().toISOString().split('T')[0]
    };
    
    transactions.unshift(newTransaction);
    localStorage.setItem(type, JSON.stringify(transactions));
}

// Goals Management
export function addGoal(data) {
    const goals = JSON.parse(localStorage.getItem('goals')) || [];
    const newGoal = {
        id: Date.now(),
        ...data,
        current: 0
    };
    
    goals.push(newGoal);
    localStorage.setItem('goals', JSON.stringify(goals));
}

export function updateGoalProgress(goalId, amount) {
    const goals = JSON.parse(localStorage.getItem('goals')) || [];
    const goalIndex = goals.findIndex(g => g.id === goalId);
    
    if (goalIndex !== -1) {
        goals[goalIndex].current += amount;
        localStorage.setItem('goals', JSON.stringify(goals));
        return goals[goalIndex];
    }
    return null;
}

// Forum Management
export function addForumPost(data) {
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
}

// Challenge Management
export function joinChallenge(challengeType) {
    const challenges = JSON.parse(localStorage.getItem('challenges')) || [];
    let newChallenge;
    
    switch (challengeType) {
        case 'rupeeRise':
            // ... implementation for rupeeRise challenge
            break;
        // ... other cases
    }
    
    if (newChallenge) {
        challenges.push(newChallenge);
        localStorage.setItem('challenges', JSON.stringify(challenges));
    }
}

// --- Data Getters ---

function getData(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}

export function getIncomes() {
    return getData('incomes');
}

export function getExpenses() {
    return getData('expenses');
}

export function getGoals() {
    return getData('goals');
}

export function getForumPosts() {
    return getData('forumPosts');
}

export function getChallenges() {
    return getData('challenges');
}

export function getVaultCredentials() {
    return getData('vault');
}
