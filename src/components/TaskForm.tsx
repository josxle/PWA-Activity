import { useState } from 'react';
import './TaskForm.css';

interface TaskFormProps {
  onAddTask: (title: string, description: string, priority: 'low' | 'medium' | 'high', dueDate?: number) => void;
}

function TaskForm({ onAddTask }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [dueDate, setDueDate] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert('Por favor ingresa un título');
      return;
    }

    const dueDateTimestamp = dueDate ? new Date(dueDate).getTime() : undefined;
    onAddTask(title, description, priority, dueDateTimestamp);

    // Reset form
    setTitle('');
    setDescription('');
    setPriority('medium');
    setDueDate('');
    setShowForm(false);
  };

  return (
    <div className="task-form-container">
      {!showForm ? (
        <button className="add-task-button" onClick={() => setShowForm(true)}>
          ➕ Agregar Nueva Tarea
        </button>
      ) : (
        <form className="task-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Título *</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="¿Qué necesitas hacer?"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Descripción</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalles adicionales (opcional)"
              rows={3}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="priority">Prioridad</label>
              <select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
              >
                <option value="low">🟢 Baja</option>
                <option value="medium">🟡 Media</option>
                <option value="high">🔴 Alta</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="dueDate">Fecha de Vencimiento</label>
              <input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          <div className="form-buttons">
            <button type="submit" className="submit-button">
              ✅ Crear Tarea
            </button>
            <button
              type="button"
              className="cancel-button"
              onClick={() => setShowForm(false)}
            >
              ❌ Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default TaskForm;
