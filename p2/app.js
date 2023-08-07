const { useState, useEffect } = React;

const App = () => {
  const [persons, setPersons] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [assignedTasks, setAssignedTasks] = useState({});

  const [newPerson, setNewPerson] = useState('');
  const [newTask, setNewTask] = useState('');
  const [assignedPerson, setAssignedPerson] = useState('');

  // State to track whether the person list is visible or hidden
  const [showPersonList, setShowPersonList] = useState(true);

  // Load data from local storage on initial render
  useEffect(() => {
    const savedPersons = JSON.parse(localStorage.getItem('persons') || '[]');
    const savedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const savedAssignedTasks = JSON.parse(localStorage.getItem('assignedTasks') || '{}');

    setPersons(savedPersons);
    setTasks(savedTasks);
    setAssignedTasks(savedAssignedTasks);
  }, []);

  // Save data to local storage whenever there's a change
  useEffect(() => {
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

  // Handle "Enter" key press in the person input field
  const handlePersonKeyDown = (event) => {
    if (event.keyCode === 13) {
      handleAddPerson();
    }
  };

  // Handle "Enter" key press in the task input field
  const handleTaskKeyDown = (event) => {
    if (event.keyCode === 13) {
      handleAddTask();
    }
  };

  // Handle toggle for showing/hiding the person list
  const handleTogglePersonList = () => {
    setShowPersonList(!showPersonList);
  };

  return (
    <div className="container mx-auto mt-5">
      <div className="mb-5">
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

      {/* Toggle button to show/hide the person list */}
      <div className="mb-5">
        <h2 className="text-2xl font-bold">
          <button
            className="text-blue-500"
            onClick={handleTogglePersonList}
          >
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

      <div className="mb-5">
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

      <div>
        <h2 className="text-2xl font-bold">List of Tasks:</h2>
        <ul className="list-disc list-inside">
          {tasks.map((task, index) => (
            <li key={index}>
              {task.task} - {task.person}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
