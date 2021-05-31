import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames/bind';
import moment from 'moment';

import styles from './styles.css';
import { Cell } from '../Cell';
import * as selectors from '../../../../selectors';
import { createTasksWithRating } from './utils';

const cx = classNames.bind(styles);

const hours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];


const mapStateToProps = state => ({
  calendarTasks: selectors.selectCalendarData(state),
  lang: state.lang
});
const mapDispatchToProps = dispatch => ({ dispatch });

export const Day = connect(mapStateToProps, mapDispatchToProps)(({ isExpanded, date, calendarTasks }) => {
  const currentDayTasks = calendarTasks.data.find(day => day.date === date.format('YYYY-MM-DD'));
  let timeTasks = [];
  let allDayTasks = [];
  if (currentDayTasks) {
    allDayTasks = currentDayTasks.tasks.filter(task => task.isAllDay)
    timeTasks = currentDayTasks.tasks.filter(task => !task.isAllDay)
  }

  timeTasks = createTasksWithRating(timeTasks)

  return (
    <div className={cx('day')}>
      {/* <AllDayZone tasks={allDayTasks}  /> */}
      {hours.map((item, index) => {
        if (!isExpanded && ( index > 0 && index < 6 )) {
          return null
        }
        const tasks = timeTasks.filter(task => Number(moment(task.dateStart).hours()) === index )
        return (
          <Cell key={index} isExpanded={isExpanded} item={item} date={date} tasks={tasks} />
        )
      })}
    </div>
  )
})

