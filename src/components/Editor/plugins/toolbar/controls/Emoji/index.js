import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {Modifier, EditorState} from 'draft-js';
import classNames from 'classnames';
import Option from '../../../../components/Option';
import styles from './styles.css'; // eslint-disable-line no-unused-vars

class Emoji extends Component {

  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
    };
    this.showHideModal = this.showHideModal.bind(this);
  }

  componentWillMount() {
    const {modalHandler} = this.props;
    modalHandler.registerCallBack(this.showHideModal);
  }

  componentWillUnmount() {
    const {modalHandler} = this.props;
    modalHandler.deregisterCallBack(this.showHideModal);
  }

  onOptionClick() {
    this.signalShowModal = !this.state.showModal;

    this.showHideModal();
  };

  addEmoji(event) {
    const {getEditorState, setEditorState} = this.props;
    const editorState = getEditorState();
    const contentState = Modifier.insertText(
      editorState.getCurrentContent(),
      editorState.getSelection(),
      `${event.target.innerHTML} `,
      editorState.getCurrentInlineStyle(),
    );
    setEditorState(EditorState.push(editorState, contentState, 'insert-characters'));
    this.hideModal();
  };

  hideModal() {
    this.setState({
      showModal: false,
    });
  };

  showHideModal() {
    this.setState({
      showModal: this.signalShowModal,
    });
    this.signalShowModal = false;
  }

  stopPropagation(event) {
    event.preventDefault();
    event.stopPropagation();
  };

  renderEmojiModal() {
    const {config: {popupClassName, emojis}} = this.props;
    return (
      <div
        className={classNames('itd-emoji-modal', popupClassName)}
        onMouseDown={this.stopPropagation}
      >
        {
          emojis.map((emoji, index) => (<span
            key={index}
            className="itd-emoji-icon"
            role="presentation"
            onClick={(value) => this.addEmoji(value)}
          >{emoji}</span>))
        }
      </div>
    );
  }

  render() {
    const {config: {icon, className}} = this.props;
    const {showModal} = this.state;
    return (
      <div
        className="itd-emoji-wrapper"
        aria-haspopup="true"
        aria-label="itd-emoji-control"
        aria-expanded={showModal}
      >
        <Option
          hint="Эмодзи"
          className={classNames(className)}
          value="unordered-list-item"
          onClick={(value) => this.onOptionClick(value)}
        >
          {icon}
        </Option>
        {showModal ? this.renderEmojiModal() : undefined}
      </div>
    );
  }
}

Emoji.propTypes = {
  getEditorState: PropTypes.func.isRequired,
  setEditorState: PropTypes.func.isRequired,
  modalHandler: PropTypes.object,
  config: PropTypes.object,
};

export default Emoji;