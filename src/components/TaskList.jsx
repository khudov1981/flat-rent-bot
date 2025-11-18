import React, { useState } from 'react';
import Card from './Card';
import ProgressBar from './ProgressBar';
import './TaskList.css';

const TaskList = ({ tasks, onTaskToggle, onTaskAdd, onTaskDelete }) => {
  const [newTask, setNewTask] = useState('');
  
  const handleAddTask = (e) => {
    e.preventDefault();
    if (newTask.trim()) {
      onTaskAdd({
        id: Date.now(),
        text: newTask.trim(),
        completed: false,
        createdAt: new Date().toISOString()
      });
      setNewTask('');
    }
  };
  
  const completedTasks = tasks.filter(task => task.completed).length;
  const progress = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;
  
  return (
    <div className="task-list">
      <div className="task-list__header">
        <h3>Список задач</h3>
        <div className="task-list__progress">
          <span>{completedTasks} из {tasks.length}</span>
        </div>
      </div>
      
      <ProgressBar 
        value={completedTasks}
        maxValue={tasks.length}
        showPercentage={false}
        color="green"
      />
      
      <form onSubmit={handleAddTask} className="task-list__add-form">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Добавить новую задачу..."
          className="task-list__input"
        />
        <button type="submit" className="task-list__add-button">
          +
        </button>
      </form>
      
      <div className="task-list__items">
        {tasks.length === 0 ? (
          <Card className="task-list__empty">
            <p>Список задач пуст</p>
            <p className="task-list__empty-subtitle">
              Добавьте первую задачу, чтобы начать
            </p>
          </Card>
        ) : (
          tasks.map((task) => (
            <Card 
              key={task.id} 
              className={`task-item ${task.completed ? 'task-item--completed' : ''}`}
            >
              <div className="task-item__content">
                <label className="task-item__checkbox">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => onTaskToggle(task.id)}
                  />
                  <span className="task-item__checkmark"></span>
                </label>
                <span className="task-item__text">
                  {task.text}
                </span>
              </div>
              <button
                className="task-item__delete"
                onClick={() => onTaskDelete(task.id)}
                aria-label="Удалить задачу"
              >
                ×
              </button>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default TaskList;