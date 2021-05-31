import React, { useState, useCallback } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames/bind';
import moment from 'moment';
import * as R from 'ramda';

import * as selectors from '../../../../selectors';
import styles from './styles.css';
import { Day } from './components/Day';
import { WEEK_LABELS } from '../../../../constants';
import { sortByDate } from '../../../../utils';
import Loader from '../../../../../../components/componentKit/Loader';
import { isDataNotFetched } from '../../../../../utils';


const cx = classNames.bind(styles);

const mapStateToProps = state => ({ calendarData: selectors.selectCalendarData(state), lang: state.lang });
const mapDispatchToProps = dispatch => ({ dispatch });

const deleteDuplicates = function (tasks) {
  tasks.forEach((day) => {
    day.tasks.forEach((task) => {
      const { id, dateStart } = task;
      tasks.forEach((day) => {
      day.tasks = day.tasks.filter((dayTask) => !(dayTask.id === id && dayTask.dateStart !== dateStart))
      }) 
    })
  })
}

export const Month = connect(mapStateToProps, mapDispatchToProps)(
  function Month ({ periodInfo, calendarData, lang, ...props }) {

    const [ dayWidth, setDayWidth ] = useState(0);

    const measuredDayWidth = useCallback(node => {
      if (node !== null) {
        setDayWidth(node.getBoundingClientRect().width);
      }
    }, []);

    const tasksDates = R.path(['data'], calendarData) || [];
    tasksDates.sort(sortByDate);
    deleteDuplicates(tasksDates)

    const { dateStart, dateEnd } = periodInfo;
    const start = moment(dateStart).startOf('month').startOf('week');
    const end = moment(dateEnd).endOf('month').endOf('week');
    const daysCount = moment.duration(end.diff(start, 'days')) + 1;

    let days = [];
    for (let i = 0; i < daysCount; i++) {
      days.push(start.clone().add(i, 'day'))
    }

    return (
      <React.Fragment>
        {!isDataNotFetched(calendarData) ? <div className={cx('month')}>
          <div className={cx('labels')}>
            {WEEK_LABELS.map(label => <div className={cx('label')}>{label}</div>)}
          </div>
          {days.map(day => {
            const isInThisMonth = day.isBefore(moment(dateEnd).endOf('month')) && day.isAfter(moment(dateStart).subtract(1, 'd'));
            const tasks = tasksDates.find(date => date.date === day.format('YYYY-MM-DD'));
            return (<div ref={measuredDayWidth} className={cx('day')} style={{ height: dayWidth }} >
              <Day tasks={tasks} date={day} isInThisMonth={isInThisMonth} dayWidth={dayWidth} periodInfo={periodInfo} />
            </div>)}
          )}
        </div> : <Loader />}
      </React.Fragment>
    )
  }
)
