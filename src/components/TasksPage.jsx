import React, { useState, useEffect } from 'react';
import TaskList from './TaskList';
import Card from './Card';
import StatWidget from './StatWidget';
import './TasksPage.css';

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  
  // Загрузка задач из localStorage при монтировании
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch (e) {
        console.error('Ошибка при загрузке задач:', e);
      }
    }
  }, []);
  
  // Сохранение задач в localStorage при изменении
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);
  
  const handleTaskToggle = (id) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };
  
  const handleTaskAdd = (newTask) => {
    setTasks(prevTasks => [...prevTasks, newTask]);
  };
  
  const handleTaskDelete = (id) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  };
  
  // Статистика задач
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  
  return (
    <div className="tasks-page">
      <div className="page-header">
        <h2>Задачи</h2>
      </div>
      
      <div className="tasks-page__stats">
        <StatWidget
          title="Всего задач"
          value={totalTasks}
          icon="📋"
          color="blue"
        />
        
        <StatWidget
          title="Выполнено"
          value={completedTasks}
          icon="✅"
          color="green"
        />
        
        <StatWidget
          title="В работе"
          value={pendingTasks}
          icon="⏳"
          color="orange"
        />
      </div>
      
      <Card className="tasks-page__content">
        <TaskList
          tasks={tasks}
          onTaskToggle={handleTaskToggle}
          onTaskAdd={handleTaskAdd}
          onTaskDelete={handleTaskDelete}
        />
      </Card>
    </div>
  );
};

export default TasksPage;