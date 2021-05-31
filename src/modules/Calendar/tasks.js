import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import classNames from 'classnames/bind';
import { dict } from 'dict';
import moment from 'moment';
import * as R from 'ramda';

import styles from './styles.css';
import * as ducks from './ducks';
import * as selectors from './selectors';
import Layout from '../../components/componentKit2/Layout';
import CalendarTabs from './components/CalendarTabs';
import { CalendarTitle } from './components/CalendarTitle';
import { CalendarControl } from './components/CalendarControl';
import { CalendarTaskWindow } from './components/CalendarTaskWindow';
import { isDataNotFetched } from './utils';
import Loader from '../../components/componentKit/Loader';
import { TasksBody } from './components/TasksBody';

const cx = classNames.bind(styles);

const page = 'calendar';

class Tasks extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
      weekNode: null,
      isTaskWindow: false,
      period: null,
      dateStart: null,
      dateEnd: null,
      isDataLoaded: null,
    }
  }

  componentDidMount() {
      const { dispatch } = this.props;
      const today = moment().startOf('day')
      dispatch(ducks.calendarGetTodayTasks({ dateStart: today.format(), dateEnd: today.add(1, 'day').format() }))
  }

  componentDidUpdate(prevProps) {
    if (prevProps.calendarData !== this.props.calendarData && !this.state.isDataLoaded) {
      if (!isDataNotFetched(this.props.calendarData)) {
        this.setState({ isDataLoaded: true })
      }
    }
  }

  updatePeriod = ({ period, dateStart, dateEnd }) => {
    const { dispatch } = this.props;
    this.setState(state => ({ period, dateStart, dateEnd }))
    dispatch(ducks.setCurrentPeriod({ dateStart, dateEnd }));
  }

  toggleTaskWindow = () => this.setState({ isTaskWindow: !this.state.isTaskWindow });

  setWeekNode = element => this.setState({ weekNode: element });

  getTodayTasks = () => {
    const { todayTasks } = this.props;
    const today = R.path(['data'], todayTasks);
    if (today && today.length) {
      const tasks = today.find((day) => day.date === moment().format('YYYY-MM-DD')).tasks
      return tasks.length
    }
    return 0
  }
  
  render() {
    const { location, calendarData, lang } = this.props;
    const tasksCount = this.getTodayTasks();
    const i18n = dict[lang];
    return (
      <Layout page={page} location={location} >
        <CalendarTabs />
        <div className={cx('layout')}>
          <header className={cx('calendar__header')}>
            <CalendarTitle title={i18n['calendar.tasks']} toggleTaskWindow={this.toggleTaskWindow} todayTasks={tasksCount} />
            {this.state.isTaskWindow && <CalendarTaskWindow toggleTaskWindow={this.toggleTaskWindow} />}
            <hr className={cx('hr')} />
          </header>

          <main className={cx('calendaer__main')}>
            <CalendarControl forwardRef={this.setWeekNode} updatePeriod={this.updatePeriod} location={location} />
            {!isDataNotFetched(calendarData) || this.state.isDataLoaded ? <TasksBody />  : <Loader />}
          </main>
        </div>
      </Layout>
    )
  }
}

const mapStateToProps = state => ({
  lang: state.lang,
  calendarData: selectors.selectCalendarData(state),
  todayTasks: selectors.selectTodayTasks(state),
})

const mapDispatchToProps = dispatch => ({dispatch})

Tasks = compose(connect(mapStateToProps, mapDispatchToProps)(Tasks))

export default Tasks
