import React, { useCallback, useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import { connect } from 'react-redux';

import styles from './styles.css';
import { CalendarTask } from '../Task';
import { CELL_HEIGHT } from '../../../../constants';
import * as selectors from '../../../../selectors';
import { getPeriod } from '../../utils';
import { CalendarTaskWindow } from '../../../CalendarTaskWindow';
import { getAllDayTasks, formateAllDayTasks, rateTasks } from './utils';

const cx = classNames.bind(styles);

const rows = [1, 2, 3];

const mapStateToProps = (state) => ({ 
  lang: state.lang, 
  calendarData: selectors.selectCalendarData(state),
  currentPeriod: selectors.selectCurrentPeriod(state),
  isTooltipVisible: selectors.selectTooltipStatus(state),
});

const mapDispatchToProps = (dispatch) => ({ dispatch })

export const AllDayZone = connect(mapStateToProps, mapDispatchToProps)(
  function AllDayZone({ calendarData, currentPeriod, periodInfo, isTooltipVisible }) {
    const [ dayWidth, setDayWidth ] = useState(0);
    const [ period, setPeriod ] = useState([]);
    const [ ratedTasks, setRatedTasks ] = useState([]);

    const measureRef = useCallback(node => {
      if (node !== null) {
        setDayWidth(node.getBoundingClientRect().width);
      }
    }, []);

    useEffect(() => {
      setPeriod(getPeriod(periodInfo));
      const allDayTasksForPeriod = getAllDayTasks({ calendarData, currentPeriod });
      const formatedTasks = formateAllDayTasks({ allDayTasksForPeriod, currentPeriod });
      setRatedTasks(rateTasks(formatedTasks));
    }, [periodInfo, calendarData, currentPeriod])

    const [ isEditTaskWindow, setEditTaskWindow ] = useState(false);
    function openTaskWindow(e) {
      if (isTooltipVisible || isEditTaskWindow) {
        return
      }
      setEditTaskWindow(true)
    }

    function closeTaskWindow() {
      setEditTaskWindow(false);
    }

    return (
      <div className={cx('allDayZone')}>
        <div className={cx('allDayZone__background')}>
          {period.map(item => (
            <div className={cx('day')} ref={measureRef}>
              {rows.map((row, index) => <div className={cx('allDay__cell')} style={{ top: CELL_HEIGHT * index, height: CELL_HEIGHT }}></div>)}
            </div>
          ))}
        </div>
        <div onClick={(e) => openTaskWindow(e)} className={cx('allDayZone__tasks')}>
          {ratedTasks.map((task) => <CalendarTask task={{...task, width: dayWidth}} />)}
          {isEditTaskWindow && <CalendarTaskWindow toggleTaskWindow={closeTaskWindow} />}
        </div>
      </div>
    )
  }
)
