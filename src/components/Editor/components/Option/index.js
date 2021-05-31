/* @flow */

import PropTypes from 'prop-types';

import React, { Component } from 'react';
import classNames from 'classnames';
import styles from './styles.css'; // eslint-disable-line no-unused-vars

class Option extends Component {

  onClick() {
    const {disabled, onClick, value, modalHandler} = this.props;

    if (!disabled) {
      onClick(value);
    }

    if (modalHandler) {
      modalHandler.closeAllModals();
    }
  };

  render() {
    const {children, className, activeClassName, active, disabled, hint} = this.props;
    return (
      <div
        className="tooltip-wrapper"
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}>
        { hint ? <div className="tooltip">{hint}</div> : null }
        <div
          className={classNames(
            'itd-option-wrapper',
            className,
            {
              [`itd-option-active ${activeClassName}`]: active,
              'itd-option-disabled': disabled,
            }
          )}
          onClick={(e) => this.onClick(e)}
          aria-selected={active}
        >
          {children}
        </div>
      </div>
    );
  }
}

Option.propTypes = {
  onClick: PropTypes.func.isRequired,
  children: PropTypes.any,
  value: PropTypes.string,
  className: PropTypes.string,
  activeClassName: PropTypes.string,
  active: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default Option;
