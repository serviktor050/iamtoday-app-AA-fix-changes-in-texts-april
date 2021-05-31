import React, { useState, useRef } from 'react';
import classNames from 'classnames/bind';
import * as R from 'ramda';
import { connect } from 'react-redux';

import styles from './styles.css';
import { TaskTooltip } from '../TaskTooltip';
import { useOutsideClick } from 'modules/utils';
import { CELL_HEIGHT, MONTH } from '../../../../constants';
import * as ducks from '../../../../ducks';
import * as selectors from '../../../../selectors';

const cx = classNames.bind(styles);

const mapStateToProps = (state) => ({ outsideClickRefs: selectors.selectOutsideClickRefs(state) });
const mapDispatchToProps = (dispatch) => ({ dispatch });

export const ShortTask = connect(mapStateToProps, mapDispatchToProps)(
  function ShortTask ({ innerRef, task, periodInfo, toggleTaskWindow }) {
    const ref = useRef();

    const [ isDescriptionOpen, setDescription ] = useState(false);

    const toggleTooltip = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDescription(!isDescriptionOpen)
    }

    const { name, color, isAllDay, rating, daysCount, daysFromPeriodStart, width } = task;
    let style = {};
    const period = R.path(['period'], periodInfo);
    if (isAllDay && period !== MONTH) {
      style = { 
        top: rating * (CELL_HEIGHT / 2), 
        width: daysCount * width - 1, 
        left: daysFromPeriodStart * width, 
        position: 'absolute' 
      }
    }
    
    return (
      <div ref={innerRef} className={cx('task__container_allDay')} style={style} >
          <div ref={ref} className={cx('task__wrapper_allDay')} onClick={toggleTooltip} >
            <div className={cx('task_allDay')} style={{ backgroundColor: `${color}4C`, borderColor: color }} >
              <p className={cx('task__title_allDay')}>{name}</p>
            </div>
          </div>
          {isDescriptionOpen && <TaskTooltip toggleTaskWindow={toggleTaskWindow} taskInfo={task} closeTooltip={toggleTooltip} />}
      </div>
    )
  }
)