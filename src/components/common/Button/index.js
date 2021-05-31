import React from 'react';
import classNames from 'classnames/bind';
import styles from './styles.css';
const cx = classNames.bind(styles);

export const Button = (props) => {
  const { id, children, type, className, onClick, kind, title } = props;
  return (
    <button
      id={id}
      type={type}
      title={title}
      className={cx('btn', kind, className)}
      onClick={onClick}
      disabled={kind === 'disabled'}
    >
      {children}
    </button>
  )
};

Button.defaultProps = {
  className: '',
  type: 'button',
  kind: 'main'
};