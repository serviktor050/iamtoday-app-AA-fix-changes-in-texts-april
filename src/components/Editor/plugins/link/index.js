import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {Entity, EditorState, Modifier} from 'draft-js';
import {getSelectedBlock, getSelectionEntity} from 'draftjs-utils';
import linkifyIt from 'linkify-it';
import tlds from 'tlds';
import Icon from '../../components/Icon';
import styles from './styles.css'; // eslint-disable-line no-unused-vars

const linkify = linkifyIt();
linkify.tlds(tlds);

function findLinkEntities(contentBlock, callback, contentState) {
  // console.log('fe', contentBlock.getText());
  contentBlock.findEntityRanges(
    (character) => {
      const entityKey = character.getEntity();
      return (
        entityKey !== null &&
        Entity.get(entityKey).getType() === 'LINK'
      );
    },
    callback
  );
}

class Link extends Component {

  constructor(props) {
    super(props);

    this.state = {
      showPopOver: false,
    }
  }

  openLink() {
    const {entityKey, contentState} = this.props;
    const {url} = Entity.get(entityKey).getData();
    const linkTab = window.open(url, 'blank'); // eslint-disable-line no-undef
    linkTab.focus();
  };

  toggleShowPopOver() {
    const showPopOver = !this.state.showPopOver;
    this.setState({
      showPopOver,
    });
  };

  render() {
    const {children, entityKey, contentState} = this.props;
    const {url, title} = Entity.get(entityKey).getData();
    const {showPopOver} = this.state;
    return (
      <span
        className="itd-link-decorator-wrapper"
        onMouseEnter={() => this.toggleShowPopOver()}
        onMouseLeave={() => this.toggleShowPopOver()}
      >
        <a href={url}>{children}</a>
        {showPopOver ?
          <span
            onClick={() => this.openLink()}
            className="itd-link-decorator-icon"
          >
            <Icon kind="openlink"/>
          </span>
          : undefined
        }
      </span>
    );
  }
}

Link.propTypes = {
  entityKey: PropTypes.string.isRequired,
  children: PropTypes.array,
  contentState: PropTypes.object,
};

export default (config) => {
  return {
    onChange (editorState, {getEditorState, setEditorState}) {
      const contentBlock = getSelectedBlock(editorState);
      const links = linkify.match(contentBlock.get('text'));

      if (typeof links !== 'undefined' && links !== null) {
        let selection = editorState.getSelection();

        links
          .filter((link) => contentBlock.getEntityAt(link.index) === null)
          .forEach((link) => {
            const entityKey = Entity.create('LINK', 'MUTABLE', {url: link.url});

            selection = selection.merge({
              anchorOffset: link.index,
              focusOffset: link.lastIndex,
            });

            let contentState = Modifier.replaceText(
              editorState.getCurrentContent(),
              selection,
              `${link.url}`,
              editorState.getCurrentInlineStyle(),
              entityKey,
            );

            editorState = EditorState.push(editorState, contentState, 'insert-characters');

            // insert a blank space after link

            selection = editorState.getSelection().merge({
              anchorOffset: selection.get('anchorOffset') + link.url.length,
              focusOffset: selection.get('anchorOffset') + link.url.length,
            });

            editorState = EditorState.acceptSelection(editorState, selection);

            contentState = Modifier.insertText(
              editorState.getCurrentContent(),
              selection,
              ' ',
              editorState.getCurrentInlineStyle(),
              undefined
            );

            editorState = EditorState.push(editorState, contentState, 'insert-characters');
          });
      }

      return editorState;
    },

    decorators: [
      {
        strategy: findLinkEntities,
        component: Link,
      }
    ]
  }
};
