import React from 'react';
import classNames from 'classnames/bind';
import originalMoment from 'moment';
import {extendMoment} from 'moment-range';

import ReactDateRangePicker from 'react-daterange-picker';

import styles from './styles.css';
import 'react-daterange-picker/dist/css/react-calendar.css';

const cx = classNames.bind(styles);
const moment = extendMoment(originalMoment);

class DateRangePicker extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      isOpen: false,
      value: moment.range(moment(this.props.start), moment(this.props.end)),
    };
  }

  onSelect = (value, states) => {
    const {onChange} = this.props;
    this.setState({value, states, isOpen: false});
    onChange(value);
  };

  onToggle = (e) => {
    e.preventDefault();
    this.setState({isOpen: !this.state.isOpen});
  };

  render() {
    return (
      <div className={cx('dateRangePicker')}>
        <div className={cx('dateRangePicker__valueLabel')}>Период</div>
        <div className={cx('dateRangePicker__valueWrapper')} onClick={this.onToggle}>
          <p className={cx('dateRangePicker__value')}>
            {this.state.value.start.format('DD.MM.YYYY')} - {this.state.value.end.format('DD.MM.YYYY')}
          </p>
          <button className={cx('dateRangePicker__calendarButton')}
            aria-label="Открыть календарь-фильтр"
            type="button"
            onClick={this.onToggle}>
            <svg>
              <use xlinkHref="#datepicker-toggle" />
            </svg>
          </button>
        </div>

        {this.state.isOpen && (<div className={cx('dateRangePicker__calendar')}>
          <ReactDateRangePicker value={this.state.value}
            onSelect={this.onSelect}
            numberOfCalendars={2}
            selectionType="range"
            firstOfWeek={1} />
        </div>)}
      </div>
    );
  }
}

export default DateRangePicker;
