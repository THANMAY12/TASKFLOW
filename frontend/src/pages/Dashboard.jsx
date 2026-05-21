import { useEffect, useState } from "react";
import API from "../api/axios";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const userName = localStorage.getItem("userName") || "User";
  const userEmail = localStorage.getItem("userEmail") || "";

  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks");
      setTasks(res.data.tasks || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const createTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      await API.post("/tasks", {
        title,
        description,
        status: "pending",
      });
      setTitle("");
      setDescription("");
      fetchTasks();
    } catch (error) {
      const errorMsg = error.response?.data?.errors
        ? error.response.data.errors.map((err) => err.msg).join("\n")
        : error.response?.data?.message || "Failed to create task";
      alert(errorMsg);
    }
  };

  const updateTaskStatus = async (id, status) => {
    try {
      await API.put(`/tasks/${id}`, {
        status,
      });
      fetchTasks();
    } catch (error) {
      const errorMsg = error.response?.data?.errors
        ? error.response.data.errors.map((err) => err.msg).join("\n")
        : error.response?.data?.message || "Failed to update task status";
      alert(errorMsg);
    }
  };

  const deleteTask = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await API.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (error) {
      console.log(error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    window.location.href = "/";
  };

  const pendingTasks = tasks.filter((t) => t.status === "pending" || !t.status);
  const inProgressTasks = tasks.filter((t) => t.status === "in-progress");
  const completedTasks = tasks.filter((t) => t.status === "completed");

  const renderTaskCard = (task) => {
    const borderClass =
      task.status === "completed"
        ? "border-completed"
        : task.status === "in-progress"
        ? "border-in-progress"
        : "border-pending";

    return (
      <div key={task._id} className={`task-card ${borderClass} slide-up`}>
        <div className="task-card-title">{task.title}</div>
        {task.description && (
          <div className="task-card-desc">{task.description}</div>
        )}
        <div className="task-card-footer">
          <select
            className="select-status"
            value={task.status || "pending"}
            onChange={(e) => updateTaskStatus(task._id, e.target.value)}
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <button
            onClick={() => deleteTask(task._id)}
            className="btn-delete-task"
            title="Delete Task"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <header className="navbar">
        <div className="nav-brand">TaskFlow</div>
        <div className="nav-user">
          <span className="user-email" title={`Logged in as ${userName}`}>
            {userEmail || userName}
          </span>
          <button onClick={logout} className="btn-logout">
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-container">
        <div className="dashboard-layout">
          {/* Left Column - Creation Form */}
          <aside className="create-task-card slide-up">
            <h3 className="create-task-title">Create Task</h3>
            <form onSubmit={createTask}>
              <div className="form-group">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  placeholder="Task title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  placeholder="Describe the task details..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="input-field"
                />
              </div>

              <button type="submit" className="btn btn-primary">
                Add Task
              </button>
            </form>
          </aside>

          {/* Right Column - Kanban Board */}
          <section className="kanban-board">
            {/* Column 1: Pending */}
            <div className="kanban-column">
              <header className="column-header">
                <div className="column-title-wrapper">
                  <span className="column-dot dot-pending" />
                  <h4 className="column-title">Pending</h4>
                </div>
                <span className="task-count">{pendingTasks.length}</span>
              </header>
              <div className="column-cards">
                {pendingTasks.length === 0 ? (
                  <div className="empty-state">No pending tasks</div>
                ) : (
                  pendingTasks.map(renderTaskCard)
                )}
              </div>
            </div>

            {/* Column 2: In Progress */}
            <div className="kanban-column">
              <header className="column-header">
                <div className="column-title-wrapper">
                  <span className="column-dot dot-progress" />
                  <h4 className="column-title">In Progress</h4>
                </div>
                <span className="task-count">{inProgressTasks.length}</span>
              </header>
              <div className="column-cards">
                {inProgressTasks.length === 0 ? (
                  <div className="empty-state">No tasks in progress</div>
                ) : (
                  inProgressTasks.map(renderTaskCard)
                )}
              </div>
            </div>

            {/* Column 3: Completed */}
            <div className="kanban-column">
              <header className="column-header">
                <div className="column-title-wrapper">
                  <span className="column-dot dot-completed" />
                  <h4 className="column-title">Completed</h4>
                </div>
                <span className="task-count">{completedTasks.length}</span>
              </header>
              <div className="column-cards">
                {completedTasks.length === 0 ? (
                  <div className="empty-state">No completed tasks</div>
                ) : (
                  completedTasks.map(renderTaskCard)
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;