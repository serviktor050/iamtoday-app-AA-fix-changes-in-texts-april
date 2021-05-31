import React, { Component } from 'react'
import { connect } from 'react-redux';
import classNames from 'classnames/bind';
import moment from 'moment';

import styles from './styles.css';
import * as selectors from '../../selectors';
import { Day } from './components/Day';
import { TimeBlock } from './components/TimeBlock';
import { DAY, WEEK, MONTH } from '../../constants';
import { Month } from './components/Month';
import { AllDayZone } from './components/AllDayZone';
import { getPeriod } from './utils';

const cx = classNames.bind(styles);

class Body extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
       isExpanded: false,
    }
  }

  toggleExpand = () => {
    this.setState({ isExpanded: !this.state.isExpanded })
  }
  
  render() {
    const { weekNode, periodInfo } = this.props;
    const period = getPeriod(periodInfo);
    const isMonth = periodInfo.period === MONTH;
    return (
      <div className={cx('calendarBody')}>
        {isMonth ?  
        <div className={cx('main__container')} style={{ width: '100%', borderTop: 'none' }}>
          <Month periodInfo={periodInfo} />
        </div> : 
        <React.Fragment>
          <aside className={cx('timeBlock')}>
            <TimeBlock isExpanded={this.state.isExpanded} toggleExpand={this.toggleExpand} />
          </aside>
          <div className={cx('main__container')} style={{ width: weekNode ? weekNode.offsetWidth : '100%' }} >
            <AllDayZone periodInfo={periodInfo} />
            <div className={cx('timedZone')}>
              {period.map(item => <Day key={item} isExpanded={this.state.isExpanded} date={item} />)}
            </div>
          </div>
        </React.Fragment>}
      </div>
    )
  }
}

const mapStateToProps = state => ({ 
  lang: state.lang,
  calendarData: selectors.selectCalendarData(state),
})
const mapDispatchToProps = dispatch => ({ dispatch })

export const CalendarBody = connect(mapStateToProps, mapDispatchToProps)(Body)