/* @flow */

import PropTypes from 'prop-types';

import React, { Component } from 'react';
import classNames from 'classnames';
import styles from './styles.css'; // eslint-disable-line no-unused-vars

class DropDownOption extends Component {

  onClick() {
    return () => {
      const {onSelect, onClick, value, disabled} = this.props;
      if (!disabled) {
        if (onSelect) {
          onSelect(value);
        }
        if (onClick) {
          event.stopPropagation();
          onClick(value);
        }
      }
    }
  };

  setHighlighted() {
    return () => {
      const {setHighlighted, index} = this.props;
      setHighlighted(index);
    }
  };

  resetHighlighted() {
    return () => {
      const {setHighlighted} = this.props;
      setHighlighted(-1);
    }
  }

  render() {
    const {
      children,
      active,
      disabled,
      highlighted,
      className,
      activeClassName,
      disabledClassName,
      highlightedClassName,
    } = this.props;
    return (
      <li
        className={classNames(
          'itd-dropdownoption-default',
          className,
          {
            [`itd-dropdownoption-active ${activeClassName}`]: active,
            [`itd-dropdownoption-highlighted ${highlightedClassName}`]: highlighted,
            [`itd-dropdownoption-disabled ${disabledClassName}`]: disabled,
          })
        }
        onMouseEnter={this.setHighlighted()}
        onMouseLeave={this.resetHighlighted()}
        onClick={this.onClick()}
        aria-selected={active}
      >
        {children}
      </li>
    );
  }
}
// todo: review classname use above.

DropDownOption.propTypes = {
  children: PropTypes.any,
  value: PropTypes.any,
  onClick: PropTypes.func,
  onSelect: PropTypes.func,
  setHighlighted: PropTypes.func,
  index: PropTypes.number,
  disabled: PropTypes.bool,
  active: PropTypes.bool,
  highlighted: PropTypes.bool,
  className: PropTypes.string,
  activeClassName: PropTypes.string,
  disabledClassName: PropTypes.string,
  highlightedClassName: PropTypes.string,
};

export default DropDownOption;