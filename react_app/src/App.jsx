import { useEffect, useRef, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Cell from './components/cell/Cell'
import Auth from './components/auth/auth'


// n = 10

const const_tasks = [
  {
    id: 1,
    title: "the name",
isFinished: false,
  },
  {
    id: 2,
    title: "the name",
isFinished: false,
  },
  {
    id: 3,
    title: "the name",
isFinished: false,
  },
  {
    id: 4,
    title: "the name",
isFinished: false,
  },
  {
    id: 5,
    title: "the name",
isFinished: false,
  },,
  {
    id: 6,
    title: "the name",
isFinished: false,
  },
  {
    id: 7,
    title: "the name",
isFinished: false,
  },
  {
    id: 8,
    title: "the name",
isFinished: false,
  },
  {
    id: 9,
    title: "the name",
isFinished: false,
  },,
  {
    id: 10,
    title: "the name",
isFinished: false,
  },
  {
    id: 11,
    title: "the name",
isFinished: false,
  },
  {
    id: 12,
    title: "the name",
isFinished: false,
  },
  {
    id: 13,
    title: "the name",
isFinished: false,
  },,
  {
    id: 14,
    title: "the name",
isFinished: false,
  },
  {
    id: 15,
    title: "the name",
isFinished: false,
  },
  {
    id: 16,
    title: "the name",
isFinished: false,
  },
  {
    id: 17,
    title: "the name",
isFinished: false,
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
          return { ...task, ...newValue };
        }
        return task;
      });
      
      return updatedTasks;
    });
  }

  const cell_tasks = tasks.slice(0,19).map((task, index) => (
    
    <Cell key={index} taskId={index} title={task.title} finishTask={() => { updateTasks(task.id, {completed: true}) }}/>
  ));

  async function fetchList() {
    try {
      const response = await fetch('http://127.0.0.1:8000/get_tasks_and_goals/5593392332');
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
