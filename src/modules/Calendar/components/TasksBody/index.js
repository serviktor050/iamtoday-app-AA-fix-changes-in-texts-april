import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import { connect } from 'react-redux';
import { dict } from 'dict';

import styles from './styles.css';
import { TasksDay } from './components/TasksDay';
import { getAllDayTasks } from '../../utils';
import * as selectors from '../../selectors';

const cx = classNames.bind(styles);

const mapStateToProps = state => ({ 
  lang: state.lang, 
  calendarData: selectors.selectCalendarData(state), 
  currentPeriod: selectors.selectCurrentPeriod(state),
});
const mapDispatchToProps = dispatch => ({ dispatch });

export const TasksBody = connect(mapStateToProps, mapDispatchToProps)(
  function TasksBody({ calendarData, currentPeriod, lang }) {
    const i18n = dict[lang];
    const tasksData = getAllDayTasks({ calendarData, currentPeriod });
    const isTasksData = !!tasksData;
    const tasksDataCopy = isTasksData ? [...tasksData] : [];
    const completedTasks = isTasksData && tasksData.length > 0 ? tasksData.reduce((tasks, day) => {
      const dayTasks = day.tasks.filter(task => task.isDone);
      return [...tasks, ...dayTasks]
    }, []) : []
    const noTasks = <span className={cx('noMessages')}>{i18n['calendar.tasks.no-tasks']}</span>
    return (
      <div className={cx('taskBody')}>
        {tasksDataCopy.length > 0 ? tasksDataCopy.map(day => <TasksDay dayTasks={day} />) : noTasks}
        {completedTasks.length > 0 && <TasksDay dayTasks={completedTasks} />}
      </div>
    )
  }
)
