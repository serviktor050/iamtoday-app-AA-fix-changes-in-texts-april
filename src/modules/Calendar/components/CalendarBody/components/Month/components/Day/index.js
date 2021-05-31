import React, { useState, useCallback } from 'react';
import classNames from 'classnames/bind';
import * as R from 'ramda';

import styles from './styles.css';
import { MonthTask } from '../MonthTask';

const cx = classNames.bind(styles);

export function Day({ tasks, date, isInThisMonth, dayWidth, periodInfo }) {

  const [ tasksHeight, setTasksHeight ] = useState(0);
  const measuredTasks = useCallback(node => {
    if (node !== null) {
      setTasksHeight(node.getBoundingClientRect().height);
    }
  }, []);

  const [ isExpanded, setExpand ] = useState(false);
  const toggleExpand = () => {
    setExpand(!isExpanded)
  }

  const circle = <div className={cx('circle')}></div>

  const isOffset = (dayWidth - 10 - 22) < tasksHeight;
  const offset = (dayWidth - 10 - 22 - 10);

  const offsetStyles = { maxHeight: offset, overflow: 'hidden' }

  const dayTasks = R.path(['tasks'], tasks) || []
  return (
    <div className={cx('day')}>
      <span className={cx('number', { 'number_inactive': !isInThisMonth })}>{date.format('D')}</span>
      <div ref={measuredTasks} className={cx('day__tasks', { 'day__tasks_expanded': isExpanded })} style={(isOffset && !isExpanded) ? offsetStyles : {} } >
        {dayTasks.map((task) => (
          <React.Fragment>
            <MonthTask task={task} periodInfo={periodInfo} />
          </React.Fragment>
        ))}
        {(isOffset && !isExpanded) && <div className={cx('gradientFade')} onClick={toggleExpand} ></div>}
        {(isOffset && isExpanded) && <button className={cx('hide')} onClick={toggleExpand} ></button>}
      </div>
      {(isOffset && !isExpanded) && <button className={cx('expand')} onClick={toggleExpand}>{circle}{circle}{circle}</button>}
    </div>
  )
}
