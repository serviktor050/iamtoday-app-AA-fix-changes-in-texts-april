import moment from 'moment';
import * as R from 'ramda';

function getOneTimeTasks(task, tasks) {
  const dateStart = moment(task.dateStart);
  const dateEnd = moment(task.dateEnd);
  const id = task.id;
  let result = [];
  tasks.forEach(timeTask => {
    if (timeTask.id !== id) {
      if (dateStart.isAfter(timeTask.dateStart) && dateStart.isBefore(timeTask.dateEnd)) {
        result.push(timeTask)
      }
      if (dateStart.isBefore(timeTask.dateStart) && dateEnd.isAfter(timeTask.dateStart)) {
        result.push(timeTask)
      }
      if (dateStart.isSame(timeTask.dateStart)) {
        result.push(timeTask)
      }
    }
  });
  result.sort(compareTask)
  return { tasks: result }
}

function findMaxNeighbor(tasks) {
  if (tasks.length === 0) {
    return 0
  }
  const firstTask = tasks[0];
  let max = R.path(['oneTimeTasks', 'neighbors'], firstTask)
  for (let task of tasks) {
    if (task.oneTimeTasks.neighbors > max) {
      max = task.oneTimeTasks.neighbors
    }
  }
  return max;
}

function addNeighbors(task) {
  const { tasks, neighbors } = task.oneTimeTasks;
  const tasksMaxLength = findMaxNeighbor(tasks);
  return tasksMaxLength < neighbors ? tasksMaxLength : neighbors
}

function findRating(rating, tasks) {
  const isRating = tasks.find(task => R.path(['oneTimeTasks', 'rating'], task) === rating);
  if (isRating) {
    return findRating(rating + 1, tasks)
  }
  return rating
} 

function rateTask(task) {
  const { tasks } = task.oneTimeTasks;
  const maxRating = 0;
  const rating = findRating(maxRating, tasks);
  return rating
}

function addWidthAndOffset(task) {
  const { tasks, neighbors, rating } = task.oneTimeTasks;

  const maxTasksNeighbors = findMaxNeighbor(tasks);

  const shouldWider = maxTasksNeighbors > neighbors;

  const width = shouldWider ? (100 - (100 / (maxTasksNeighbors + 1))) / neighbors : 100 / (neighbors + 1)
  const right = shouldWider ? (100 / (maxTasksNeighbors + 1)) * rating : width * (rating)
  return { width, right }
}

function compareTask(a, b) {
  if (moment(a.dateStart).hours() > moment(b.dateStart).hours()) return 1;
  if (moment(a.dateStart).isSame(b.dateStart)) return 0;
  return -1
}

export function createTasksWithRating(rawTasks) {
  let tasks = rawTasks.map(item => item);
  tasks.sort(compareTask)
  tasks.forEach(task => { task.oneTimeTasks = getOneTimeTasks(task, tasks) });
  tasks.forEach((task, index) => { task.oneTimeTasks.timeRating = (index + 1) })
  tasks.forEach(task => { task.oneTimeTasks.neighbors = task.oneTimeTasks.tasks.length });
  tasks.forEach(task => { 
    const maxNeighbors = addNeighbors(task);
    task.oneTimeTasks.neighbors = maxNeighbors;
    task.oneTimeTasks.rating = 999;
  });
  tasks.forEach(task => { task.oneTimeTasks.rating = rateTask(task) });
  tasks.forEach(task => {
    const { width, right } = addWidthAndOffset(task);
    task.oneTimeTasks.right = right;
    task.oneTimeTasks.width = width;
  })
  return tasks
}