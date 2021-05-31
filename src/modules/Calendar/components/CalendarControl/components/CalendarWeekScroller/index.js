import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import classNames from 'classnames/bind';
import moment from 'moment';
import { dict } from 'dict';

import styles from './styles.css';
import { getWeekWithOffset, formateDateForDisplaying } from '../../../../utils';
import * as ducks from '../../../../ducks';

const cx = classNames.bind(styles);

class Scroller extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
      currentWeek: null,
      weekOffset: 0,
    }
  }

  componentDidMount() {
    const { setPeriod } = this.props;
    const { week, isoWeek } = getWeekWithOffset(this.state.weekOffset);
    const dateStart = isoWeek[0];
    const dateEnd = isoWeek[6];
    const data = {
      currentPeriodStr: `${formateDateForDisplaying(dateStart)} - ${formateDateForDisplaying(dateEnd)}`,
      dateStart,
      dateEnd: moment(dateEnd).date(moment(dateEnd).date() + 1).format()
    }
    setPeriod(data);
    this.setState({ currentWeek: week });
  }

  componentDidUpdate(_, prevState) {
    if (prevState.weekOffset !== this.state.weekOffset) {
      const { setPeriod } = this.props;
      const { week, isoWeek } = getWeekWithOffset(this.state.weekOffset);
      const dateStart = isoWeek[0];
      const dateEnd = isoWeek[6];
      const data = {
        currentPeriodStr: `${formateDateForDisplaying(dateStart)} - ${formateDateForDisplaying(dateEnd)}`,
        dateStart,
        dateEnd: moment(dateEnd).date(moment(dateEnd).date() + 1).format()
      }
      setPeriod(data);
      this.setState({ currentWeek: week });
    }
  }
  
  render() {
    const { forwardRef, lang, ...props } = this.props;
    const [ currentDate, currentMonth ] = moment().format('DD MMMM').toLocaleUpperCase().split(' ');
    return (
      <div className={cx('weekScroller')}>
        <button className={cx('btn', 'btn-prev')} onClick={_ => this.setState(prev => ({ weekOffset: prev.weekOffset - 1 }))} ></button>
        <div ref={forwardRef} className={cx('days__container')}>
          {this.state.currentWeek && this.state.currentWeek.map(day => (
            <div key={day.weekday} className={cx('day__wrapper', { 'day__wrapper-active': (currentDate === day.date) && (currentMonth === day.month) })}>
              <span className={cx('weekday')}>{day.weekday}</span>
              <span className={cx('date')}>{day.date}</span>
            </div>)
          )}
        </div>
        <button className={cx('btn', 'btn-next')} onClick={_ => this.setState(prev => ({ weekOffset: prev.weekOffset + 1 }))} ></button>
      </div>
    )
  }
}

const mapStateToProps = state => ({ lang: state.lang });
const mapDispatchToProps = dispatch => ({ dispatch });

export const CalendarWeekScroller = compose(connect(mapStateToProps, mapDispatchToProps)(Scroller))
