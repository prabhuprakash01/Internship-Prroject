(() => {
  "use strict";

  const STORAGE_KEY = "alex-portfolio-todos-v1";
  const form = document.querySelector("#todo-form");
  const input = document.querySelector("#task-input");
  const submitButton = document.querySelector("#submit-button");
  const cancelEditButton = document.querySelector("#cancel-edit");
  const list = document.querySelector("#todo-list");
  const emptyState = document.querySelector("#empty-state");
  const count = document.querySelector("#task-count");
  const feedback = document.querySelector("#todo-feedback");
  const clearCompletedButton = document.querySelector("#clear-completed");
  const filterButtons = document.querySelectorAll("[data-filter]");

  let tasks = loadTasks();
  let activeFilter = "all";
  let editingId = null;

  function loadTasks() {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) return [];
      return parsed.filter((task) =>
        task && typeof task.id === "string" &&
        typeof task.text === "string" &&
        typeof task.completed === "boolean"
      );
    } catch {
      return [];
    }
  }

  function saveTasks() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch {
      feedback.textContent = "Your browser could not save changes. Check storage settings or available space.";
    }
  }

  function makeId() {
    return (window.crypto && typeof window.crypto.randomUUID === "function")
      ? window.crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function visibleTasks() {
    if (activeFilter === "active") return tasks.filter((task) => !task.completed);
    if (activeFilter === "completed") return tasks.filter((task) => task.completed);
    return tasks;
  }

  function render() {
    const shown = visibleTasks();
    list.replaceChildren();

    shown.forEach((task) => {
      const item = document.createElement("li");
      item.className = `todo-item${task.completed ? " is-completed" : ""}`;
      item.dataset.id = task.id;

      const label = document.createElement("label");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.completed;
      checkbox.dataset.action = "toggle";
      checkbox.setAttribute("aria-label", `Mark "${task.text}" ${task.completed ? "active" : "completed"}`);

      const text = document.createElement("span");
      text.className = "todo-text";
      text.textContent = task.text;
      label.append(checkbox, text);

      const actions = document.createElement("div");
      actions.className = "todo-actions";

      const editButton = document.createElement("button");
      editButton.type = "button";
      editButton.className = "todo-action";
      editButton.dataset.action = "edit";
      editButton.textContent = "Edit";
      editButton.setAttribute("aria-label", `Edit "${task.text}"`);

      const deleteButton = document.createElement("button");
      deleteButton.type = "button";
      deleteButton.className = "todo-action delete";
      deleteButton.dataset.action = "delete";
      deleteButton.textContent = "Delete";
      deleteButton.setAttribute("aria-label", `Delete "${task.text}"`);

      actions.append(editButton, deleteButton);
      item.append(label, actions);
      list.append(item);
    });

    const activeCount = tasks.filter((task) => !task.completed).length;
    count.textContent = `${activeCount} active · ${tasks.length} total`;
    emptyState.hidden = shown.length > 0;
    if (shown.length === 0) {
      emptyState.textContent = tasks.length === 0
        ? "No tasks yet. Add your first task above."
        : "No tasks match this filter.";
    }
    filterButtons.forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.filter === activeFilter));
    });
    clearCompletedButton.disabled = !tasks.some((task) => task.completed);
  }

  function resetEditor() {
    editingId = null;
    form.reset();
    submitButton.textContent = "Add task";
    cancelEditButton.hidden = true;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = input.value.trim();
    if (!text) {
      feedback.textContent = "Please enter a task before saving.";
      input.focus();
      return;
    }

    if (editingId) {
      const task = tasks.find((item) => item.id === editingId);
      if (task) task.text = text;
      feedback.textContent = "Task updated.";
    } else {
      tasks.unshift({ id: makeId(), text, completed: false, createdAt: Date.now() });
      feedback.textContent = "Task added.";
    }

    saveTasks();
    resetEditor();
    activeFilter = "all";
    render();
    input.focus();
  });

  cancelEditButton.addEventListener("click", () => {
    resetEditor();
    feedback.textContent = "Edit cancelled.";
    input.focus();
  });

  // One delegated listener handles controls for all dynamically-created task rows.
  list.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;
    const row = button.closest("li[data-id]");
    if (!row) return;
    const task = tasks.find((item) => item.id === row.dataset.id);
    if (!task) return;

    if (button.dataset.action === "edit") {
      editingId = task.id;
      input.value = task.text;
      submitButton.textContent = "Save changes";
      cancelEditButton.hidden = false;
      feedback.textContent = `Editing: ${task.text}`;
      input.focus();
    } else if (button.dataset.action === "delete") {
      tasks = tasks.filter((item) => item.id !== task.id);
      if (editingId === task.id) resetEditor();
      saveTasks();
      feedback.textContent = "Task deleted.";
      render();
    }
  });

  // Delegated change listener handles checkboxes in dynamic task rows.
  list.addEventListener("change", (event) => {
    const checkbox = event.target.closest('input[data-action="toggle"]');
    if (!checkbox) return;
    const row = checkbox.closest("li[data-id]");
    const task = tasks.find((item) => item.id === row?.dataset.id);
    if (!task) return;
    task.completed = checkbox.checked;
    saveTasks();
    feedback.textContent = task.completed ? "Task marked completed." : "Task marked active.";
    render();
  });

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter;
      render();
    });
  });

  clearCompletedButton.addEventListener("click", () => {
    const completedCount = tasks.filter((task) => task.completed).length;
    if (!completedCount) return;
    tasks = tasks.filter((task) => !task.completed);
    if (editingId && !tasks.some((task) => task.id === editingId)) resetEditor();
    saveTasks();
    feedback.textContent = `${completedCount} completed ${completedCount === 1 ? "task" : "tasks"} cleared.`;
    render();
  });

  render();
})();