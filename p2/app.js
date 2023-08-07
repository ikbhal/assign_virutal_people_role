const { useState, useEffect } = React;

const App = () => {
  const [persons, setPersons] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [assignedTasks, setAssignedTasks] = useState({});

  const [newPerson, setNewPerson] = useState('');
  const [newTask, setNewTask] = useState('');
  const [assignedPerson, setAssignedPerson] = useState('');

  const [showPersonList, setShowPersonList] = useState(true);
  const [showTaskList, setShowTaskList] = useState(true); // New state for task list visibility

  const [personFilter, setPersonFilter] = useState('');
  const [taskFilter, setTaskFilter] = useState('');

  useEffect(() => {
    // Load data from local storage on initial render
    const savedPersons = JSON.parse(localStorage.getItem('persons') || '[]');
    const savedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const savedAssignedTasks = JSON.parse(localStorage.getItem('assignedTasks') || '{}');

    setPersons(savedPersons);
    setTasks(savedTasks);
    setAssignedTasks(savedAssignedTasks);
  }, []);

  useEffect(() => {
    // Save data to local storage whenever there's a change
    localStorage.setItem('persons', JSON.stringify(persons));
  }, [persons]);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('assignedTasks', JSON.stringify(assignedTasks));
  }, [assignedTasks]);

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
  }; // Function to toggle task list visibility

  const handlePersonFilterChange = (event) => {
    setPersonFilter(event.target.value);
  };

  const handleTaskFilterChange = (event) => {
    setTaskFilter(event.target.value);
  };

  return (
    <div className="container mx-auto mt-5">
      <div className="mb-5">
        <h2 className="text-2xl font-bold">Create Person:</h2>
        {/* ... (rest of the person input code remains the same) */}
      </div>

      <div className="mb-5">
        <h2 className="text-2xl font-bold">
          <button className="text-blue-500" onClick={handleTogglePersonList}>
            {showPersonList ? 'Hide Person List' : 'Show Person List'}
          </button>
        </h2>
        {showPersonList && (
          <div>
            {/* ... (rest of the person list code remains the same) */}
          </div>
        )}
      </div>

      <div className="mb-5">
        <h2 className="text-2xl font-bold">Create Task:</h2>
        {/* ... (rest of the task input code remains the same) */}
      </div>

      <div className="mb-5">
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
                    <li key={index}>
                      {task.task} - {task.person}
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
