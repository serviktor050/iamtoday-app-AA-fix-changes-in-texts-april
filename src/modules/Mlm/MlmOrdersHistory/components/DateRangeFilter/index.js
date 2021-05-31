import React from 'react';
import {connect} from 'react-redux';
import classNames from 'classnames/bind';
import Moment from 'moment';
import {extendMoment} from 'moment-range';

import DateRangePicker from 'components/common/DateRangePicker/DateRangePicker';

import {dict} from 'dict';

import styles from './styles.css';

const cx = classNames.bind(styles);
const moment = extendMoment(Moment);

class ConnectDateRangeFilter extends React.Component {
  state = {
    activeButton: 'all-time',
  };

  render() {
    const {onChange, lang} = this.props;

    const i18n = dict[lang];

    const handleDateRangeChange = ({start, end}) => {
      this.setState({activeButton: null});
      onChange(start, end);
    };

    const handleButtonClick = (interval) => () => {
      if (interval) {
        this.setState({activeButton: interval});
        onChange(moment().subtract(1, interval), moment());
      } else {
        this.setState({activeButton: 'all-time'});
        onChange(null, null);
      }
    };

    const setActiveClass = (button) => button === this.state.activeButton && cx('dateRangeFilter__button--active');

    return (
      <div className={cx('dateRangeFilter')}>
        <DateRangePicker onChange={handleDateRangeChange} />
        <div className={cx('dateRangeFilter__containerButtons')}>
          <button className={cx('dateRangeFilter__button', setActiveClass('all-time'))} onClick={handleButtonClick()}>
            {i18n["mlm.mlmStructure.filterButton.all"]}
          </button>
          <button className={cx('dateRangeFilter__button', setActiveClass('weeks'))} onClick={handleButtonClick('weeks')}>
            {i18n["mlm.mlmStructure.filterButton.week"]}
          </button>
          <button className={cx('dateRangeFilter__button', setActiveClass('months'))} onClick={handleButtonClick('months')}>
            {i18n["mlm.mlmStructure.filterButton.month"]}
          </button>
          <button className={cx('dateRangeFilter__button', setActiveClass('years'))} onClick={handleButtonClick('years')}>
            {i18n["mlm.mlmStructure.filterButton.year"]}
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    lang: state.lang,
  }
}

export const DateRangeFilter = connect(mapStateToProps)(ConnectDateRangeFilter);
