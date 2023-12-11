import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import Ticker, { FinancialTicker } from 'nice-react-ticker';

import './Todo.css';

function generateUniqueId() {
  const timestamp = new Date().getTime();
  const randomNum = Math.floor(Math.random() * 1000);
  return `id_${timestamp}_${randomNum}`;
}

function generateRandomNumber() {
  return Math.random() * 0.5 + 0.5;
}

// Some Axios API stuff
async function postData(url = '', data = {}) {
  try {
    const response = await axios.post(url, data);
    console.log('Data posted successfully:', response.data);
  } catch (error) {
    console.log('An error occurred:', error);
  }
}

async function postData_two(url = '', data = {}) {
  try {
    const response = await axios.post(url, data);
    console.log('Data posted successfully:', response.data);
    return response.data
  } catch (error) {
    console.log('An error occurred:', error);
  }
}

async function getMoneyData(url) {
  try {
    const response = await axios.get(url);
    return response.data
  } catch (error) {
    console.log('An error occurred:', error);
  }
}

async function getWeatherData(url) {
  try {
    const response = await axios.get(url);
    return response.data
  } catch (error) {
    console.log('An error occurred:', error);
  }
}

// The Actual to do list
const TodoList = ({ Token }) => {
  // State variables
  const [tasks, setTasks] = useState([]); // Holds the list of tasks
  const [inputValue, setInputValue] = useState(''); // Holds the value of the input field
  const [filter, setFilter] = useState('all'); // Holds the current filter type

  // API Data stuff
  const [moneyData, setMoneyData] = useState([])
  const [weatherData, setWeatherData] = useState(null)
  const [token, setToken] = React.useState("")

  const loadMoneyData = async () => {
    let res = await getMoneyData('http://localhost:4000/money-api')
    if (JSON.stringify(res.data) != JSON.stringify(moneyData)) {
      setMoneyData(res.data);
    }
  }

  const loadWeatherData = async () => {
    let res = await getWeatherData('http://localhost:4000/weather-api')
    if (JSON.stringify(res) != JSON.stringify(weatherData)) {
      setWeatherData(res);
    }
  }

  const loadUserData = async () => {
    let res = await postData_two(
      'http://localhost:4000/stupid-endpoint-zero', 
      {
        userID: `${token}`
      }
    )

    Promise.resolve(res).then((r) => {
      if (JSON.stringify(r) != JSON.stringify({})) {
        let restored_Tasks = []
        for (let i = 0; i < r.length; i++) {
          let item = r[i];
  
          restored_Tasks.push(
            {
              title: item.text,
              completed: (item.status == "incomplete" ? false : true),
              id: item.id
            }
          )
        }
  
        setTasks(restored_Tasks);
        console.log("Restored tasks:", restored_Tasks);
      }
    });
  }

  useEffect(() => {
    setToken(Token.clientId)
    console.log("Fetching Data!")
    loadMoneyData();
    loadUserData();
    // loadWeatherData();
    // console.log(weatherData)
  }, [moneyData, weatherData]);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  // Add task
  const handleAddTask = async () => {
    if (inputValue.trim() === '') {
      return;
    }

    let id = generateUniqueId()

    const addedTask = {
      title: inputValue,
      completed: false,
      id: `${id}`
    };

    setTasks((prevTasks) => [...prevTasks, addedTask]); // Add to the list of tasks
    setInputValue(''); // Reset input valye
    toast.success('Task added successfully'); // Toast it for success
 
    // We pass our input to our data endpoint that records our stuff
    postData(
      'http://localhost:4000/stupid-endpoint-one', 
      {
        text: `${inputValue}`,
        userID: `${token}`,
        status: `incomplete`,
        id: `${id}`
      }
    );
  };

  const setCompleteStatus = (task) => {
    if (!task.completed == true) {
      postData(
        'http://localhost:4000/stupid-endpoint-three', 
        {
          id: `${task.id}`,
          status: `complete`,
        }
      );
    } else {
      postData(
        'http://localhost:4000/stupid-endpoint-three', 
        {
          id: `${task.id}`,
          status: `incomplete`,
        }
      );
    }
    
    return !task.completed
  }

  // Handle checkbox change for a task
  const handleTaskCheckboxChange = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? ({ ...task, completed: setCompleteStatus(task) }) : task
      )
    );
  };

  // Delete a task
  const handleDeleteTask = (taskId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    toast.success('Task deleted successfully');

    postData(
      'http://localhost:4000/stupid-endpoint-two', 
      {
        id: `${taskId}`
      }
    );
  };

  // Handle filter change
  const handleFilterChange = (filterType) => {
    setFilter(filterType);
  };

  // Filter tasks based on the selected filter
  const filteredTasks = tasks.filter((task) => {
    if (filter === 'all') {
      return true;
    } else if (filter === 'completed') {
      return task.completed;
    } else if (filter === 'uncompleted') {
      return !task.completed;
    }
    return true;
  });

  // Render the Todo list
  return (
    <>
      <div id='ticker' key={generateUniqueId()}>
        {(moneyData.length !== 0) ? 
        <Ticker
          slideSpeed={500}
          key={generateUniqueId()}
        >
          {moneyData.map((item) => {
            let percent = generateRandomNumber().toFixed(2)
            let per_val = parseFloat(percent) * parseFloat(item.exchange_rate)

            let prev_num = parseFloat(item.exchange_rate)
            if (parseFloat(percent) >= 0.6) {
              prev_num = parseFloat(prev_num + per_val).toFixed(2)
            } else {
              prev_num = parseFloat(prev_num - per_val).toFixed(2)
            }
            

            return(
            <FinancialTicker 
              id={generateUniqueId()}
              change={((prev_num <= parseFloat(item.exchange_rate)) ? false : true)} 
              symbol={`${item.currency}`} 
              lastPrice={`${prev_num}`} 
              percentage={`${percent}%`}
              currentPrice={`${item.exchange_rate}`} 
            />)
          })}
        </Ticker> 
        : 
        <div/>
        }
      </div>

      <div className="container_A">
        <ToastContainer />
        <div className="todo-app">
          <h2 id='Title'>
            {"My To Do List"}
          </h2>
          <div className="row">
            <i className="fas fa-list-check"></i>
            <input
              type="text"
              className="add-task"
              id="add"
              placeholder="Add your todo"
              autoFocus
              value={inputValue}
              onChange={handleInputChange}
            />
            <button id="btn" onClick={handleAddTask}>
              {'Add'}
            </button>
          </div>

          {weatherData ? 
            <div className="mid">
                  <Card className="card" sx={{ minWidth: 275, width: "80%", borderRadius: 5, height: "inherit"}}>
                    <CardContent>
                      <Typography sx={{ 
                        marginTop: 2,
                        marginLeft: 2,
                        fontSize: 23, 
                        fontWeight: "200px", 
                        color: "black" 
                        }} color="text.secondary" gutterBottom>
                        Boston, MA
                      </Typography>
                      <Typography variant="h5" component="div"
                      sx={{ 
                        marginLeft: 1,
                        fontSize: 50, 
                        fontWeight: "200px", 
                        color: "black" 
                        }} >
                        {`${weatherData.current.temperature} °C`}
                      </Typography>
                      <Typography variant="body2"
                        sx={{ 
                          marginLeft: 2,
                          }}
                      >
                        {`Humidity: ${weatherData.current.humidity}`}
                      </Typography>
                      <Typography variant="body2"
                        sx={{ 
                          marginLeft: 2,
                          }}
                      >
                        {`Wind Speed: ${weatherData.current.wind_speed}`}
                      </Typography>
                      <Typography variant="body2"
                        sx={{ 
                          marginLeft: 2,
                          }}
                      >
                        {`Observation Time: ${weatherData.current.observation_time}`}
                      </Typography>
                    </CardContent>
                  </Card>
            </div>
            :
            <div/>
          }

          <ul id="list">
            {filteredTasks.map((task) => (
              <li key={task.id}>
                <input
                  type="checkbox"
                  id={`task-${task.id}`}
                  data-id={task.id}
                  className="custom-checkbox"
                  checked={task.completed}
                  onChange={() => handleTaskCheckboxChange(task.id)}
                />
                <label htmlFor={`task-${task.id}`}>{task.title}</label>
                <div>
                  <img
                    src="https://cdn-icons-png.flaticon.com/128/3096/3096673.png"
                    className="delete"
                    data-id={task.id}
                    onClick={() => handleDeleteTask(task.id)}
                  />
                </div>
              </li>
            ))}
          </ul>

          <div className="filters">
            <div className="dropdown">
              <button className="dropbtn">Filter</button>
              <div className="dropdown-content">
                <a href="#" id="all" onClick={() => handleFilterChange('all')}>
                  All
                </a>
                <a href="#" id="rem" onClick={() => handleFilterChange('uncompleted')}>
                  Uncompleted
                </a>
                <a href="#" id="com" onClick={() => handleFilterChange('completed')}>
                  Completed
                </a>
              </div>
            </div>

            <div className="completed-task">
              <p>
                Completed: <span id="c-count">{tasks.filter((task) => task.completed).length}</span>
              </p>
            </div>
            <div className="remaining-task">
              <p>
                <span id="total-tasks">
                  Total Tasks: <span id="tasks-counter">{tasks.length}</span>
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TodoList;