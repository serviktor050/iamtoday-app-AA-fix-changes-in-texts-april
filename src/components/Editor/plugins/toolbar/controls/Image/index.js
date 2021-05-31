/* @flow */

import PropTypes from 'prop-types';

import React, { Component } from 'react';
import {Entity, AtomicBlockUtils} from 'draft-js';
import classNames from 'classnames';
import Option from '../../../../components/Option';
import Spinner from '../../../../components/Spinner';
import styles from './styles.css'; // eslint-disable-line no-unused-vars

class ImageControl extends Component {

  constructor(props) {
    super(props);

    this.state = {
      imgSrc: '',
      showModal: false,
      dragEnter: false,
      uploadHighlighted: props.config.uploadEnabled && !!props.config.uploadCallback,
      showImageLoading: false,
      height: 'auto',
      width: '100%',
    }

    this.hideModal = this.hideModal.bind(this);
    this.showHideModal = this.showHideModal.bind(this);
  }

  componentWillMount() {
    const {modalHandler} = this.props;
    modalHandler.registerCallBack(this.showHideModal);
  }

  componentWillReceiveProps(properties) {
    if (properties.config.uploadCallback !== this.props.config.uploadCallback ||
      properties.config.uploadEnabled !== this.props.config.uploadEnabled) {
      this.setState({
        uploadHighlighted: properties.config.uploadEnabled && !!properties.config.uploadCallback,
      });
    }
  }

  componentWillUnmount() {
    const {modalHandler} = this.props;
    modalHandler.deregisterCallBack(this.showHideModal);
  }

  onImageDrop(event) {
    event.preventDefault();
    event.stopPropagation();

    this.setState({
      dragEnter: false,
    });
    this.uploadImage(event.dataTransfer.files[0]);
  }

  onDragEnter(event) {
    this.stopPropagation(event);
    this.setState({
      dragEnter: true,
    });
  }

  onOptionClick(event) {
    this.signalShowModal = !this.state.showModal;
    this.showHideModal();
  };

  setImageURLInputReference(ref) {
    this.imageURLInput = ref;
  };

  setHeightInputReference(ref) {
    this.heightInput = ref;
  };

  setWidthInputReference(ref) {
    this.widthInput = ref;
  };

  updateImageSrc(event) {
    this.setState({
      imgSrc: event.target.value,
    });
  }

  updateHeight(event) {
    this.setState({
      height: event.target.value,
    });
  }

  updateWidth(event) {
    this.setState({
      width: event.target.value,
    });
  }

  toggleShowImageLoading() {
    return () => {
      const showImageLoading = !this.state.showImageLoading;
      this.setState({
        showImageLoading,
      });
    }
  };

  showImageURLOption() {
    return () => {
      this.setState({
        uploadHighlighted: false,
      });
    }
  };

  showImageUploadOption() {
    return () => {
      this.setState({
        uploadHighlighted: true,
      });
    }
  };

  hideModal() {
    this.setState({
      showModal: false,
      imgSrc: undefined,
    });
  };

  showHideModal() {
    this.setState({
      showModal: this.signalShowModal,
      imgSrc: undefined,
      uploadHighlighted: this.props.config.uploadEnabled && !!this.props.config.uploadCallback,
    });
    this.signalShowModal = false;
  }

  selectImage(event) {
    if (event.target.files && event.target.files.length > 0) {
      this.uploadImage(event.target.files[0]);
    }
  };

  uploadImage(file) {
    this.toggleShowImageLoading();
    const {uploadCallback} = this.props.config;
    uploadCallback(file)
      .then(({data}) => {
        this.setState({
          showImageLoading: false,
          dragEnter: false,
        });
        this.addImageFromSrcLink(data.link);
      });
  };

  addImageFromState() {
    this.addImage(this.state.imgSrc);
  };

  addImageFromSrcLink(src) {
    this.addImage(src);
  };

  addImage(imgSrc) {
    const {getEditorState, setEditorState} = this.props;
    const editorState = getEditorState();
    const src = imgSrc || this.state.imgSrc;
    const {height, width} = this.state;

    const entityKey = Entity.create(
      'IMAGE',
      'MUTABLE',
      {src, height, width}
    );

    const newEditorState = AtomicBlockUtils.insertAtomicBlock(
      editorState,
      entityKey,
      ' '
    );
    setEditorState(newEditorState);
    this.hideModal();
  };

  fileUploadClick() {
    this.fileUpload = true;
    this.signalShowModal = true;
  }

  stopPropagation(event) {
    if (!this.fileUpload) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      this.fileUpload = false;
    }
  };

  renderAddImageModal() {
    const {imgSrc, uploadHighlighted, showImageLoading, dragEnter, height, width} = this.state;
    const {config: {popupClassName, uploadCallback, uploadEnabled, urlEnabled}} = this.props;
    return (
      <div
        className={classNames('itd-image-modal', popupClassName)}
        onClick={(e) => this.stopPropagation(e)}
      >
        <div className="itd-image-modal-header">
          {uploadEnabled && uploadCallback &&
          <span
            onClick={this.showImageUploadOption()}
            className="itd-image-modal-header-option"
          >
              <span>File Upload</span>
              <span
                className={classNames(
                  'itd-image-modal-header-label',
                  {'itd-image-modal-header-label-highlighted': uploadHighlighted}
                )}
              />
            </span>}
          { urlEnabled &&
          <span
            onClick={this.showImageURLOption()}
            className="itd-image-modal-header-option"
          >
              <span>URL</span>
              <span
                className={classNames(
                  'itd-image-modal-header-label',
                  {'itd-image-modal-header-label-highlighted': !uploadHighlighted}
                )}
              />
            </span>}
        </div>
        {
          uploadHighlighted ?
            <div onClick={() => this.fileUploadClick()}>
              <div
                onDragEnter={(e) => this.onDragEnter(e)}
                onDragOver={(e) => this.stopPropagation(e)}
                onDrop={(e) => this.onImageDrop(e)}
                className={classNames(
                  'itd-image-modal-upload-option',
                  {'itd-image-modal-upload-option-highlighted': dragEnter})}
              >
                <label
                  htmlFor="wysiwyg-file"
                  className="itd-image-modal-upload-option-label"
                >
                  Drop the file or click to upload
                </label>
              </div>
              <input
                type="file"
                id="wysiwyg-file"
                onChange={(e) => this.selectImage(e)}
                className="itd-image-modal-upload-option-input"
              />
            </div> :
            <div className="itd-image-modal-url-section">
              <input
                ref={(ref) => this.setImageURLInputReference}
                className="itd-image-modal-url-input"
                placeholder="Enter url"
                onChange={(e) => this.updateImageSrc(e)}
                onBlur={(e) => this.updateImageSrc(e)}
                value={imgSrc}
              />
            </div>
        }
        <div className="itd-embedded-modal-size">
          <input
            ref={(ref) => this.setHeightInputReference}
            onChange={(e) => this.updateHeight(e)}
            onBlur={(e) => this.updateHeight(e)}
            value={height}
            className="itd-embedded-modal-size-input"
            placeholder="Height"
          />
          <input
            ref={(ref) => this.setWidthInputReference}
            onChange={(e) => this.updateWidth(e)}
            onBlur={(e) => this.updateWidth(e)}
            value={width}
            className="itd-embedded-modal-size-input"
            placeholder="Width"
          />
        </div>
        <span className="itd-image-modal-btn-section">
          <button
            className="itd-image-modal-btn"
            onClick={() => this.addImageFromState()}
            disabled={!imgSrc || !height || !width}
          >
            Add
          </button>
          <button
            className="itd-image-modal-btn"
            onClick={this.hideModal}
          >
            Cancel
          </button>
        </span>
        {showImageLoading ?
          <div className="itd-image-modal-spinner">
            <Spinner />
          </div> :
          undefined}
      </div>
    );
  }

  render() {
    const {config} = this.props;
    const {icon, className} = config;
    const {showModal} = this.state;
    return (
      <div
        className="itd-image-wrapper"
        aria-haspopup="true"
        aria-expanded={showModal}
        aria-label="itd-image-control"
      >
        <Option
          hint="Вставить изображение"
          className={classNames(className)}
          value="unordered-list-item"
          onClick={(e) => this.onOptionClick(e)}
        >
          {icon}
        </Option>
        {showModal ? this.renderAddImageModal() : undefined}
      </div>
    );
  }
}

ImageControl.propTypes = {
  setEditorState: PropTypes.func.isRequired,
  getEditorState: PropTypes.func.isRequired,
  modalHandler: PropTypes.object,
  config: PropTypes.object,
};

export default ImageControl;