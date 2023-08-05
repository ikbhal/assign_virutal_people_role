#!/usr/bin/env node
const readline = require('readline');
const inquirer = require('inquirer');
// const chalk = require('chalk');
const Datastore = require('nedb');

const db = new Datastore({ filename: 'tasks.db', autoload: true });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Your task management functions here

function handleCommand(command) {
  switch (command) {
    case 'create-task':
      // Implement the function to create a new task
      console.log('Creating a new task...');
      createTask();
      break;
    case 'list-tasks':
      // Implement the function to list all tasks
      console.log('Listing all tasks...');
      listTasks();
      break;
    case 'update-task':
      // Implement the function to update a task
      console.log('Updating a task...');
      break;
    case 'delete-task':
      // Implement the function to delete a task
      console.log('Deleting a task...');
      break;
    case 'exit':
      console.log('Goodbye!');
      rl.close();
      break;
    default:
      console.log('Invalid command. Type "help" to see available commands.');
  }
}

// Assuming you have the db instance defined and accessible in your code

function listTasks() {
  db.find({}, (err, tasks) => {
    if (err) {
      console.error('Error retrieving tasks:', err);
    } else {
      if (tasks.length === 0) {
        console.log('No tasks found.');
      } else {
        console.log('List of tasks:');
        tasks.forEach((task, index) => {
          console.log(
            `${index + 1}. ${task.title} [Assignee: ${task.assignee || 'Unassigned'}] [State: ${task.state}]`
          );
        });
      }
    }
  });
}

function createTask() {
  inquirer
      .prompt([
        {
          type: 'input',
          name: 'title',
          message: 'Enter task title:',
        },
        {
          type: 'input',
          name: 'description',
          message: 'Enter task description:',
        },
      ])
      .then((answers) => {
        const task = {
          title: answers.title,
          description: answers.description,
          assignee: '',
          state: 'not started',
        };
        console.log("task:", task );

        db.insert(task, (err, newTask) => {
          if (err) {
            // console.error(chalk.red('Error creating task:', err));
            console.error('Error creating task:', err);
          } else {
            // console.log(chalk.green('Task created successfully!'));
            console.log('Task created successfully!');
          }
        });
      });
}

// ...

// Main CLI loop
function startCLI() {
  // while(true){
  rl.question('Type a command (type "help" to see available commands): ', (answer) => {
    const command = answer.trim().toLowerCase();
    handleCommand(command);
    if (command !== 'exit') {
      startCLI();
    }
  });
  // }
}

startCLI();
