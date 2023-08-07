const { useState } = React;

const App = () => {
  const [persons, setPersons] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [newPerson, setNewPerson] = useState('');
  const [newTask, setNewTask] = useState('');
  const [assignedPerson, setAssignedPerson] = useState('');

  const handleAddPerson = () => {
    setPersons([...persons, newPerson]);
    setNewPerson('');
  };

  const handleAddTask = () => {
    setTasks([...tasks, { task: newTask, person: assignedPerson }]);
    setNewTask('');
    setAssignedPerson('');
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
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded ml-2"
          onClick={handleAddPerson}
        >
          Add Person
        </button>
      </div>

      <div className="mb-5">
        <h2 className="text-2xl font-bold">List of Persons:</h2>
        <ul className="list-disc list-inside">
          {persons.map((person, index) => (
            <li key={index}>{person}</li>
          ))}
        </ul>
      </div>

      <div className="mb-5">
        <h2 className="text-2xl font-bold">Create Task:</h2>
        <input
          type="text"
          className="border border-gray-400 px-2 py-1 rounded"
          placeholder="Enter task description"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <select
          className="border border-gray-400 px-2 py-1 rounded ml-2"
          value={assignedPerson}
          onChange={(e) => setAssignedPerson(e.target.value)}
        >
          <option value="">Assign to:</option>
          {persons.map((person, index) => (
            <option key={index} value={person}>{person}</option>
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
