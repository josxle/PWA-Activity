import './TaskList.css';
import TaskCard from './TaskCard';
import type { Task } from './TaskManager';

interface TaskListProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
}

function TaskList({ tasks, onToggleTask, onDeleteTask, onUpdateTask }: TaskListProps) {
  if (tasks.length === 0) {
    return null;
  }

  // Ordenar por prioridad y estado
  const sortedTasks = [...tasks].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    if (a.completed === b.completed) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return a.completed ? 1 : -1;
  });

  return (
    <div className="task-list">
      {sortedTasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onToggle={() => onToggleTask(task.id)}
          onDelete={() => onDeleteTask(task.id)}
          onUpdate={(updates) => onUpdateTask(task.id, updates)}
        />
      ))}
    </div>
  );
}

export default TaskList;
