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


    } catch (error) {
      console.error('Ошибка при обновлении задачи:', error);
    }
  }

  async function fetchList() {
    try {
      const response = await fetch(`${BASE}/get_tasks_and_goals/5593392332`);
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }

      const data = await response.json();
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

    const gridElement = document.getElementById("cells");
    if (gridElement) {
      gridElement.style.visibility = "visible";
    }

    // alert(gridElement.style.visibility)

    const authElement = document.getElementById("auth_block");
    if (gridElement) {
      authElement.style.display = "none";
    }
  }

  // if (!isAuthorized) {

    return (
      <ThemeProvider>
        <header className='container' style={{display:"flex"}} >
            <ColorSchemeSwitcher className="contrast" style={{marginRight: "40px", scale:"2", position: "relative", top:"25px"}}></ColorSchemeSwitcher>
              <h1>Привет, юный друг</h1>
            
          </header>

             <div className="grid" id='cells' style={{}}>
         {cell_tasks}
       </div>
        <Auth setAuthirized={ auth } id="auth_block"></Auth>

      </ThemeProvider>
    )
  // }
  //  else {

  //   <ThemeProvider>
  //   <header className='container' style={{display:"flex"}} >
  //       <ColorSchemeSwitcher className="contrast" style={{marginRight: "40px", scale:"2", position: "relative", top:"25px"}}></ColorSchemeSwitcher>
  //         <h1>Привет, юный друг</h1>
        
  //     </header>

    
    
  
  // </ThemeProvider>
  // }
    
}


export default App
