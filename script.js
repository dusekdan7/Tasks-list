document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.querySelector('#task');
    const submitButton = document.querySelector('#submit');
    const taskList = document.querySelector('#tasks');
    const taskForm = document.querySelector('#new-task-form');

    function getTasks() {
        const storedTasks = localStorage.getItem('tasks');
        return storedTasks ? JSON.parse(storedTasks) : [];
    }

    function saveTasks(tasks) {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function renderTasks(tasks) {
        taskList.innerHTML = '';
        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.setAttribute('data-index', index);
            if (task.completed) li.classList.add('completed');

            li.innerHTML = `
                <div class="task-content">
                    <input type="checkbox" data-type="toggle-task" ${task.completed ? 'checked' : ''}>
                    <span class="task-text">${task.text}</span>
                </div>
                <button class="delete-btn" data-type="delete-task">❌</button>
            `;
            taskList.append(li);
        });
    }

    function toggleTask(index) {
        const tasks = getTasks();
        tasks[index].completed = !tasks[index].completed;
        saveTasks(tasks);
        renderTasks(tasks);
    }

    function deleteTask(index) {
        const tasks = getTasks();
        tasks.splice(index, 1);
        saveTasks(tasks);
        renderTasks(tasks);
    }

    submitButton.disabled = true;

    taskInput.onkeyup = () => {
        submitButton.disabled = !(taskInput.value.trim().length > 0);
    };

    taskForm.onsubmit = (e) => {
        e.preventDefault();
        const tasks = getTasks();
        tasks.push({ text: taskInput.value.trim(), completed: false });
        saveTasks(tasks);
        renderTasks(tasks);
        taskInput.value = '';
        submitButton.disabled = true;
    };

    taskList.addEventListener('click', (e) => {
        const listItem = e.target.closest('li');
        if (!listItem) return;
        const index = parseInt(listItem.getAttribute('data-index'));

        if (e.target.dataset.type === 'delete-task') {
            deleteTask(index);
        } else if (e.target.dataset.type === 'toggle-task') {
            toggleTask(index);
        }
    });

    renderTasks(getTasks());
});