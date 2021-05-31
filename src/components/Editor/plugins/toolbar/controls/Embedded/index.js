import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {Entity, AtomicBlockUtils} from 'draft-js';
import classNames from 'classnames';
import Option from '../../../../components/Option';
import styles from './styles.css'; // eslint-disable-line no-unused-vars

class Embedded extends Component {
  constructor(props) {
    super(props);

    this.state = {
      embeddedLink: '',
      showModal: false,
      height: 'auto',
      width: '100%',
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

  updateEmbeddedLink(event) {
    this.setState({
      embeddedLink: event.target.value,
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

  addEmbeddedLink() {
    const {getEditorState, setEditorState} = this.props;
    const {embeddedLink, height, width} = this.state;
    const entityKey = Entity.create('EMBEDDED_LINK', 'MUTABLE', {src: embeddedLink, height, width});
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
      embeddedLink: undefined,
    });
    this.signalShowModal = false;
  }

  closeModal() {
    this.setState({
      showModal: false,
      embeddedLink: undefined,
    });
  };

  stopPropagation(event) {
    event.preventDefault();
    event.stopPropagation();
  };

  rendeEmbeddedLinkModal() {
    const {embeddedLink, height, width} = this.state;
    const {config: {popupClassName}} = this.props;
    return (
      <div
        className={classNames('itd-embedded-modal', popupClassName)}
        onClick={this.stopPropagation}
      >
        <div className="itd-embedded-modal-header">
          <span className="itd-embedded-modal-header-option">
            <span>Embedded Link</span>
            <span className="itd-embedded-modal-header-label"/>
          </span>
        </div>
        <div className="itd-embedded-modal-link-section">
          <input
            ref={(ref) => this.setURLInputReference(ref)}
            className="itd-embedded-modal-link-input"
            placeholder="Enter link"
            onChange={(event) => this.updateEmbeddedLink(event)}
            onBlur={(event) => this.updateEmbeddedLink(event)}
            value={embeddedLink}
          />
          <div className="itd-embedded-modal-size">
            <input
              ref={(ref) => this.setHeightInputReference(ref)}
              onChange={(event) => this.updateHeight(event)}
              onBlur={(event) => this.updateHeight(event)}
              value={height}
              className="itd-embedded-modal-size-input"
              placeholder="Height"
            />
            <input
              ref={(ref) => this.setWidthInputReference(ref)}
              onChange={(event) => this.updateWidth(event)}
              onBlur={(event) => this.updateWidth(event)}
              value={width}
              className="itd-embedded-modal-size-input"
              placeholder="Width"
            />
          </div>
        </div>
        <span className="itd-embedded-modal-btn-section">
          <button
            className="itd-embedded-modal-btn"
            onClick={(event) => this.addEmbeddedLink(event)}
            disabled={!embeddedLink || !height || !width}
          >
            Add
          </button>
          <button
            className="itd-embedded-modal-btn"
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
        className="itd-embedded-wrapper"
        aria-haspopup="true"
        aria-expanded={showModal}
        aria-label="itd-embedded-control"
      >
        <Option
          hint="Вставить фрейм"
          className={classNames(className)}
          value="unordered-list-item"
          onClick={(value) => this.onOptionClick(value)}
        >
          {icon}
        </Option>
        {showModal ? this.rendeEmbeddedLinkModal() : undefined}
      </div>
    );
  }
}

Embedded.propTypes = {
  getEditorState: PropTypes.func.isRequired,
  setEditorState: PropTypes.func.isRequired,
  modalHandler: PropTypes.object,
  config: PropTypes.object,
};

export default Embedded;
