/* @flow */

import PropTypes from 'prop-types';

import React, { Component } from 'react';
import {connect} from 'react-redux'
import {arrayInsert} from 'redux-form'
import {Entity, AtomicBlockUtils} from 'draft-js';
import {getSelectedBlock} from 'draftjs-utils';
import classNames from 'classnames';
import Option from '../../../../components/Option';
import Spinner from '../../../../components/Spinner';
import styles from './styles.css'; // eslint-disable-line no-unused-vars

class TaskControl extends Component {

  constructor(props) {
    super(props);

    this.state = {}
  }

  onOptionClick() {
    const {getEditorState, setEditorState, addTask} = this.props;
    const entityKey = Entity.create(
      'TASK',
      'IMMUTABLE',
      {}
    );
    const editorState = getEditorState();
    const contentState = editorState.getCurrentContent();
    const selectedBlock = getSelectedBlock(editorState);
    const blocksArray = contentState.getBlocksAsArray();

    let index = 0;

    for (let i = 0; i < blocksArray.length; i++) {
      const currentBlock = blocksArray[i];
      const entity = currentBlock.getEntityAt(0);
      const entityType = entity ? Entity.get(entity).getType() : null;

      if (currentBlock === selectedBlock) {
        break;
      } else if (entityType === 'TASK') {
        index++;
      }
    }

    const newEditorState = AtomicBlockUtils.insertAtomicBlock(
      editorState,
      entityKey,
      ' '
    );

    addTask(index);

    setEditorState(newEditorState);
  };

  stopPropagation(event) {
    event.preventDefault();
    event.stopPropagation();
  };

  render() {
    const {config} = this.props;
    const {icon, className} = config;

    return (
      <div
        onMouseDown={this.stopPropagation}
        className="itd-task-wrapper"
        aria-haspopup="false"
        aria-label="itd-task-control"
      >
        <Option
          hint="Вставить задание"
          className={classNames(className)}
          value="task2-item"
          onClick={() => this.onOptionClick()}
        >
          {icon}
        </Option>
      </div>
    );
  }
}

TaskControl.propTypes = {
  setEditorState: PropTypes.func.isRequired,
  getEditorState: PropTypes.func.isRequired,
  modalHandler: PropTypes.object,
  config: PropTypes.object,
};

export default connect(null, {
  addTask: (index) => arrayInsert('dayEditor', 'tasks', index, {})
})(TaskControl);