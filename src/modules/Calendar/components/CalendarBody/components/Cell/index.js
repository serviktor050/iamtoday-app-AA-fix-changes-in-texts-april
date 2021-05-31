import React, { useState } from 'react';
import classNames from 'classnames/bind';
import { connect } from 'react-redux';

import styles from './styles.css';
import { CalendarTask } from '../Task';
import { CalendarTaskWindow } from '../../../CalendarTaskWindow';
import * as selectors from '../../../../selectors';

const cx = classNames.bind(styles);

const mapStateToProps = (state) => ({ isTooltipVisible: selectors.selectTooltipStatus(state) });
const mapDispatchToProps = (dispatch) => ({ dispatch });

export const Cell = connect(mapStateToProps, mapDispatchToProps)(
  function Cell({ isExpanded, tasks, item, date, isTooltipVisible }) {
    const [ isEditTaskWindow, setEditTaskWindow ] = useState(false);
    function openTaskWindow(e) {
      // e.preventDefault();
      // e.stopPropagation();
      if (isTooltipVisible || isEditTaskWindow) {
        return
      }
      setEditTaskWindow(true)
    }

    function closeTaskWindow() {
      setEditTaskWindow(false);
    }

    return (
      <div onClick={(e) => openTaskWindow(e)} className={cx('cell')}>
        {tasks ? tasks.map(task => <CalendarTask isExpanded={isExpanded} task={task} />) : null}
        {isEditTaskWindow && <CalendarTaskWindow dateStart={date.hour(item).startOf('h')} toggleTaskWindow={closeTaskWindow} />}
      </div>
    )
  }
)