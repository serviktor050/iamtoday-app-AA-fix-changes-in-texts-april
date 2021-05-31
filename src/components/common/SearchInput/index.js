import React from 'react';
import classNames from 'classnames/bind';

import styles from './styles.css';

const cx = classNames.bind(styles);

export function SearchInputCalendar({ onChange, value, placeholder, className, ...props }) {
  return (
    <div className={cx('input__wrapper', { [className]: className })}>
      <input 
        value={value} 
        className={cx('input')} 
        placeholder={placeholder} 
        onChange={e => onChange(e.target.value)} 
      />
    </div>
  )
}

export const SearchInput = ({ value, placeholder, onFilterChange, onFilterEnter }) => {
    return (
        <div className={styles.searchInputBox}>
            <div className={styles.searchIcon}></div>
            <input
                className={styles.searchInput}
                type="text"
                value={value}
                name="searchText"
                type="text"
                placeholder={placeholder}
                onChange={onFilterChange}
                onKeyPress={onFilterEnter}
            />
        </div>
    )
}
