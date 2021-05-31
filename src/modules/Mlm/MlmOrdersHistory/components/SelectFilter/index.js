import React from 'react';
import classNames from 'classnames/bind';

import styles from './styles.css';

const cx = classNames.bind(styles);

export const SelectFilter = ({label, onChange, options, ...props}) => (
  <label className={cx('selectFilter')}>{label}
    <select className={cx('selectFilter__menu')} {...props} onChange={({target: {value}}) => onChange(value)}>
      {options.map(({value, label}) => <option key={label} value={value}>{label}</option>)}
    </select>
  </label>
);
