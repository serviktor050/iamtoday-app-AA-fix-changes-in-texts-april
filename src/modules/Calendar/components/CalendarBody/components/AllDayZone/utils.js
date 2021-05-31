import moment from 'moment';
import * as R from 'ramda';

export const getAllDayTasks = function ({ calendarData, currentPeriod }) {
  const dateStart = moment(currentPeriod.dateStart).startOf('day');
  const dateEnd = moment(currentPeriod.dateEnd).startOf('day');
  const calendarDataTasks = R.path(['data'], calendarData).slice();
  const tasks = calendarDataTasks.filter((day) => {
    const date = moment(day.date).startOf('day');
    return (dateStart.isSameOrBefore(date) &&  dateEnd.isAfter(date))
  })
  const allDayTasks = tasks.reduce((acc, cur) => {
    const tasks = cur.tasks.filter((task) => task.isAllDay)
    const day = {...cur, tasks};
    return [...acc, day]
  }, [])
  return allDayTasks
}

export const sortByDate = function(a, b) {
  if (moment(a.date).isBefore(moment(b.date))) return -1
  if (moment(a.date).isSame(moment(b.date))) return 0
  return 1
}

export const getDayDeleteDuplicates = function getDaysCountAndDeleteDuplicatesOfTaskInOtherDays({ task, allDayTasksForPeriodSorted }) {
  let count = 0;
  const { id, dateStart } = task;
  for (let day of allDayTasksForPeriodSorted) {
    const { tasks } = day;
    for (let task of tasks) {
      if (task.id === id) {
        count++
      }
    }
    day.tasks = day.tasks.filter((task) => !(task.id === id && task.dateStart !== dateStart))
  }
  return count
}

export const formateAllDayTasks = function ({ allDayTasksForPeriod, currentPeriod }) {
  const allDayTasksForPeriodSorted = [...allDayTasksForPeriod]
  allDayTasksForPeriodSorted.sort(sortByDate)
  if (!allDayTasksForPeriodSorted.length) {
    return []
  }
  const dateStart = moment(currentPeriod.dateStart).clone().startOf('day');
  allDayTasksForPeriodSorted.forEach((day) => {
    const { tasks, date } = day;
    tasks.forEach((task) => {
      task.daysCount = getDayDeleteDuplicates({ task, allDayTasksForPeriodSorted })
      task.daysFromPeriodStart = moment(date).diff(dateStart, 'd')
    })
  })
  return allDayTasksForPeriodSorted.reduce((acc, cur) => {
    return [...acc, ...cur.tasks]
  }, [])
}

export const setRating = function setRating({ minRating, tasks, id }) {
  const isTaskWithMinRatingExist = tasks.find((task) => task.rating === minRating && task.id !== id)
  if (isTaskWithMinRatingExist) {
    return setRating({ minRating: minRating + 1, tasks, id })
  }
  return minRating
}

export const rateTasks = function (formatedTasks) {
  if (!formatedTasks.length) {
    return []
  }
  const ratedTasks = [...formatedTasks];
  ratedTasks.forEach((task) => {
    const { daysFromPeriodStart } = task;
    const beforeTasks = ratedTasks.filter((ratedTask) => {
      if (ratedTask.daysFromPeriodStart < daysFromPeriodStart) {
        return ((ratedTask.daysFromPeriodStart + ratedTask.daysCount) > daysFromPeriodStart)
      }
      return task.daysFromPeriodStart === daysFromPeriodStart
    })
    task.rating = setRating({ minRating: 0, tasks: beforeTasks, id: task.id })
  })
  return ratedTasks
}