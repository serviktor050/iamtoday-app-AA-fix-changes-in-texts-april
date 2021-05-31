/* @flow */

import PropTypes from 'prop-types';

import React, { Component } from 'react';
import {EditorState} from 'draft-js';
import classNames from 'classnames';
import Option from '../../../../components/Option';
import styles from './styles.css'; // eslint-disable-line no-unused-vars

class History extends Component {

  constructor(props) {
    super(props);

    this.state = {
      undoDisabled: false,
      redoDisabled: false,
    };
  }

  componentWillMount() {
    const {getEditorState} = this.props;
    const editorState = getEditorState();
    if (editorState) {
      this.setState({
        undoDisabled: editorState.getUndoStack().size === 0,
        redoDisabled: editorState.getRedoStack().size === 0,
      });
    }
  }

  componentWillReceiveProps(properties) {
    if (properties.getEditorState) {
      const editorState = properties.getEditorState();
      const undoDisabled = editorState.getUndoStack().size === 0;
      const redoDisabled = editorState.getRedoStack().size === 0;

      if (undoDisabled !== this.state.undoDisabled || redoDisabled !== this.state.redoDisabled) {
        this.setState({
          undoDisabled,
          redoDisabled,
        });
      }
    }
  }

  undo() {
    const {getEditorState, setEditorState} = this.props;
    const newState = EditorState.undo(getEditorState());
    if (newState) {
      setEditorState(newState);
    }
  };

  redo() {
    const {getEditorState, setEditorState} = this.props;
    const newState = EditorState.redo(getEditorState());
    if (newState) {
      setEditorState(newState);
    }
  };

  render() {
    const {config} = this.props;
    const {
      undoDisabled,
      redoDisabled,
    } = this.state;
    const {options, undo, redo, className} = config;

    return (
      <div
        className={classNames('itd-history-wrapper', className)}
        aria-label="itd-history-control">
        {options.indexOf('undo') >= 0 && <Option
          hint="Отменить"
          value="unordered-list-item"
          onClick={() => this.undo()}
          className={classNames(undo.className)}
          disabled={undoDisabled}
        >
          {undo.icon}
        </Option>}
        {options.indexOf('redo') >= 0 && <Option
          hint="Вернуть"
          value="ordered-list-item"
          onClick={() => this.redo()}
          className={classNames(redo.className)}
          disabled={redoDisabled}
        >
          {redo.icon}
        </Option>}
      </div>
    );
  }

}

History.propTypes = {
  setEditorState: PropTypes.func.isRequired,
  getEditorState: PropTypes.func.isRequired,
  config: PropTypes.object,
};

export default History;