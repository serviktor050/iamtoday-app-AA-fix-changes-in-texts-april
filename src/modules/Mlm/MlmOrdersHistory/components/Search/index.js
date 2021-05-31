import React from 'react';
import classNames from 'classnames/bind';

import styles from './styles.css';

const cx = classNames.bind(styles);

export const Search = ({onChange, ...props}) => (
  <div className={cx('search')}>
    <input className={cx('search__field')} {...props} onChange={({target: {value}}) => onChange(value)} />
  </div>
);
