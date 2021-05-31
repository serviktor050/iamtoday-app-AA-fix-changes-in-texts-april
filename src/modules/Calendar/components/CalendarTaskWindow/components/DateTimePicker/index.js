import React from 'react';
import Datetime from 'react-datetime';
import classNames from 'classnames/bind';
import * as R from "ramda";

import styles from './styles.css';
import "react-datetime/css/react-datetime.css";

const cx = classNames.bind(styles);


export function DateTimePicker({ onChange, value, isError, ...outerProps }) {
  const renderInput = (props, openCalendar, closeCalendar) => {
    const isDisabled = R.path(['inputProps', 'disabled'], outerProps);
    return (
      <div className={cx('input__wrapper', { 'input__wrapper_error': isError }, { 'input__wrapper_disabled': isDisabled })}>
        <input {...props} className={cx('input')} />
        <button className={cx('icon__wrapper')} disabled={isDisabled} onClick={(e) => { e.preventDefault(); openCalendar()}}>
          <svg className={cx('icon')} >
            <use xlinkHref="#calendar" />
          </svg>
        </button>
      </div>
    )
  }
  return (
    <Datetime onChange={onChange} value={value} renderInput={renderInput} {...outerProps}  />   
  )
}
