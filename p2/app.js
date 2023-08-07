const { useState, useEffect } = React;

const App = () => {
  const [persons, setPersons] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [assignedTasks, setAssignedTasks] = useState({});

  const [newPerson, setNewPerson] = useState('');
  const [newTask, setNewTask] = useState('');
  const [assignedPerson, setAssignedPerson] = useState('');

  const [showPersonList, setShowPersonList] = useState(true);
  const [showTaskList, setShowTaskList] = useState(true);

  const [personFilter, setPersonFilter] = useState('');
  const [taskFilter, setTaskFilter] = useState('');

  const [taskStatus, setTaskStatus] = useState({});

  useEffect(() => {
    const savedPersons = JSON.parse(localStorage.getItem('persons') || '[]');
    const savedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const savedAssignedTasks = JSON.parse(localStorage.getItem('assignedTasks') || '{}');
    const savedTaskStatus = JSON.parse(localStorage.getItem('taskStatus') || '{}');

    setPersons(savedPersons);
    setTasks(savedTasks);
    setAssignedTasks(savedAssignedTasks);
    setTaskStatus(savedTaskStatus);
  }, []);

  useEffect(() => {
    localStorage.setItem('persons', JSON.stringify(persons));
  }, [persons]);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('assignedTasks', JSON.stringify(assignedTasks));
  }, [assignedTasks]);

  useEffect(() => {
    localStorage.setItem('taskStatus', JSON.stringify(taskStatus));
  }, [taskStatus]);

  const handleAddPerson = () => {
    setPersons([...persons, newPerson]);
    setNewPerson('');
  };

  const handleAddTask = () => {
    setTasks([...tasks, { task: newTask, person: assignedPerson }]);
    setNewTask('');
    setAssignedPerson('');
  };

  const handlePersonKeyDown = (event) => {
    if (event.keyCode === 13) {
      handleAddPerson();
    }
  };

  const handleTaskKeyDown = (event) => {
    if (event.keyCode === 13) {
      handleAddTask();
    }
  };

  const handleTogglePersonList = () => {
    setShowPersonList(!showPersonList);
  };

  const handleToggleTaskList = () => {
    setShowTaskList(!showTaskList);
  };

  const handlePersonFilterChange = (event) => {
    setPersonFilter(event.target.value);
  };

  const handleTaskFilterChange = (event) => {
    setTaskFilter(event.target.value);
  };

  const handleTaskCheckboxChange = (index) => {
    setTaskStatus((prevStatus) => ({
      ...prevStatus,
      [index]: !prevStatus[index],
    }));
  };

  const handleDeleteTask = (index) => {
    const updatedTasks = tasks.filter((_, taskIndex) => taskIndex !== index);
    setTasks(updatedTasks);
    setTaskStatus((prevStatus) => {
      const updatedStatus = { ...prevStatus };
      delete updatedStatus[index];
      return updatedStatus;
    });
  };

  return (
    <div className="container mx-auto mt-5">
      <div className="mb-5" style={{ borderRadius: "10px", border: "1px solid blue", padding: "10px", margin: "10px" }}>
        <h2 className="text-2xl font-bold">Create Person:</h2>
        <input
          type="text"
          className="border border-gray-400 px-2 py-1 rounded"
          placeholder="Enter person name"
          value={newPerson}
          onChange={(e) => setNewPerson(e.target.value)}
          onKeyDown={handlePersonKeyDown}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded ml-2"
          onClick={handleAddPerson}
        >
          Add Person
        </button>
      </div>

      <div className="mb-5" style={{ borderRadius: "10px", border: "1px solid blue", padding: "10px", margin: "10px" }}>
        <h2 className="text-2xl font-bold">
          <button className="text-blue-500" onClick={handleTogglePersonList}>
            {showPersonList ? 'Hide Person List' : 'Show Person List'}
          </button>
        </h2>
        {showPersonList && (
          <div>
            {persons.length > 0 ? (
              <ul className="list-disc list-inside">
                {persons.map((person, index) => (
                  <li key={index}>{person}</li>
                ))}
              </ul>
            ) : (
              <p>No persons found.</p>
            )}
          </div>
        )}
      </div>

      <div className="mb-5" style={{ borderRadius: "10px", border: "1px solid blue", padding: "10px", margin: "10px" }}>
        <h2 className="text-2xl font-bold">Create Task:</h2>
        <input
          type="text"
          className="border border-gray-400 px-2 py-1 rounded"
          placeholder="Enter task description"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={handleTaskKeyDown}
        />
        <select
          className="border border-gray-400 px-2 py-1 rounded ml-2"
          value={assignedPerson}
          onChange={(e) => setAssignedPerson(e.target.value)}
        >
          <option value="">Assign to:</option>
          {persons.map((person, index) => (
            <option key={index} value={person}>
              {person}
            </option>
          ))}
        </select>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded ml-2"
          onClick={handleAddTask}
        >
          Add Task
        </button>
      </div>

      <div className="mb-5" style={{ borderRadius: "10px", border: "1px solid blue", padding: "10px", margin: "10px" }}>
        <h2 className="text-2xl font-bold">
          <button className="text-blue-500" onClick={handleToggleTaskList}>
            {showTaskList ? 'Hide Task List' : 'Show Task List'}
          </button>
        </h2>
        {showTaskList && (
          <div>
            <h2 className="text-2xl font-bold">List of Tasks:</h2>
            <input
              type="text"
              className="border border-gray-400 px-2 py-1 rounded"
              placeholder="Filter tasks by person"
              value={personFilter}
              onChange={handlePersonFilterChange}
            />
            <input
              type="text"
              className="border border-gray-400 px-2 py-1 rounded ml-2"
              placeholder="Filter tasks by task description"
              value={taskFilter}
              onChange={handleTaskFilterChange}
            />
            <ul className="list-disc list-inside">
              {tasks.map((task, index) => {
                const personMatch =
                  personFilter === '' || task.person.toLowerCase().includes(personFilter.toLowerCase());
                const taskMatch =
                  taskFilter === '' || task.task.toLowerCase().includes(taskFilter.toLowerCase());

                if (personMatch && taskMatch) {
                  return (
                    <li key={index} className="flex items-center">
                      <button
                        className="text-red-500 mr-2"
                        onClick={() => handleDeleteTask(index)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                      <label>
                        <input
                          type="checkbox"
                          checked={taskStatus[index] || false}
                          onChange={() => handleTaskCheckboxChange(index)}
                        />
                        <span className={taskStatus[index] ? 'line-through' : ''}>
                          {task.task} - {task.person}
                        </span>
                      </label>
                    </li>
                  );
                }
                return null;
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
