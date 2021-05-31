import React, { useState, useRef } from 'react';
import classNames from 'classnames/bind';
import * as R from 'ramda';
import { connect } from 'react-redux';

import { TaskTooltip } from '../TaskTooltip';
import { CELL_HEIGHT } from '../../../../constants';
import { notAllDayTaskParams, getPrevTask, getRight } from './utils';
import { useOutsideClick } from 'modules/utils';
import styles from './styles.css';
import { ShortTask } from '../ShortTask';
import { CalendarTaskWindow } from '../../../CalendarTaskWindow';
import * as ducks from '../../../../ducks';
import * as selectors from '../../../../selectors';

const cx = classNames.bind(styles);

const mapStateToProps = (state) => ({ outsideClickRefs: selectors.selectOutsideClickRefs(state) });
const mapDispatchToProps = (dispatch) => ({ dispatch });

export const CalendarTask = connect(mapStateToProps, mapDispatchToProps)(
  function CalendarTask({ task, isExpanded, outsideClickRefs, dispatch }) {

    const ref = useRef();

    const [ isDescriptionOpen, setDescription ] = useState(false);
    const toggleTooltip = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDescription(!isDescriptionOpen)
    }

    const [ isEditTaskWindow, setEditTaskWindow ] = useState(false);
    function toggleTaskWindow(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      setEditTaskWindow(!isEditTaskWindow)
    }
    
    const { isAllDay, name, color } = task;

    if (isAllDay) {
      return (
        <React.Fragment>
          <ShortTask toggleTaskWindow={toggleTaskWindow} task={task} />
          {isEditTaskWindow && <CalendarTaskWindow toggleTaskWindow={toggleTaskWindow} taskInfo={task} />}
        </React.Fragment>
      )
    }

    const { dateStart, heightFirstDay } = notAllDayTaskParams(task, isExpanded)
    const isSmallTask = heightFirstDay < CELL_HEIGHT / 2;

    
    const prevTask = getPrevTask(task);
    task.oneTimeTasks.prevTask = prevTask;
    const { right, rightDirection } = getRight(task);
    task.oneTimeTasks.right = right;
    task.oneTimeTasks.rightDirection = rightDirection;
    const { width } = task.oneTimeTasks;
    
    return (
      <div className={cx('task__container')} style={{top: (dateStart.minutes() / 60) * CELL_HEIGHT }}>
        <div 
          className={cx('task__wrapper')} 
          style={{ height: heightFirstDay, width: `${width-1}%`, right: `${right}%`}}
        >
          <div ref={ref} onClick={toggleTooltip} className={cx('task', { 'task_small': isSmallTask })} style={{ backgroundColor: `${color}4C`, borderColor: color }} >
            <p className={cx('task__title', { 'task__title_small': isSmallTask })}>{name}</p>
            <p className={cx({'task__time_small': isSmallTask})} style={{ color }}>{dateStart.format('LT')}</p>
          </div>
        </div>
        <div className={cx('task__tooltipWrapper')} style={{ width: `${width-1}%`, right: `${right}%`}}>
          {isDescriptionOpen && <TaskTooltip toggleTaskWindow={toggleTaskWindow} taskInfo={task} closeTooltip={toggleTooltip} />}
        </div>
        {isEditTaskWindow && <CalendarTaskWindow toggleTaskWindow={toggleTaskWindow} taskInfo={task} />}
      </div>
    )
  }
)
