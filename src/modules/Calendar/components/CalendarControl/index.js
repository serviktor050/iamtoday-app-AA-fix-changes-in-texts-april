import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import classNames from 'classnames/bind';
import { dict } from 'dict';
import moment from 'moment';

import styles from './styles.css';
import * as ducks from '../../ducks';
import { SearchInputCalendar } from '../../../../components/common/SearchInput';
import { CalendarWeekScroller } from './components/CalendarWeekScroller';
import { formateDateForDisplaying, isTasks as getIsTasks } from '../../utils';
import { CALENDAR_TABS, DAY, WEEK, MONTH, TODAY, TOMORROW, SEVEN_DAYS, TASKS_TABS } from '../../constants';

const cx = classNames.bind(styles);

class Control extends Component {
  constructor(props) {
    super(props)

    this.state = {
      period: WEEK,  
      search: '',
      currentPeriod: '',
      dateStart: null,
      dateEnd: null
    }
  }

  componentDidMount() {
    const { location } = this.props;
    const isTasks = getIsTasks(location);
    if (isTasks) {
      const today = moment().startOf('day');
      this.setState(state => ({ period: TODAY, dateStart: today.format(), dateEnd: today.add(1, 'day').format() }))
    }
  }

  componentDidUpdate(_, prevState) {
    if (prevState.dateStart !== this.state.dateStart || prevState.dateEnd !== this.state.dateEnd) {
      const { dispatch, updatePeriod } = this.props;
      const data = {
        dateStart: this.state.dateStart,
        dateEnd: this.state.dateEnd
      }
      dispatch(ducks.calendarGetTasks(data))
      updatePeriod({ period: this.state.period, dateStart: this.state.dateStart, dateEnd: this.state.dateEnd })
    }
    if(prevState.period !== this.state.period && this.state.period !== WEEK) {
      this.changePeriod()
    }
    if (prevState.search !== this.state.search) {
      const { dispatch } = this.props;
      const data = {
        dateStart: this.state.dateStart,
        dateEnd: this.state.dateEnd,
        searchText: this.state.search,
      }
      dispatch(ducks.calendarGetTasks(data))
    }
  }

  changePeriod = () => {
    const today = moment().startOf('day');
    switch (this.state.period) {
      case DAY:
        this.setState({ 
          dateStart: today.format(), 
          dateEnd: today.clone().add(1, 'd').format(),
          currentPeriod: formateDateForDisplaying(moment())
        })
        break
      case MONTH:
        this.setState({ 
          dateStart: moment().startOf('month').startOf('day').format(), 
          dateEnd: moment().endOf('month').endOf('day').format(),
          currentPeriod: formateDateForDisplaying(moment(), this.state.period)
        })  
        break
      case TODAY:
        this.setState({
          dateStart: today.format(),
          dateEnd: today.clone().add(1, 'd').format(),
          currentPeriod: formateDateForDisplaying(today)
        })
        break
      case TOMORROW:
        this.setState({
          dateStart: today.clone().add(1, 'd').format(),
          dateEnd: today.clone().add(2, 'd').format(),
          currentPeriod: formateDateForDisplaying(today.add(1, 'd'))
        })
        break
      case SEVEN_DAYS:
        this.setState({
          dateStart: today.format(),
          dateEnd: today.clone().add(7, 'd').format(),
          currentPeriod: formateDateForDisplaying(today, this.state.period)
        })
        break
      default:
        this.setState({ 
          dateStart: moment().startOf('day').format(), 
          dateEnd: moment().add(1, 'd').startOf('day').format(),
          currentPeriod: formateDateForDisplaying(moment())
        })
        break
    }
  }

  nextPeriod = () => {
    switch (this.state.period) {
      case MONTH:
        this.setState((state) => ({
          dateStart: moment(state.dateStart).add(1, state.period).startOf('month').format(),
          dateEnd: moment(state.dateEnd).add(1, state.period).endOf('month').format(),
          currentPeriod: formateDateForDisplaying(moment(state.dateStart).add(1, state.period), state.period)
        }))
        break
      case DAY || WEEK:
        this.setState((state) => ({
          dateStart: moment(state.dateStart).add(1, state.period).format(),
          dateEnd: moment(state.dateEnd).add(1, state.period).format(),
          currentPeriod: formateDateForDisplaying(moment(state.dateStart).add(1, state.period), state.period)
        }))
        break
      case SEVEN_DAYS:
        this.setState((state) => ({
          dateStart: moment(state.dateStart).add(1, 'week').format(),
          dateEnd: moment(state.dateEnd).add(1, 'week').format(),
          currentPeriod: formateDateForDisplaying(moment(state.dateStart).add(1, 'week'), state.period)
        }))
        break
      default:
        this.setState((state) => ({
          dateStart: moment(state.dateStart).add(1, 'day').format(),
          dateEnd: moment(state.dateEnd).add(1, 'day').format(),
          currentPeriod: formateDateForDisplaying(moment(state.dateStart).add(1, 'day'))
        }))
    }
  }

  prevPeriod = () => {
    switch (this.state.period) {
      case MONTH:
        this.setState((state) => ({
          dateStart: moment(state.dateStart).subtract(1, state.period).startOf('month').format(),
          dateEnd: moment(state.dateEnd).subtract(1, state.period).endOf('month').format(),
          currentPeriod: formateDateForDisplaying(moment(state.dateStart).subtract(1, state.period), state.period)
        }))
        break
      case DAY || WEEK:
        this.setState((state) => ({
          dateStart: moment(state.dateStart).subtract(1, state.period).format(),
          dateEnd: moment(state.dateEnd).subtract(1, state.period).format(),
          currentPeriod: formateDateForDisplaying(moment(state.dateStart).subtract(1, state.period), state.period)
        }))
        break
      case SEVEN_DAYS:
        this.setState((state) => ({
          dateStart: moment(state.dateStart).subtract(1, 'week').format(),
          dateEnd: moment(state.dateEnd).subtract(1, 'week').format(),
          currentPeriod: formateDateForDisplaying(moment(state.dateStart).subtract(1, 'week'), state.period)
        }))
        break
      default:
        this.setState((state) => ({
          dateStart: moment(state.dateStart).subtract(1, 'day').format(),
          dateEnd: moment(state.dateEnd).subtract(1, 'day').format(),
          currentPeriod: formateDateForDisplaying(moment(state.dateStart).subtract(1, 'day'))
        }))
    }
  }

  setPeriod = ({currentPeriodStr, dateStart, dateEnd}) => {
    this.setState({ currentPeriod: currentPeriodStr, dateStart, dateEnd })
  }

  getTabsLabels = (tabs) => {
    const i18n = dict[this.props.lang]
    return tabs.map(tab => ({ label: i18n[`calendar.filter.${tab}`], value: tab }))
  }

  handleSearch = (value) => {
    this.setState({ search: value })
  }
  
  render() {
    const { forwardRef, lang, location } = this.props;
    const i18n = dict[lang];
    const isTasks = getIsTasks(location);
    const tabs = this.getTabsLabels(isTasks ? TASKS_TABS : CALENDAR_TABS)
    const isWeek = this.state.period === WEEK
    const isDayTasks = (this.state.period === TODAY) || (this.state.period === TOMORROW)
    return (
      <div className={cx('control')}>
        <div className={cx('filter__container')}>
          <div className={cx('filter__tabs')}>
            {tabs.map(tab => (
              <div key={tab.value} className={cx('tab__container')}>
                <input 
                  type='radio'
                  name='period'
                  id={tab.value} 
                  value={tab.value} 
                  className={cx('tab__input')} 
                  checked={this.state.period === tab.value}
                  onChange={_ => this.setState({ period: tab.value })}
                />
                <label htmlFor={tab.value} className={cx('tab__label')}>{tab.label}</label>
              </div>
            ))}
          </div>
          <span className={cx('filter__currentPeriod')}>
            {!isWeek && !isDayTasks && <button onClick={this.prevPeriod} className={cx('filter__currentPeriod_btn')}></button>}
            {this.state.currentPeriod}
            {!isWeek && !isDayTasks && <button onClick={this.nextPeriod} className={cx('filter__currentPeriod_btn', 'filter__currentPeriod_btnNext')}></button>}
          </span>
          {isTasks ? <SearchInputCalendar 
            value={this.state.search} 
            placeholder={i18n['calendar.filter.search.placeholder']} 
            onChange={this.handleSearch} 
            className={cx('filter__input')} 
          /> : <div className={cx('searchInput__placeholder')}></div>}
        </div>
        {this.state.period === WEEK && <CalendarWeekScroller forwardRef={forwardRef} setPeriod={this.setPeriod}  />}
      </div>

    )
  }
}

const mapStateToProps = state => ({
    lang: state.lang,
})
const mapDispatchToProps = dispatch => ({ dispatch })

export const CalendarControl = compose(connect(mapStateToProps, mapDispatchToProps)(Control))