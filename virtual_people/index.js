const readline = require('readline');
const Datastore = require('nedb');

const db = {};
db.people = new Datastore();
db.tasks = new Datastore();

db.people.loadDatabase();
db.tasks.loadDatabase();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function addPerson(name) {
  const person = { name };
  db.people.insert(person, (err, newPerson) => {
    if (err) {
      console.error('Error adding person:', err);
    } else {
      console.log(`Added person: ID: ${newPerson._id}, Name: ${newPerson.name}`);
    }
  });
}

function listPeople() {
  db.people.find({}, (err, people) => {
    if (err) {
      console.error('Error fetching people:', err);
    } else {
      console.log('People:');
      people.forEach(person => {
        const taskInfo = person.task ? `(Task ID: ${person.task._id}, Name: ${person.task.name})` : '(No Task assigned)';
        console.log(`ID: ${person._id}, Name: ${person.name} ${taskInfo}`);
      });
    }
  });
}

function editPerson(name, newName) {
  db.people.update({ name }, { $set: { name: newName } }, { multi: true }, (err, numReplaced) => {
    if (err) {
      console.error('Error updating person:', err);
    } else if (numReplaced === 0) {
      console.log(`Person "${name}" not found.`);
    } else {
      console.log(`Updated person: Name: ${name}, New Name: ${newName}`);
    }
  });
}

function deletePersonById(id) {
  db.people.remove({ _id: id }, {}, (err, numRemoved) => {
    if (err) {
      console.error('Error deleting person:', err);
    } else if (numRemoved === 0) {
      console.log(`Person with ID "${id}" not found.`);
    } else {
      console.log(`Deleted person with ID: ${id}`);
    }
  });
}

function deletePersonByName(name) {
  db.people.remove({ name }, { multi: true }, (err, numRemoved) => {
    if (err) {
      console.error('Error deleting person:', err);
    } else if (numRemoved === 0) {
      console.log(`Person "${name}" not found.`);
    } else {
      console.log(`Deleted ${numRemoved} person(s) with name "${name}"`);
    }
  });
}

function addTask(name) {
  const task = { name };
  db.tasks.insert(task, (err, newTask) => {
    if (err) {
      console.error('Error adding task:', err);
    } else {
      console.log(`Added task: ID: ${newTask._id}, Name: ${newTask.name}`);
    }
  });
}

function listTasks() {
  db.tasks.find({}, (err, tasks) => {
    if (err) {
      console.error('Error fetching tasks:', err);
    } else {
      console.log('Tasks:');
      tasks.forEach(task => {
        console.log(`ID: ${task._id}, Name: ${task.name}`);
      });
    }
  });
}

function deleteTaskById(id) {
  db.tasks.remove({ _id: id }, {}, (err, numRemoved) => {
    if (err) {
      console.error('Error deleting task:', err);
    } else if (numRemoved === 0) {
      console.log(`Task with ID "${id}" not found.`);
    } else {
      console.log(`Deleted task with ID: ${id}`);
    }
  });
}

function deleteTaskByName(name) {
  db.tasks.remove({ name }, { multi: true }, (err, numRemoved) => {
    if (err) {
      console.error('Error deleting task:', err);
    } else if (numRemoved === 0) {
      console.log(`Task "${name}" not found.`);
    } else {
      console.log(`Deleted ${numRemoved} task(s) with name "${name}"`);
    }
  });
}

function assignTask(personName, taskName) {
  db.people.findOne({ name: personName }, (err, person) => {
    if (err) {
      console.error('Error finding person:', err);
    } else if (!person) {
      console.log(`Person "${personName}" not found.`);
    } else {
      db.tasks.findOne({ name: taskName }, (err, task) => {
        if (err) {
          console.error('Error finding task:', err);
        } else if (!task) {
          console.log(`Task "${taskName}" not found.`);
        } else {
          db.people.update({ name: personName }, { $set: { task: task } }, {}, (err) => {
            if (err) {
              console.error('Error assigning task:', err);
            } else {
              console.log(`Assigned task "${task.name}" to ${person.name}`);
            }
          });
        }
      });
    }
  });
}

function showMenu() {
  console.log('\nMenu:');
  console.log('1. Add Person (ap)');
  console.log('2. List People (lp)');
  console.log('3. Edit Person (ep)');
  console.log('4. Delete Person by ID (dpid)');
  console.log('5. Delete Person by Name (dpn)');
  console.log('6. Add Task (at)');
  console.log('7. List Tasks (lt)');
  console.log('8. Delete Task by ID (dtid)');
  console.log('9. Delete Task by Name (dtn)');
  console.log('10. Assign Task to Person (atp)');
  console.log('0. Exit (q)');
}

rl.on('line', (input) => {
  const [command, ...args] = input.trim().split(' ');

  switch (command.toLowerCase()) {
    case '1':
    case 'ap':
      const [personName] = args;
      addPerson(personName);
      break;
    case '2':
    case 'lp':
      listPeople();
      break;
    case '3':
    case 'ep':
      const [name, newPersonName] = args;
      editPerson(name, newPersonName);
      break;
    case '4':
    case 'dpid':
      const [personId] = args;
      deletePersonById(personId);
      break;
    case '5':
    case 'dpn':
      const [personNameToDelete] = args;
      deletePersonByName(personNameToDelete);
      break;
    case '6':
    case 'at':
      const [taskName] = args;
      addTask(taskName);
      break;
    case '7':
    case 'lt':
      listTasks();
      break;
    case '8':
    case 'dtid':
      const [taskId] = args;
      deleteTaskById(taskId);
      break;
    case '9':
    case 'dtn':
      const [taskNameToDelete] = args;
      deleteTaskByName(taskNameToDelete);
      break;
    case '10':
    case 'atp':
      const [personNameToAssign, taskNameToAssign] = args;
      assignTask(personNameToAssign, taskNameToAssign);
      break;
    case '0':
    case 'q':
      rl.close();
      break;
    default:
      console.log('Invalid command. Please try again.');
  }

  showMenu();
});

showMenu();
