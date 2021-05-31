import React from 'react';
import classNames from 'classnames/bind';

import styles from './styles.css';

const cx = classNames.bind(styles);

export function AllDayCheckbox({ title, onChange, checked, ...props }) {
  return (
    <div className={cx('allDayCheckbox')}>
      <input type='checkbox' checked={checked} onChange={onChange} className={cx('allDayCheckbox__input')} id='allDay' />
      <label htmlFor='allDay' className={cx('allDayCheckbox__label')}>{title}</label>
    </div>
  )
}
