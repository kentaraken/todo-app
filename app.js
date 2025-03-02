// DOM Elements
const taskInput = document.getElementById('taskInput');
const dueDateInput = document.getElementById('dueDateInput');
const addTaskBtn = document.getElementById('addTask');
const taskList = document.getElementById('taskList');
const pendingTasks = document.getElementById('pendingTasks');
const clearCompletedBtn = document.getElementById('clearCompleted');
const toggleThemeBtn = document.getElementById('toggleTheme');
const searchInput = document.getElementById('searchInput');
const filterAllBtn = document.getElementById('filterAll');
const filterActiveBtn = document.getElementById('filterActive');
const filterCompletedBtn = document.getElementById('filterCompleted');

// App State
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';
let searchTerm = '';

// Theme toggle functionality
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    toggleThemeBtn.textContent = savedTheme === 'light' ? '🌙' : '☀️';
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    toggleThemeBtn.textContent = newTheme === 'light' ? '🌙' : '☀️';
}

// Filter functions
function applyFilter(filter) {
    currentFilter = filter;
    
    // Update active button
    [filterAllBtn, filterActiveBtn, filterCompletedBtn].forEach(btn => {
        btn.classList.remove('active');
    });
    
    switch(filter) {
        case 'active':
            filterActiveBtn.classList.add('active');
            break;
        case 'completed':
            filterCompletedBtn.classList.add('active');
            break;
        default:
            filterAllBtn.classList.add('active');
    }
    
    renderTasks();
}

function filterTasks() {
    // First apply search filter
    let filteredTasks = tasks.filter(task => 
        task.text.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Then apply tab filter
    switch(currentFilter) {
        case 'active':
            return filteredTasks.filter(task => !task.completed);
        case 'completed':
            return filteredTasks.filter(task => task.completed);
        default:
            return filteredTasks;
    }
}

// Render tasks from the tasks array
function renderTasks() {
    // Clear the task list
    taskList.innerHTML = '';
    
    // Count pending tasks
    const pending = tasks.filter(task => !task.completed).length;
    pendingTasks.textContent = `${pending} tasks pending`;
    
    // Get filtered tasks
    const filteredTasks = filterTasks();
    
    if (filteredTasks.length === 0) {
        const emptyMessage = document.createElement('li');
        emptyMessage.textContent = searchTerm 
            ? 'No matching tasks found' 
            : `No ${currentFilter === 'completed' ? 'completed' : currentFilter === 'active' ? 'active' : ''} tasks`;
        emptyMessage.style.justifyContent = 'center';
        emptyMessage.style.color = 'var(--completed-color)';
        taskList.appendChild(emptyMessage);
        return;
    }
    
    // Render each task
    filteredTasks.forEach((task, index) => {
        const actualIndex = tasks.findIndex(t => t.id === task.id);
        
        const li = document.createElement('li');
        
        // Create checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => toggleTask(actualIndex));
        
        // Create task content container
        const contentDiv = document.createElement('div');
        contentDiv.className = 'task-content';
        
        // Create task text
        const taskTitle = document.createElement('span');
        taskTitle.textContent = task.text;
        taskTitle.className = 'task-title';
        
        // Create due date display if exists
        if (task.dueDate) {
            const dueDateSpan = document.createElement('span');
            dueDateSpan.className = 'task-due-date';
            dueDateSpan.textContent = `Due: ${formatDate(task.dueDate)}`;
            contentDiv.appendChild(taskTitle);
            contentDiv.appendChild(dueDateSpan);
        } else {
            contentDiv.appendChild(taskTitle);
        }
        
        if (task.completed) {
            contentDiv.classList.add('completed');
        }
        
        // Create delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '×';
        deleteBtn.className = 'delete-btn';
        deleteBtn.addEventListener('click', () => deleteTask(actualIndex));
        
        // Append elements to list item
        li.appendChild(checkbox);
        li.appendChild(contentDiv);
        li.appendChild(deleteBtn);
        
        // Append list item to task list
        taskList.appendChild(li);
    });
}

// Helper function for formatting dates
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Add a new task
function addTask() {
    const text = taskInput.value.trim();
    if (text) {
        const newTask = { 
            id: Date.now(), 
            text, 
            completed: false,
            createdAt: new Date().toISOString()
        };
        
        // Add due date if provided
        if (dueDateInput.value) {
            newTask.dueDate = dueDateInput.value;
        }
        
        tasks.push(newTask);
        saveTasks();
        
        // Clear inputs
        taskInput.value = '';
        dueDateInput.value = '';
        
        renderTasks();
    }
}

// Toggle task completed status
function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
}

// Delete a task
function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
}

// Clear completed tasks
function clearCompleted() {
    tasks = tasks.filter(task => !task.completed);
    saveTasks();
    renderTasks();
}

// Search functionality
function handleSearch() {
    searchTerm = searchInput.value.trim();
    renderTasks();
}

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Event listeners
addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', event => {
    if (event.key === 'Enter') {
        addTask();
    }
});
clearCompletedBtn.addEventListener('click', clearCompleted);
toggleThemeBtn.addEventListener('click', toggleTheme);
searchInput.addEventListener('input', handleSearch);
filterAllBtn.addEventListener('click', () => applyFilter('all'));
filterActiveBtn.addEventListener('click', () => applyFilter('active'));
filterCompletedBtn.addEventListener('click', () => applyFilter('completed'));

// Initialize
initTheme();
applyFilter('all');
renderTasks();