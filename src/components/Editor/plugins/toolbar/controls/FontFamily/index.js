/* @flow */

import PropTypes from 'prop-types';

import React, { Component } from 'react';
import {
  getSelectionCustomInlineStyle,
} from 'draftjs-utils';
import toggleCustomInlineStyle from '../../utils/toggleCustomInlineStyle';
import classNames from 'classnames';
import {Dropdown, DropdownOption} from '../../../../components/Dropdown';
import styles from './styles.css'; // eslint-disable-line no-unused-vars


class FontFamily extends Component {

  constructor(props) {
    super(props);

    this.state = {
      currentFontFamily: undefined,
    }
  }

  componentWillMount() {
    const {getEditorState} = this.props;
    if (getEditorState) {
      this.setState({
        currentFontFamily: getSelectionCustomInlineStyle(getEditorState(), ['FONTFAMILY']).FONTFAMILY,
      });
    }
  }

  componentWillReceiveProps(properties) {
    if (properties.getEditorState) {
      const newFontFamily = getSelectionCustomInlineStyle(properties.getEditorState(), ['FONTFAMILY']).FONTFAMILY;
      if (newFontFamily !== this.state.currentFontFamily) {
        this.setState({
          currentFontFamily: newFontFamily,
        });
      }
    }
  }

  toggleFontFamily(fontFamily) {
    const {getEditorState, setEditorState} = this.props;
    const newState = toggleCustomInlineStyle(
      getEditorState(),
      'fontFamily',
      fontFamily,
    );
    if (newState) {
      setEditorState(newState);
    }
  };

  render() {
    let {currentFontFamily} = this.state;
    const {config: {className, dropdownClassName, options}, modalHandler} = this.props;
    currentFontFamily =
      currentFontFamily && currentFontFamily.substring(11, currentFontFamily.length);
    return (
      <div className="itd-fontfamily-wrapper" aria-label="itd-font-family-control">
        <Dropdown
          hint="Шрифт"
          className={classNames('itd-fontfamily-dropdown', className)}
          onChange={(value) => this.toggleFontFamily(value)}
          modalHandler={modalHandler}
          optionWrapperClassName={classNames('itd-fontfamily-optionwrapper', dropdownClassName)}
        >
          <span className="itd-fontfamily-placeholder">
            {currentFontFamily || 'Шрифт'}
          </span>
          {
            options.map((family, index) =>
              <DropdownOption
                active={currentFontFamily === family}
                value={`fontfamily-${family}`}
                key={index}
              >
                {family}
              </DropdownOption>)
          }
        </Dropdown>
      </div>
    );
  }
}

FontFamily.propTypes = {
  getEditorState: PropTypes.func.isRequired,
  setEditorState: PropTypes.func.isRequired,
  modalHandler: PropTypes.object,
  config: PropTypes.object,
};

export default FontFamily;
