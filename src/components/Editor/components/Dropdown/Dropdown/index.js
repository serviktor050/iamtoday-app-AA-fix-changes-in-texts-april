import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';
import styles from './styles.css'; // eslint-disable-line no-unused-vars

class Dropdown extends Component {

  constructor(props) {
    super(props);

    this.state = {
      expanded: false,
      highlighted: -1,
    };

    this.expandCollapseDropdown = this.expandCollapseDropdown.bind(this);
  }

  componentWillMount() {
    const {modalHandler} = this.props;
    modalHandler.registerCallBack(this.expandCollapseDropdown);
  }

  componentWillUnmount() {
    const {modalHandler} = this.props;
    modalHandler.deregisterCallBack(this.expandCollapseDropdown);
  }

  onChange(value) {
    const {onChange} = this.props;
    if (onChange) {
      onChange(value);
    }
    this.toggleExpansion();
  };

  onKeyDown(event) {
    const {children} = this.props;
    const {expanded, highlighted} = this.state;
    let actioned = false;
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      if (!expanded) {
        this.toggleExpansion();
        actioned = true;
      } else {
        this.setHighlighted((highlighted === children[1].length - 1) ? 0 : highlighted + 1);
        actioned = true;
      }
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      this.setHighlighted(highlighted <= 0 ? children[1].length - 1 : highlighted - 1);
      actioned = true;
    } else if (event.key === 'Enter') {
      if (highlighted > -1) {
        this.onChange(this.props.children[1][highlighted].props.value);
        actioned = true;
      } else {
        this.toggleExpansion();
        actioned = true;
      }
    } else if (event.key === 'Escape') {
      this.collapse();
      actioned = true;
    }
    if (actioned) {
      event.preventDefault();
    }
  };

  onDropdownClick() {
    const {modalHandler} = this.props;
    this.signalExpanded = !this.state.expanded;

    modalHandler.closeAllModals();
    this.toggleExpansion();
  };

  setHighlighted(highlighted) {
    this.setState({
      highlighted,
    });
  };

  expandCollapseDropdown() {
    this.setState({
      highlighted: -1,
      expanded: this.signalExpanded,
    });
    this.signalExpanded = false;
  }

  collapse() {
    this.setState({
      highlighted: -1,
      expanded: false,
    });
  };

  toggleExpansion() {
    const expanded = !this.state.expanded;
    this.setState({
      highlighted: -1,
      expanded,
    });
  };

  stopPropagation(event) {
    event.preventDefault();
    event.stopPropagation();
  };

  render() {
    const {children, className, optionWrapperClassName, ariaLabel, hint} = this.props;
    const {expanded, highlighted} = this.state;
    const options = children.slice(1, children.length);
    return (
      <div
        className="tooltip-wrapper"
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}>
        { hint ? <div className="tooltip">{hint}</div> : null }
        <div
          onKeyDown={(e) => this.onKeyDown(e)}
          className={classNames('itd-dropdown-wrapper', className)}
          aria-expanded={expanded}
          aria-label={ariaLabel || 'itd-dropdown'}
        >
          <a
            className="itd-dropdown-selectedtext"
            onClick={() => this.onDropdownClick()}
          >
            {children[0]}
            <div
              className={classNames({
                'itd-dropdown-carettoclose': expanded,
                'itd-dropdown-carettoopen': !expanded,
              })}
            />
          </a>
          {expanded ?
            <ul className={classNames('itd-dropdown-optionwrapper', optionWrapperClassName)}
                onClick={this.stopPropagation}>
              {
                React.Children.map(options, (option, index) => {
                  const temp = option && React.cloneElement(
                      option, {
                        onSelect: (value) => this.onChange(value),
                        highlighted: highlighted === index,
                        setHighlighted: (highlighted) => this.setHighlighted(highlighted),
                        index,
                      });
                  return temp;
                })
              }
            </ul> : undefined}
        </div>
      </div>
    );
  }
}

Dropdown.propTypes = {
  children: PropTypes.any,
  onChange: PropTypes.func,
  className: PropTypes.string,
  modalHandler: PropTypes.object,
  optionWrapperClassName: PropTypes.string,
  ariaLabel: PropTypes.string,
};

export default Dropdown;
