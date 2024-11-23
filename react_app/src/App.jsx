import { useState } from 'react'
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

  // let tasks_sliced = tasks.slice(30)
  const cell_tasks = tasks.slice(0,19).map((task, index) => (
    
    <Cell key={task.id} taskId={5} title={task.title} finishTask={() => { updateTasks(task.id, {isFinished: true}) }}/>
  ));

  function auth() {
    setIsAuth(true)
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
      <Auth setAuthirized={ () => {setIsAuth(true)} }></Auth>
    )
  }
}


export default App
