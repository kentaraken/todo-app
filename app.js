// DOM Elements
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTask');
const taskList = document.getElementById('taskList');
const pendingTasks = document.getElementById('pendingTasks');
const clearCompletedBtn = document.getElementById('clearCompleted');

// Load tasks from localStorage if available
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Render tasks from the tasks array
function renderTasks() {
    // Clear the task list
    taskList.innerHTML = '';
    
    // Count pending tasks
    const pending = tasks.filter(task => !task.completed).length;
    pendingTasks.textContent = `${pending} tasks pending`;
    
    // Render each task
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        
        // Create checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => toggleTask(index));
        
        // Create task text
        const span = document.createElement('span');
        span.textContent = task.text;
        if (task.completed) {
            span.classList.add('completed');
        }
        
        // Create delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '×';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.addEventListener('click', () => deleteTask(index));
        
        // Append elements to list item
        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteBtn);
        
        // Append list item to task list
        taskList.appendChild(li);
    });
    
    // Save tasks to localStorage
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Add a new task
function addTask() {
    const text = taskInput.value.trim();
    if (text) {
        tasks.push({ text, completed: false });
        taskInput.value = '';
        renderTasks();
    }
}

// Toggle task completed status
function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    renderTasks();
}

// Delete a task
function deleteTask(index) {
    tasks.splice(index, 1);
    renderTasks();
}

// Clear completed tasks
function clearCompleted() {
    tasks = tasks.filter(task => !task.completed);
    renderTasks();
}

// Event listeners
addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', event => {
    if (event.key === 'Enter') {
        addTask();
    }
});
clearCompletedBtn.addEventListener('click', clearCompleted);

// Initial render
renderTasks();