import React from 'react';
import classNames from 'classnames/bind';

import styles from './styles.css';

const cx = classNames.bind(styles);

export function RadioInput({ name, onChange, value, label, recipientsType }) {
  return (
    <div className={cx('radioInput')}>
      <input 
        name={name} 
        type='radio' 
        value={value} 
        onChange={onChange} 
        id={`${name}-${value}`} 
        checked={recipientsType === value} 
        className={cx('radioInput__input')} 
      />
      <label htmlFor={`${name}-${value}`} className={cx('radioInput__label')}>
        <div className={cx('radioInput__label_circle')}></div>
        {label}
      </label>
    </div>
  )
}
