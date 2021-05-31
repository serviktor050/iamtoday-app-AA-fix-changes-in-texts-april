import moment from 'moment';
import { CELL_HEIGHT } from '../../../../constants';

export const getTaskDays = (dateStart, dateEnd) => {
  const isEndsInOtherDay = dateEnd.date() - dateStart.date();
  if (isEndsInOtherDay) {
    const array = [];
    for (let i=1; i <= isEndsInOtherDay; i++) {
      array.push(i);
    }
    return array
  }
  return []
}

export const notAllDayTaskParams = (task, isExpanded) => {
  const dateStart = moment(task.dateStart);
  const dateEnd = moment(task.dateEnd);
  const isManyDaysTask = getTaskDays(dateStart, dateEnd).length > 0;
  const isTaskStartsBeforeSixAM = dateStart.hours() < 6;
  if (isTaskStartsBeforeSixAM) {
    const lengthInHours = isManyDaysTask ? 24 - (dateStart.hours() + dateStart.minutes() / 60) : (dateEnd.diff(dateStart, 'minutes') / 60);
    const heightFirstDay = isExpanded ? lengthInHours * CELL_HEIGHT : (lengthInHours - 5) * CELL_HEIGHT;
    return { dateStart, heightFirstDay }
  }
  const lengthInHours = isManyDaysTask ? 24 - (dateStart.hours() + dateStart.minutes() / 60) : (dateEnd.diff(dateStart, 'minutes') / 60);
  const heightFirstDay = (lengthInHours) * CELL_HEIGHT - 1;
  return { dateStart, heightFirstDay }
}

export const getPrevTask = function getPrevTask(task) {
  const { timeRating, tasks } = task.oneTimeTasks;
  let prevTask = tasks.find(task => ((timeRating - task.oneTimeTasks.timeRating === 1)));
  if (!prevTask) {
    const reversedTasks = tasks.reverse()
    prevTask = reversedTasks.find(task => ((timeRating - task.oneTimeTasks.timeRating > 1)))
  }
  return prevTask
}

export const checkSecondLevel = function (task, right, operator) {
  const { tasks, prevTask } = task.oneTimeTasks;
  const { prevTask: prevTask_prevTask } = prevTask.oneTimeTasks;

  if (tasks.includes(prevTask_prevTask.oneTimeTasks.prevTask)) {
    if (operator === '+') {
      right += prevTask_prevTask.oneTimeTasks.prevTask.oneTimeTasks.width;
    } else if (operator === '-') {
      right -= prevTask_prevTask.oneTimeTasks.prevTask.oneTimeTasks.width;
    }
  }
  return right
}

export const checkOffset = function (task, right, rightDirection) {
  const { width, prevTask, tasks } = task.oneTimeTasks;
  let { prevTask: prevTask_prevTask, width: prevTask_width, right: prevTask_right  } = prevTask.oneTimeTasks;

  const lessZero = function () {
    right = prevTask_right + prevTask_width;
    rightDirection = false;
    if (tasks.includes(prevTask_prevTask)) {
      right = prevTask_width + prevTask_right + prevTask_prevTask.oneTimeTasks.width;
      right = checkSecondLevel(task, right, '+');
    }
  }

  const more100 = function () {
    right = prevTask_right - width;
    rightDirection = true;
    if (tasks.includes(prevTask_prevTask)) {
      right = prevTask_right - width - prevTask_prevTask.oneTimeTasks.width;
      right = checkSecondLevel(task, right, '-');
    }
  }

  if (right + width > 100) {
    more100();
    if (right < 0) {
      lessZero();
      task.oneTimeTasks.width = 100 - right;
    }
    return { right, rightDirection }
  }

  if (right < 0) {
    lessZero();
    if (right + width > 100) {
      more100();
      if (right < 0) {
        lessZero();
        task.oneTimeTasks.width = 100 - right;
      }
    }
    return { right, rightDirection }
  }

  return { right, rightDirection }
}

export const getRight = function getRight(task) {
  const isPrevTask = task.oneTimeTasks.prevTask
  if (!isPrevTask) {
    return { right: 0, rightDirection: false }
  }

  const { prevTask, tasks, width } = task.oneTimeTasks;
  let { right, rightDirection } = task.oneTimeTasks;
  let { 
    rightDirection: prevTask_rightDirection, 
    prevTask: prevTask_prevTask, 
    width: prevTask_width, 
    right: prevTask_right,  
  } = prevTask.oneTimeTasks;

  if (prevTask_rightDirection) {
    right = prevTask_right - width;
    rightDirection = true;
    if (prevTask_right <= 0) {
      right = prevTask_width + prevTask_right;
      rightDirection = false;
      if (tasks.includes(prevTask_prevTask)) {
        right = prevTask_prevTask.oneTimeTasks.width + prevTask_prevTask.oneTimeTasks.right;
        right = checkSecondLevel(task, right, '+');
      }
    }
    ({ right, rightDirection } = checkOffset(task, right, rightDirection));
    return { right, rightDirection }
  }

  if (prevTask_right + prevTask_width >= 100) {
    right = (100 - (prevTask_width + width));
    rightDirection = true;
    ({ right, rightDirection } = checkOffset(task, right, rightDirection));
    return { right, rightDirection }
  } 

  right = prevTask_width + prevTask_right;
  rightDirection = false;
  ({ right, rightDirection } = checkOffset(task, right, rightDirection));
  return {right, rightDirection}
}