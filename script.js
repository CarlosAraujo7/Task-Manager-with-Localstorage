document.addEventListener('DOMContentLoaded', function () {
    const taskForm = document.getElementById('task-form');
    const taskTitleInput = document.getElementById('task-title');
    const taskDescriptionInput = document.getElementById('task-description');
    const prioritySelect = document.getElementById('priority');
    const taskList = document.getElementById('task-list');
    const searchInput = document.getElementById('search-input');

    // Carrega tarefas armazenadas localmente ao iniciar
    loadTasks();

    // Event listener para adicionar uma nova tarefa
    taskForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const title = taskTitleInput.value.trim();
        const description = taskDescriptionInput.value.trim();
        const priority = prioritySelect.value;

        if (title === '' || description === '') {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        const task = {
            title,
            description,
            priority,
            completed: false
        };

        addTask(task);
        saveTask(task);
        taskForm.reset();
    });

    // Event listener para pesquisa
    searchInput.addEventListener('input', function () {
        filterTasks();
    });

    // Função para adicionar uma tarefa à lista
    function addTask(task) {
        const li = document.createElement('li');
        li.classList.add('task-item');
        li.classList.add(`priority-${task.priority}`);
        li.innerHTML = `
            <span>${task.title} - ${task.description}</span>
            <div class="task-options">
                <button class="complete-btn ${task.priority}-btn">Concluir</button>
                <button class="edit-btn">Editar</button>
                <button class="delete-btn">Excluir</button>
            </div>
        `;
        taskList.appendChild(li);
        const completeBtn = li.querySelector('.complete-btn');
        const editBtn = li.querySelector('.edit-btn');
        const deleteBtn = li.querySelector('.delete-btn');

        if (task.priority === 'leve') {
            completeBtn.classList.add('leve-btn');
        } else if (task.priority === 'moderado') {
            completeBtn.classList.add('moderado-btn');
        } else if (task.priority === 'urgente') {
            completeBtn.classList.add('urgente-btn');
        }

        completeBtn.addEventListener('click', function () {
            toggleComplete(task, li);
        });

        editBtn.addEventListener('click', function () {
            openEditForm(task, li);
        });

        deleteBtn.addEventListener('click', function () {
            li.remove();
            deleteTask(task);
        });
    }

    // Função para marcar/desmarcar uma tarefa como concluída
    function toggleComplete(task, li) {
        li.classList.toggle('completed'); // Adiciona ou remove a classe "completed"
        task.completed = !task.completed; // Atualiza o estado da tarefa
        updateTask(task); // Atualiza a tarefa no localStorage
    }

    // Função para abrir o formulário de edição
    function openEditForm(task, li) {
        const editForm = document.createElement('form');
        editForm.innerHTML = `
            <label for="edit-title">Editar Título:</label>
            <input type="text" id="edit-title" value="${task.title}">
            <label for="edit-description">Editar Descrição:</label>
            <input type="text" id="edit-description" value="${task.description}">
            <label for="edit-priority">Editar Prioridade:</label>
            <select id="edit-priority">
                <option value="leve" ${task.priority === 'leve' ? 'selected' : ''}>Leve</option>
                <option value="moderado" ${task.priority === 'moderado' ? 'selected' : ''}>Moderado</option>
                <option value="urgente" ${task.priority === 'urgente' ? 'selected' : ''}>Urgente</option>
            </select>
            <button type="submit" class="complete-btn priority-${task.priority}">Salvar</button>
        `;
    
        const editPrioritySelect = editForm.querySelector('#edit-priority');
        editPrioritySelect.addEventListener('change', function () {
            const newPriority = editPrioritySelect.value;
            li.classList.remove(`priority-${task.priority}`);
            li.classList.add(`priority-${newPriority}`);
            task.priority = newPriority;
        });

        // Substitue o conteúdo da tarefa pelo de edição
        li.innerHTML = '';
        li.appendChild(editForm);

        editForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const newTitle = editForm.querySelector('#edit-title').value.trim();
            const newDescription = editForm.querySelector('#edit-description').value.trim();

            if (newTitle === '' || newDescription === '') {
                alert('Por favor, preencha todos os campos.');
                return;
            }

            // Atualiza os valores da tarefa
            task.title = newTitle;
            task.description = newDescription;
            updateTask(task);

            // Recria a interface da tarefa com os novos valores
            li.innerHTML = `
                <span>${task.title} - ${task.description}</span>
                <div class="task-options">
                    <button class="complete-btn">Concluir</button>
                    <button class="edit-btn">Editar</button>
                    <button class="delete-btn">Excluir</button>
                </div>
            `;

            // Adiciona novamente os eventos para os botões na nova interface da tarefa
            const completeBtn = li.querySelector('.complete-btn');
            const editBtn = li.querySelector('.edit-btn');
            const deleteBtn = li.querySelector('.delete-btn');

            // Adiciona classes de prioridade aos botões
            completeBtn.classList.add(`priority-${task.priority}`);

            completeBtn.addEventListener('click', function () {
                toggleComplete(task, li);
            });

            editBtn.addEventListener('click', function () {
                openEditForm(task, li);
            });

            deleteBtn.addEventListener('click', function () {
                li.remove();
                deleteTask(task);
            });
        });
    }

    // Função pra salvar uma tarefa no localStorage
    function saveTask(task) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Função pra carregar tarefas armazenadas no localStorage
    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach((task) => {
            addTask(task);
        });
    }

    // Função pra excluir uma tarefa do localStorage
    function deleteTask(taskToDelete) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks = tasks.filter((task) => {
            return task.title !== taskToDelete.title || task.description !== taskToDelete.description;
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Função pra marcar/desmarcar uma tarefa como concluída
    function toggleComplete(task, li) {
        li.classList.toggle('completed'); // Adiciona ou remove a classe "completed"
        task.completed = !task.completed; // Atualiza o estado da tarefa
        updateTask(task); // Atualiza a tarefa no localStorage
    }

    // Função pra marcar/desmarcar uma tarefa como prioritária
    function togglePriority(task, li) {
        li.classList.toggle('priority'); // Adiciona ou remove a classe "priority"
        task.priority = !task.priority; // Atualiza o estado de prioridade da tarefa
        updateTask(task); // Atualiza a tarefa no localStorage
    }

    // Função pra filtrar tarefas com base na pesquisa
    function filterTasks() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        const taskItems = document.querySelectorAll('.task-item');

        taskItems.forEach((item) => {
            const taskText = item.textContent.toLowerCase();
            if (taskText.includes(searchTerm)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }

    // Função para atualizar a tarefa no localStorage
    function updateTask(updatedTask) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks = tasks.map((task) => {
            if (task.title === updatedTask.title && task.description === updatedTask.description) {
                return updatedTask;
            } else {
                return task;
            }
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

});
