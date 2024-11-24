import { useEffect, useRef, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Cell from './components/cell/Cell'
import Auth from './components/auth/auth'
import { BASE } from '../links'
import ColorSchemeSwitcher from './components/colorShcemeSwithcer'
import { ThemeProvider } from './context/ThemeContext'


// n = 10

const const_tasks = [
  {
    id: 1,
    title: "упс",
completed: false,
  },
  {
    id: 2,
    title: "the name",
    completed: false,
  },
  
]



function App() {
  const [tasks, setTask] = useState(const_tasks)
  const [isAuthorized, setIsAuth] = useState(false) // на будущее
  const userId = useRef()


  function updateTasks(id, newValue) {
    
    // tasks.map(task => {
    //   if (task.id === id) {
    //     console.log(task, "aloha");
    //   }
    // }); // работает)

    setTask(prevTasks => {
      const updatedTasks = prevTasks.map(task => {
        if (task.id === id) {
          completeTask(id)
          return { ...task, ...newValue };
        }
        return task;
      });
      
      return updatedTasks;
    });
  }

  const cell_tasks = tasks.slice(0,19).map((task, index) => (
    
    <Cell key={index} taskId={index} isFinished={task.completed} completed={task.completed} title={task.title} finishTask={() => { updateTasks(task.id, {completed: true}) }}/>
  ));


  async function completeTask(taskId) {
    try {
      const response = await fetch(`${BASE}/update/${taskId}`, {
        method: 'PUT',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log(result);

      alert(`Задача обновлена успешно! Результат: ${JSON.stringify(result)}`);

    } catch (error) {
      console.error('Ошибка при обновлении задачи:', error);
      alert(`Произошла ошибка при обновлении задачи: ${error.message}`);
    }
  }

  async function fetchList() {
    try {
      const response = await fetch(`${BASE}/get_tasks_and_goals/5593392332`);
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }

      const data = await response.json();
      alert(data)
      console.log(data)
      setTask(data.tasks)
      // displayData(data);
      } catch (error) {
          console.error('Error fetching data:', error);
          dataContainer.innerHTML = '<p>Error: ' + error.message + '</p>';
      }
  }

  function auth(newUserId) {
    setIsAuth(true)
    userId.current = newUserId
    fetchList()
  }

  if (isAuthorized) {
  return (
        <ThemeProvider>
          <header className='container'>
            <ColorSchemeSwitcher className="contrast"></ColorSchemeSwitcher>
          </header>
        <div className="main">
          {/* <h1>Список задач</h1>
            <div className="table-header">
            <span>ID</span>
            <span>Название задачи</span>
            </div> */}
          <div className="grid">
            {cell_tasks}
          </div>


        </div>
        </ThemeProvider>
        
      )
  } 
  // TODOTODO!!!s
  else if (!isAuthorized) {
    return (
      <Auth setAuthirized={ auth }></Auth>
    )
  }
}


export default App
