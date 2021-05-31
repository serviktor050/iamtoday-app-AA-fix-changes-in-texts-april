import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {EditorState, Modifier} from 'draft-js';
import classNames from 'classnames';
import Option from '../../../../components/Option';
import styles from './styles.css'; // eslint-disable-line no-unused-vars

const inlineStylesList = [
  'BOLD', 'ITALIC', 'UNDERLINE', 'STRIKETHROUGH', 'MONOSPACE', 'FONTFAMILY',
  'COLOR', 'BGCOLOR', 'FONTSIZE', 'SUPERSCRIPT', 'SUBSCRIPT', 'UPPERCASE'
];

class Remove extends Component {

  removeAllInlineStyles() {
    const {getEditorState, setEditorState} = this.props;
    const editorState = getEditorState();

    let contentState = editorState.getCurrentContent();

    inlineStylesList.forEach((style) => {
      contentState = Modifier.removeInlineStyle(
        contentState,
        editorState.getSelection(),
        style
      );
    });

    setEditorState(EditorState.push(editorState, contentState, 'change-inline-style'));
  };

  render() {
    const {config: {icon, className}} = this.props;
    return (
      <div className="itd-remove-wrapper" aria-label="itd-remove-control">
        <Option
          hint="Удалить все стили"
          className={classNames(className)}
          onClick={() => this.removeAllInlineStyles()}
        >
          {icon}
        </Option>
      </div>
    );
  }
}

Remove.propTypes = {
  setEditorState: PropTypes.func.isRequired,
  getEditorState: PropTypes.func.isRequired,
  config: PropTypes.object,
};

export default Remove;
