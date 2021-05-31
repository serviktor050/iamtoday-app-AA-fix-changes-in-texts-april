/* @flow */

import PropTypes from 'prop-types';

import React, { Component } from 'react';
import classNames from 'classnames';
import {
  getSelectionCustomInlineStyle,
} from 'draftjs-utils';
import toggleCustomInlineStyle from '../../utils/toggleCustomInlineStyle'
import Option from '../../../../components/Option';
import styles from './styles.css'; // eslint-disable-line no-unused-vars

class ColorPicker extends Component {

  constructor(props) {
    super(props);

    this.state = {
      currentColor: undefined,
      currentBgColor: undefined,
      showModal: false,
      currentStyle: 'color',
    }

    this.showHideModal = this.showHideModal.bind(this);
  }

  componentWillMount() {
    const {editorState, modalHandler} = this.props;
    if (editorState) {
      this.setState({
        currentColor: getSelectionCustomInlineStyle(editorState, ['COLOR']).COLOR,
        currentBgColor: getSelectionCustomInlineStyle(editorState, ['BGCOLOR']).BGCOLOR,
      });
    }
    modalHandler.registerCallBack(this.showHideModal);
  }

  componentWillReceiveProps(properties) {
    const newState = {};
    if (properties.editorState &&
      this.props.editorState !== properties.editorState) {
      newState.currentColor
        = getSelectionCustomInlineStyle(properties.editorState, ['COLOR']).COLOR;
      newState.currentBgColor
        = getSelectionCustomInlineStyle(properties.editorState, ['BGCOLOR']).BGCOLOR;
    }
    this.setState(newState);
  }

  componentWillUnmount() {
    const {modalHandler} = this.props;
    modalHandler.deregisterCallBack(this.showHideModal);
  }

  onOptionClick() {
    const {modalHandler} = this.props;
    modalHandler.closeAllModals();
    this.signalShowModal = !this.state.showModal;
    this.showHideModal();
  };

  setCurrentStyleBgcolor() {
    this.setState({
      currentStyle: 'bgcolor',
    });
  };

  setCurrentStyleColor() {
    this.setState({
      currentStyle: 'color',
    });
  };

  showHideModal() {
    this.setState({
      showModal: this.signalShowModal,
    });
    this.signalShowModal = false;
  }

  toggleColor(color) {
    const {getEditorState, setEditorState} = this.props;
    const {currentStyle} = this.state;
    const newState = toggleCustomInlineStyle(
      getEditorState(),
      currentStyle,
      `${currentStyle}-${color}`
    );
    if (newState) {
      setEditorState(newState);
    }
  };

  stopPropagation(event) {
    event.preventDefault();
    event.stopPropagation();
  };

  renderModal() {
    const {config: {popupClassName, colors}, modalHandler} = this.props;
    const {currentColor, currentBgColor, currentStyle} = this.state;
    const currentSelectedColor = (currentStyle === 'color') ? currentColor : currentBgColor;
    return (
      <div
        className={classNames('itd-colorpicker-modal', popupClassName)}
        onClick={this.stopPropagation}
      >
        <span className="itd-colorpicker-modal-header">
          <span
            className={classNames(
              'itd-colorpicker-modal-style-label',
              {'itd-colorpicker-modal-style-label-active': currentStyle === 'color'}
            )}
            onClick={() => this.setCurrentStyleColor()}
          >
            Text
          </span>
          <span
            className={classNames(
              'itd-colorpicker-modal-style-label',
              {'itd-colorpicker-modal-style-label-active': currentStyle === 'bgcolor'}
            )}
            onClick={() => this.setCurrentStyleBgcolor()}
          >
            Background
          </span>
        </span>
        <span className="itd-colorpicker-modal-options">
          {
            colors.map((color, index) =>
              <Option
                value={color}
                key={index}
                modalHandler={modalHandler}
                className="itd-colorpicker-option"
                activeClassName="itd-colorpicker-option-active"
                active={currentSelectedColor === `${currentStyle}-${color}`}
                onClick={(value) => this.toggleColor(value)}
              >
                <span
                  style={{backgroundColor: color}}
                  className="itd-colorpicker-cube"
                />
              </Option>)
          }
        </span>
      </div>
    );
  };

  render() {
    const {config: {icon, className}} = this.props;
    const {showModal} = this.state;
    return (
      <div
        className="itd-colorpicker-wrapper"
        aria-haspopup="true"
        aria-expanded={showModal}
        aria-label="itd-color-picker"
      >
        <Option
          hint="Выбор цвета"
          onClick={(value) => this.onOptionClick(value)}
          className={classNames(className)}
        >
          {icon}
        </Option>
        {showModal ? this.renderModal() : undefined}
      </div>
    );
  }
}

ColorPicker.propTypes = {
  getEditorState: PropTypes.func.isRequired,
  setEditorState: PropTypes.func.isRequired,
  modalHandler: PropTypes.object,
  config: PropTypes.object,
};

export default ColorPicker;