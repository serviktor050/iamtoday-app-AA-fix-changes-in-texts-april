import React from 'react';
import classNames from 'classnames/bind';
import moment from 'moment';
import { connect } from 'react-redux';
import { dict } from 'dict';

import styles from './styles.css';
import { TaskFull } from '../TaskFull';

const cx = classNames.bind(styles);

const mapStateToProps = state => ({ lang: state.lang });
const mapDispatchToProps = dispatch => ({ dispatch })

export const TasksDay = connect(mapStateToProps, mapDispatchToProps)(({ dayTasks, lang }) => {
  const i18n = dict[lang];
  const today = moment();
  const tomorrow = today.clone().add(1, 'd');
  if (dayTasks.length) {
    return (
      <div className={cx('tasksDay')}>
        <div className={cx('taskDay__header')}>
          <span className={cx('taskDay__date')}>{i18n['calendar.tasks.completed-tasks']}</span>
        </div> 
        <div className={cx('taskDay__tasks')}>
          {dayTasks.map(task => <TaskFull task={task} />)}
        </div>
      </div>
    )
  }
  const isToday = dayTasks.date === today.format('YYYY-MM-DD');
  const isTomorrow = dayTasks.date === tomorrow.format('YYYY-MM-DD');
  const undoneDayTasks = dayTasks.tasks.filter(task => !task.isDone);
  if (!undoneDayTasks.length) {
    return null
  }
  return (
    <div className={cx('tasksDay')}>
      <div className={cx('taskDay__header')}>
        <span className={cx('taskDay__header_today')}>{(isToday && 'Сегодня') || (isTomorrow && 'Завтра')}</span>
        <span className={cx('taskDay__date')}>{moment(dayTasks.date).format('LL')}</span>
      </div> 
      <div className={cx('taskDay__tasks')}>
        {undoneDayTasks.map(task => <TaskFull task={task} />)}
      </div>
    </div>
  )
})
