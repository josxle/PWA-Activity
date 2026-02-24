import { useState, useEffect } from 'react';
import './TaskManager.css';
import TaskForm from './TaskForm';
import TaskList from './TaskList';

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: number;
  dueDate?: number;
  priority: 'low' | 'medium' | 'high';
}

const STORAGE_KEY = 'pwa_tasks';

function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  // Cargar tareas desde localStorage al montar
  useEffect(() => {
    const savedTasks = localStorage.getItem(STORAGE_KEY);
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks);
        setTasks(parsedTasks);
      } catch (error) {
        console.error('Error cargando tareas:', error);
      }
    }
  }, []);

  // Guardar tareas en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (title: string, description: string, priority: 'low' | 'medium' | 'high', dueDate?: number) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      description,
      priority,
      completed: false,
      createdAt: Date.now(),
      dueDate,
    };
    setTasks([newTask, ...tasks]);
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, ...updates } : task
    ));
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;

  return (
    <div className="task-manager">
      <div className="task-manager-header">
        <div className="stats">
          <div className="stat-item">
            <span className="stat-label">Total</span>
            <span className="stat-value">{totalCount}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Completadas</span>
            <span className="stat-value">{completedCount}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Pendientes</span>
            <span className="stat-value">{totalCount - completedCount}</span>
          </div>
        </div>
      </div>

      <TaskForm onAddTask={addTask} />

      <div className="filter-buttons">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          Todas ({totalCount})
        </button>
        <button
          className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
          onClick={() => setFilter('active')}
        >
          Pendientes ({totalCount - completedCount})
        </button>
        <button
          className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          Completadas ({completedCount})
        </button>
      </div>

      <TaskList
        tasks={filteredTasks}
        onToggleTask={toggleTask}
        onDeleteTask={deleteTask}
        onUpdateTask={updateTask}
      />

      {tasks.length === 0 && (
        <div className="empty-state">
          <p>📭 No hay tareas</p>
          <p className="empty-description">¡Crea tu primera tarea para empezar!</p>
        </div>
      )}
    </div>
  );
}

export default TaskManager;
