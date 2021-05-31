import moment from 'moment';
import { DAY, MONTH, SEVEN_DAYS, WEEK } from './constants';
import { capitalize } from 'modules/utils';
import * as R from 'ramda';

export function getWeekWithOffset(weekOffset = 0) {
    const currentDate = moment();

    const weekStart = currentDate.clone().startOf('isoWeek').add(weekOffset, 'w');

    const days = []; // for display
    const isoWeek = []; // for backend

    for (let i = 0; i <= 6; i++) {
        days.push(moment(weekStart).add(i, 'days').format("dd DD MMMM").toLocaleUpperCase());
        isoWeek.push(moment(weekStart).add(i, 'days').format())
    }

    const week = days.map(day => {
        const [weekday, date, month] = day.split(' ')
        return { weekday, date, month }
    })

    return { week, isoWeek }
}

export function formateDateForDisplaying(date, period) {
    if (period === MONTH) {
        return capitalize(moment(date).format('MMMM YYYY'))
    } else if ( period === SEVEN_DAYS ) {
        const dateStart = date;
        const dateEnd = date.clone().add(6, 'day');
        const isOneMonth = dateStart.format('MM') === dateEnd.format('MM')
        return isOneMonth ? `${dateStart.format('DD')}-${dateEnd.format('LL')}` : `${dateStart.format('LL').split(' ').slice(0, 2).join(' ')} - ${dateEnd.format('LL')}`
    }
    return moment(date).format('LL').split(' ').slice(0, 2).join(' ')
}

export const isDataNotFetched = (prop) => {
    return !prop || prop.isFetching || !prop.isLoad || !prop.data;
}

export const isTasks = (location) => {
    if (location) {
        const pathname = location.pathname.split('/');
        return pathname[pathname.length - 1] === 'tasks'
    }
    return false
}

export const getAllDayTasks = function ({ calendarData, currentPeriod }) {
  const dateStart = moment(currentPeriod.dateStart).startOf('day');
  const dateEnd = moment(currentPeriod.dateEnd).startOf('day');
  const calendarDataTasks = R.path(['data'], calendarData);
  const tasks = calendarDataTasks.filter((day) => {
    const date = moment(day.date).startOf('day');
    return (dateStart.isSameOrBefore(date) &&  dateEnd.isAfter(date))
  })
  return tasks
}
  
export const sortByDate = function(a, b) {
  if (moment(a.date).isBefore(moment(b.date))) return -1
  if (moment(a.date).isSame(moment(b.date))) return 0
  return 1
}