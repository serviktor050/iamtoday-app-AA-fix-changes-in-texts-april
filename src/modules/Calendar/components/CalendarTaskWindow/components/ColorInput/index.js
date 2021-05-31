import React from 'react';
import classNames from 'classnames/bind';

import styles from './styles.css';

const cx = classNames.bind(styles);

export function ColorInput({ name, defaultValue, color, innerRef  }) {
  return (
    <div className={cx('inputWrapper')}>
      <input id={color} type='radio' defaultChecked={defaultValue ? (defaultValue === color) && defaultValue : null } className={cx('input')} value={color} {...innerRef(name, { required: true })} />
      <label htmlFor={color} className={cx('label')} style={{ backgroundColor: color }} ></label>
    </div>
  )
}
