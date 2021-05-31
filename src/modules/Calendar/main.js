import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import classNames from 'classnames/bind';
import { dict } from 'dict';

import styles from './styles.css';
import * as ducks from './ducks';
import * as selectors from './selectors';
import Layout from '../../components/componentKit2/Layout';
import AdminLayout from 'modules/Admin/components/AdminLayout';
import CalendarTabs from './components/CalendarTabs';
import { CalendarTitle } from './components/CalendarTitle';
import { CalendarControl } from './components/CalendarControl';
import { CalendarBody } from './components/CalendarBody';
import { CalendarTaskWindow } from './components/CalendarTaskWindow';
import { isDataNotFetched } from './utils';
import { isAdmin } from 'modules/utils';
import Loader from '../../components/componentKit/Loader';

const cx = classNames.bind(styles);

const page = 'calendar';

class Calendar extends Component {
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
  
  render() {
    const { location, calendarData, userInfo, lang } = this.props;
    const periodInfo = {
      period: this.state.period,
      dateStart: this.state.dateStart,
      dateEnd: this.state.dateEnd
    }
    const i18n = dict[lang];

    const content = (
      <React.Fragment>
        <CalendarTabs />
        <div className={cx('layout')}>
          <header className={cx('calendar__header')}>
            <CalendarTitle title={i18n['calendar.title']} toggleTaskWindow={this.toggleTaskWindow} />
            {this.state.isTaskWindow && <CalendarTaskWindow toggleTaskWindow={this.toggleTaskWindow} />}
            <hr className={cx('hr')} />
          </header>

          <main className={cx('calendaer__main')}>
            <CalendarControl forwardRef={this.setWeekNode} updatePeriod={this.updatePeriod} />
            {!isDataNotFetched(calendarData) || this.state.isDataLoaded ? <CalendarBody weekNode={this.state.weekNode} periodInfo={periodInfo} /> : <Loader />}
          </main>
        </div>
      </React.Fragment>
    )

    if (isAdmin(userInfo)) {
      return (
        <AdminLayout page={page} location={location} >
          {content}
        </AdminLayout>
      )
    }
    return (
      <Layout page={page} location={location} >
        {content}
      </Layout>
    )
  }
}

const mapStateToProps = state => ({
  lang: state.lang,
  calendarData: selectors.selectCalendarData(state),
  userInfo: state.userInfo
})

const mapDispatchToProps = dispatch => ({dispatch})

Calendar = compose(connect(mapStateToProps, mapDispatchToProps)(Calendar))

export default Calendar
