/* @flow */

import PropTypes from 'prop-types';

import React, { Component } from 'react';
import {
  fontSizes,
  getSelectionCustomInlineStyle,
} from 'draftjs-utils';
import toggleCustomInlineStyle from '../../utils/toggleCustomInlineStyle';
import classNames from 'classnames';
import {Dropdown, DropdownOption} from '../../../../components/Dropdown';
import styles from './styles.css'; // eslint-disable-line no-unused-vars

class FontSize extends Component {

  constructor(props) {
    super(props);

    this.state = {
      currentFontSize: undefined,
    }
  }

  componentWillMount() {
    const {getEditorState} = this.props;
    if (getEditorState) {
      this.setState({
        currentFontSize: getSelectionCustomInlineStyle(getEditorState(), ['FONTSIZE']).FONTSIZE,
      });
    }
  }

  componentWillReceiveProps(properties) {
    if (properties.getEditorState) {
      const newFontSize = getSelectionCustomInlineStyle(properties.getEditorState(), ['FONTSIZE']).FONTSIZE;
      if (newFontSize !== this.state.currentFontSize) {
        this.setState({
          currentFontSize: newFontSize,
        });
      }
    }
  }

  toggleFontSize(fontSize) {
    const {getEditorState, setEditorState} = this.props;
    const fontSizeStr = fontSize && (fontSize.toString() || '');

    const newState = toggleCustomInlineStyle(
      getEditorState(),
      'fontSize',
      fontSizeStr,
    );
    if (newState) {
      setEditorState(newState);
    }
  };

  render() {
    const {config: {icon, className, options}, modalHandler} = this.props;
    let {currentFontSize} = this.state;
    currentFontSize = currentFontSize
      && Number(currentFontSize.substring(9, currentFontSize.length));

    return (
      <div className="itd-fontsize-wrapper" aria-label="itd-font-size-control">
        <Dropdown
          hint="Размер текста"
          className={classNames('itd-fontsize-dropdown', className)}
          onChange={(value) => this.toggleFontSize(value)}
          modalHandler={modalHandler}
        >
          {
            currentFontSize ? <span>{currentFontSize}</span> : icon
          }

          {
            options.map((size, index) =>
              <DropdownOption
                className="itd-fontsize-option"
                active={currentFontSize === size}
                value={`fontsize-${size}`}
                key={index}
              >
                {size}
              </DropdownOption>
            )
          }
        </Dropdown>
      </div>
    );
  }
}

FontSize.propTypes = {
  getEditorState: PropTypes.func.isRequired,
  setEditorState: PropTypes.func.isRequired,
  modalHandler: PropTypes.object,
  config: PropTypes.object,
};

export default FontSize;
