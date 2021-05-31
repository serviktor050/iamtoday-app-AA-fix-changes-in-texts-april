import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {Entity, AtomicBlockUtils} from 'draft-js';
import classNames from 'classnames';
import Option from '../../../../components/Option';
import styles from './styles.css'; // eslint-disable-line no-unused-vars

const youtubePattern = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/

class Youtube extends Component {
  constructor(props) {
    super(props);

    this.state = {
      youtubeLink: '',
      showModal: false,
      height: '315px',
      width: '560px',
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
  }

  setURLInputReference(ref) {
    this.urlInput = ref;
  };

  setHeightInputReference(ref) {
    this.heightInput = ref;
  };

  setWidthInputReference(ref) {
    this.widthInput = ref;
  };

  updateYoutubeLink(event) {
    this.setState({
      youtubeLink: event.target.value,
    });
  };

  updateHeight(event) {
    this.setState({
      height: event.target.value,
    });
  };

  updateWidth(event) {
    this.setState({
      width: event.target.value,
    });
  };

  addYoutubeLink() {
    const {getEditorState, setEditorState} = this.props;
    const {youtubeLink, height, width} = this.state;
    const entityKey = Entity.create('YOUTUBE_LINK', 'MUTABLE', {src: youtubeLink, height, width});
    const newEditorState = AtomicBlockUtils.insertAtomicBlock(
      getEditorState(),
      entityKey,
      ' '
    );
    setEditorState(newEditorState);
    this.closeModal();
  };

  showHideModal() {
    this.setState({
      showModal: this.signalShowModal,
      youtubeLink: undefined,
    });
    this.signalShowModal = false;
  }

  closeModal() {
    this.setState({
      showModal: false,
      youtubeLink: undefined,
    });
  };

  stopPropagation(event) {
    event.preventDefault();
    event.stopPropagation();
  };

  rendeYoutubeLinkModal() {
    const {youtubeLink, height, width} = this.state;
    const {config: {popupClassName}} = this.props;
    const isLinkValid = youtubeLink && youtubeLink.match(youtubePattern);

    return (
      <div
        className={classNames('itd-youtube-modal', popupClassName)}
        onClick={this.stopPropagation}
      >
        <div className="itd-youtube-modal-header">
          <span className="itd-youtube-modal-header-option">
            <span>Youtube Link</span>
            <span className="itd-youtube-modal-header-label"/>
          </span>
        </div>
        <div className="itd-youtube-modal-link-section">
          <input
            ref={(ref) => this.setURLInputReference(ref)}
            className="itd-youtube-modal-link-input"
            placeholder="Enter link"
            onChange={(event) => this.updateYoutubeLink(event)}
            onBlur={(event) => this.updateYoutubeLink(event)}
            value={youtubeLink}
          />
          <div className="itd-youtube-modal-size">
            <input
              ref={(ref) => this.setHeightInputReference(ref)}
              onChange={(event) => this.updateHeight(event)}
              onBlur={(event) => this.updateHeight(event)}
              value={height}
              className="itd-youtube-modal-size-input"
              placeholder="Height"
            />
            <input
              ref={(ref) => this.setWidthInputReference(ref)}
              onChange={(event) => this.updateWidth(event)}
              onBlur={(event) => this.updateWidth(event)}
              value={width}
              className="itd-youtube-modal-size-input"
              placeholder="Width"
            />
          </div>
        </div>
        <span className="itd-youtube-modal-btn-section">
          <button
            className="itd-youtube-modal-btn"
            onClick={(event) => this.addYoutubeLink(event)}
            disabled={!isLinkValid || !height || !width}
          >
            Add
          </button>
          <button
            className="itd-youtube-modal-btn"
            onClick={(event) => this.closeModal(event)}
          >
            Cancel
          </button>
        </span>
      </div>
    );
  }

  render() {
    const {config: {icon, className}} = this.props;
    const {showModal} = this.state;

    return (
      <div
        className="itd-youtube-wrapper"
        aria-haspopup="true"
        aria-expanded={showModal}
        aria-label="itd-youtube-control"
      >
        <Option
          hint="Вставить YouTube плеер"
          className={classNames(className)}
          value="unordered-list-item"
          onClick={(value) => this.onOptionClick(value)}
        >
          {icon}
        </Option>
        {showModal ? this.rendeYoutubeLinkModal() : undefined}
      </div>
    );
  }
}

Youtube.propTypes = {
  getEditorState: PropTypes.func.isRequired,
  setEditorState: PropTypes.func.isRequired,
  modalHandler: PropTypes.object,
  config: PropTypes.object,
};

export default Youtube;
