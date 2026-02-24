import { useState } from 'react';
import './TaskCard.css';
import type { Task } from './TaskManager';

interface TaskCardProps {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
  onUpdate: (updates: Partial<Task>) => void;
}

function TaskCard({ task, onToggle, onDelete, onUpdate }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description);
  const [editPriority, setEditPriority] = useState(task.priority);

  const handleSaveEdit = () => {
    if (editTitle.trim()) {
      onUpdate({
        title: editTitle,
        description: editDescription,
        priority: editPriority,
      });
      setIsEditing(false);
    }
  };

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: '2-digit',
    });
  };

  const isPastDue = task.dueDate && task.dueDate < Date.now() && !task.completed;
  const isToday = task.dueDate && new Date(task.dueDate).toDateString() === new Date().toDateString();

  const priorityEmoji = {
    low: '🟢',
    medium: '🟡',
    high: '🔴',
  };

  if (isEditing) {
    return (
      <div className="task-card editing">
        <div className="task-edit-form">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Título"
            autoFocus
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            placeholder="Descripción"
            rows={2}
          />
          <select value={editPriority} onChange={(e) => setEditPriority(e.target.value as any)}>
            <option value="low">🟢 Baja</option>
            <option value="medium">🟡 Media</option>
            <option value="high">🔴 Alta</option>
          </select>
          <div className="edit-buttons">
            <button className="save-btn" onClick={handleSaveEdit}>
              ✅ Guardar
            </button>
            <button className="cancel-btn" onClick={() => setIsEditing(false)}>
              ❌ Cancelar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`task-card ${task.completed ? 'completed' : ''} ${isPastDue ? 'past-due' : ''}`}>
      <div className="task-checkbox">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={onToggle}
          aria-label={`Marcar como ${task.completed ? 'pendiente' : 'completada'}`}
        />
      </div>

      <div className="task-content">
        <div className="task-header">
          <h3 className="task-title">{task.title}</h3>
          <span className="task-priority">{priorityEmoji[task.priority]}</span>
        </div>

        {task.description && <p className="task-description">{task.description}</p>}

        <div className="task-meta">
          {task.dueDate && (
            <span
              className={`task-date ${isPastDue ? 'overdue' : ''} ${isToday ? 'today' : ''}`}
            >
              📅 {isToday ? 'Hoy' : formatDate(task.dueDate)}
            </span>
          )}
          <span className="task-created">
            Creada hace {getTimeAgo(task.createdAt)}
          </span>
        </div>
      </div>

      <div className="task-actions">
        <button
          className="action-btn edit-btn"
          onClick={() => setIsEditing(true)}
          title="Editar"
        >
          ✏️
        </button>
        <button
          className="action-btn delete-btn"
          onClick={onDelete}
          title="Eliminar"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}

function getTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d`;
  if (hours > 0) return `${hours}h`;
  if (minutes > 0) return `${minutes}m`;
  return 'hace poco';
}

export default TaskCard;
