/* @flow */

import PropTypes from 'prop-types';

import React, { Component } from 'react';
import {Entity, RichUtils, EditorState, Modifier} from 'draft-js';
import {
  getSelectionText,
  getEntityRange,
  getSelectionEntity,
} from 'draftjs-utils';
import classNames from 'classnames';
import {getFirstIcon} from '../../utils/toolbar';
import Option from '../../../../components/Option';
import {Dropdown, DropdownOption} from '../../../../components/Dropdown';
import styles from './styles.css'; // eslint-disable-line no-unused-vars

class Link extends Component {

  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
      linkTarget: '',
      linkTitle: '',
    }
  }

  componentWillMount() {
    const {getEditorState, modalHandler} = this.props;
    if (getEditorState) {
      this.setState({
        currentEntity: getSelectionEntity(getEditorState()),
      });
    }
    modalHandler.registerCallBack(() => this.showHideModal());
  }

  componentWillReceiveProps(properties) {
    const newState = {};
    if (properties.getEditorState) {
      const newEntity = getSelectionEntity(properties.getEditorState());
      if (this.state.currentEntity !== newEntity)
        newState.currentEntity = newEntity;
    }
    this.setState(newState);
  }

  componentWillUnmount() {
    const {modalHandler} = this.props;
    modalHandler.deregisterCallBack(() => this.showHideModal());
  }

  onOptionClick() {
    this.signalShowModal = !this.state.showModal;

    this.showHideModal();
  };

  setLinkTextReference(ref) {
    this.linkText = ref;
  };

  setLinkTitleReference(ref) {
    this.linkTitle = ref;
  };

  removeLink() {
    const {getEditorState, setEditorState} = this.props;
    const {currentEntity} = this.state;
    const editorState = getEditorState();
    let selection = editorState.getSelection();
    if (currentEntity) {
      const entityRange = getEntityRange(editorState, currentEntity);
      selection = selection.merge({
        anchorOffset: entityRange.start,
        focusOffset: entityRange.end,
      });
      setEditorState(RichUtils.toggleLink(editorState, selection, null));
    }
  };

  addLink() {
    const {getEditorState, setEditorState} = this.props;
    const {linkTitle, linkTarget, currentEntity} = this.state;
    const editorState = getEditorState();
    let selection = editorState.getSelection();

    if (currentEntity) {
      const entityRange = getEntityRange(editorState, currentEntity);
      selection = selection.merge({
        anchorOffset: entityRange.start,
        focusOffset: entityRange.end,
      });
    }
    // const entityKey = editorState
    //   .getCurrentContent()
    //   .createEntity('LINK', 'MUTABLE', {url: linkTarget})
    //   .getLastCreatedEntityKey();
    const entityKey = Entity.create('LINK', 'MUTABLE', {url: linkTarget});

    let contentState = Modifier.replaceText(
      editorState.getCurrentContent(),
      selection,
      `${linkTitle}`,
      editorState.getCurrentInlineStyle(),
      entityKey,
    );
    let newEditorState = EditorState.push(editorState, contentState, 'insert-characters');

    // insert a blank space after link
    selection = newEditorState.getSelection().merge({
      anchorOffset: selection.get('anchorOffset') + linkTitle.length,
      focusOffset: selection.get('anchorOffset') + linkTitle.length,
    });
    newEditorState = EditorState.acceptSelection(newEditorState, selection);
    contentState = Modifier.insertText(
      newEditorState.getCurrentContent(),
      selection,
      ' ',
      newEditorState.getCurrentInlineStyle(),
      undefined
    );
    setEditorState(EditorState.push(newEditorState, contentState, 'insert-characters'));
    this.hideLinkModal();
  };

  updateLinkTarget(event) {
    this.setState({
      linkTarget: event.target.value,
    });
  };

  updateLinkTitle(event) {
    this.setState({
      linkTitle: event.target.value,
    });
  };

  hideLinkModal() {
    this.setState({
      showModal: false,
    });
  };

  showHideModal() {
    const newState = {};
    newState.showModal = this.signalShowModal;
    if (newState.showModal) {
      const {getEditorState} = this.props;
      const {currentEntity} = this.state;
      const editorState = getEditorState();
      const contentState = editorState.getCurrentContent();
      newState.linkTarget = undefined;
      newState.linkTitle = undefined;
      if (currentEntity && (Entity.get(currentEntity).get('type') === 'LINK')) {
        newState.entity = currentEntity;
        const entityRange = currentEntity && getEntityRange(editorState, currentEntity);
        newState.linkTarget = currentEntity && Entity.get(currentEntity).get('data').url;
        newState.linkTitle = (entityRange && entityRange.text) ||
          getSelectionText(editorState);
      } else {
        newState.linkTitle = getSelectionText(editorState);
      }
    }
    this.setState(newState);
    this.signalShowModal = false;
  }

  stopPropagation(event) {
    event.preventDefault();
    event.stopPropagation();
  };

  renderAddLinkModal() {
    const {config: {popupClassName}} = this.props;
    const {linkTitle, linkTarget} = this.state;
    return (
      <div
        className={classNames('itd-link-modal', popupClassName)}
        onClick={this.stopPropagation}
      >
        <span className="itd-link-modal-label">Link Title</span>
        <input
          ref={(ref) => this.setLinkTitleReference(ref)}
          className="itd-link-modal-input"
          onChange={(value) => this.updateLinkTitle(value)}
          onBlur={(event) => this.updateLinkTitle(event)}
          value={linkTitle}
        />
        <span className="itd-link-modal-label">Link Target</span>
        <input
          ref={(ref) => this.setLinkTextReference(ref)}
          className="itd-link-modal-input"
          onChange={(value) => this.updateLinkTarget(value)}
          onBlur={(event) => this.updateLinkTarget(event)}
          value={linkTarget}
        />
        <span className="itd-link-modal-buttonsection">
          <button
            className="itd-link-modal-btn"
            onClick={(event) => this.addLink(event)}
            disabled={!linkTarget || !linkTitle}
          >
            Add
          </button>
          <button
            className="itd-link-modal-btn"
            onClick={(event) => this.hideLinkModal(event)}
          >
            Cancel
          </button>
        </span>
      </div>
    );
  }

  renderInFlatList(showModal, currentEntity, config) {
    const {options, link, unlink, className} = config;
    const {getEditorState} = this.props;
    const linkEntityCurrently = currentEntity && (Entity.get(currentEntity).get('type') === 'LINK');
    return (
      <div className={classNames('itd-link-wrapper', className)} aria-label="itd-link-control">
        {
          options.indexOf('link') >= 0 && <Option
            hint="Добавить ссылку"
            value="unordered-list-item"
            className={classNames(link.className)}
            onClick={() => this.onOptionClick()}
            aria-haspopup="true"
            aria-expanded={showModal}
          >
            {link.icon}
          </Option>
        }

        {
          options.indexOf('unlink') >= 0 && <Option
            hint="Удалить ссылку"
            disabled={!linkEntityCurrently}
            value="ordered-list-item"
            className={classNames(unlink.className)}
            onClick={() => this.removeLink()}
          >
            {unlink.icon}
          </Option>
        }

        {showModal ? this.renderAddLinkModal() : undefined}
      </div>
    );
  }

  render() {
    const {config} = this.props;
    const {showModal, currentEntity} = this.state;
    return this.renderInFlatList(showModal, currentEntity, config);
  }
}


Link.propTypes = {
  getEditorState: PropTypes.func.isRequired,
  setEditorState: PropTypes.func.isRequired,
  modalHandler: PropTypes.object,
  config: PropTypes.object,
};

export default Link;