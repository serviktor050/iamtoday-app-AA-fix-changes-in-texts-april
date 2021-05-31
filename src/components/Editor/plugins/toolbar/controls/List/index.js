/* @flow */

import PropTypes from 'prop-types';

import React, { Component } from 'react';
import {RichUtils} from 'draft-js';
import {getSelectedBlocksType} from 'draftjs-utils';
import {changeDepth} from '../../utils/changeDepth';
import classNames from 'classnames';
import {getFirstIcon} from '../../utils/toolbar';
import {Dropdown, DropdownOption} from '../../../../components/Dropdown';
import Option from '../../../../components/Option';
import styles from './styles.css'; // eslint-disable-line no-unused-vars

class List extends Component {

  constructor(props) {
    super(props);

    this.state = {
      currentBlockType: 'unstyled',
    };

    this.options = [
      {type: 'unordered', value: 'unordered-list-item'},
      {type: 'ordered', value: 'ordered-list-item'},
      {type: 'indent', value: 'indent'},
      {type: 'outdent', value: 'outdent'}
    ];
  }

  componentWillMount() {
    const {editorState} = this.props;
    if (editorState) {
      this.setState({
        currentBlockType: getSelectedBlocksType(editorState),
      });
    }
  }

  componentWillReceiveProps(properties) {
    if (properties.getEditorState) {
      const newBlockType = getSelectedBlocksType(properties.getEditorState());

      if (this.state.currentBlockType !== newBlockType) {
        this.setState({
          currentBlockType: newBlockType,
        });
      }
    }
  }

  onDropdownChange(value) {
    if (value === 'unordered-list-item' || value === 'ordered-list-item') {
      this.toggleBlockType(value);
    } else if (value === 'indent') {
      this.indent();
    } else {
      this.outdent();
    }
  };

  toggleBlockType(blockType) {
    const {getEditorState, setEditorState} = this.props;
    const newState = RichUtils.toggleBlockType(
      getEditorState(),
      blockType
    );
    if (newState) {
      setEditorState(newState);
    }
  };

  adjustDepth(adjustment) {
    const {getEditorState, setEditorState} = this.props;
    const newState = changeDepth(
      getEditorState(),
      adjustment,
      4,
    );
    if (newState) {
      setEditorState(newState);
    }
  };

  indent() {
    this.adjustDepth(1);
  };

  outdent() {
    this.adjustDepth(-1);
  };

  // todo: evaluate refactoring this code to put a loop there and in other places also in code
  // hint: it will require moving click handlers
  renderInFlatList(currentBlockType, config) {
    const {options, unordered, ordered, indent, outdent, className} = config;
    return (
      <div className={classNames('itd-list-wrapper', className)} aria-label="itd-list-control">
        {options.indexOf('unordered') >= 0 && <Option
          hint="Список"
          value="unordered-list-item"
          onClick={(type) => this.toggleBlockType(type)}
          className={classNames(unordered.className)}
          active={currentBlockType === 'unordered-list-item'}
        >
          {unordered.icon}
        </Option>}
        {options.indexOf('ordered') >= 0 && <Option
          hint="Упорядоченный писок"
          value="ordered-list-item"
          onClick={(type) => this.toggleBlockType(type)}
          className={classNames(ordered.className)}
          active={currentBlockType === 'ordered-list-item'}
        >
          {ordered.icon}
        </Option>}
        {options.indexOf('indent') >= 0 && <Option
          hint="Увеличить вложенность"
          onClick={() => this.indent()}
          className={classNames(indent.className)}
        >
          {indent.icon}
        </Option>}
        {options.indexOf('outdent') >= 0 && <Option
          hint="Уменьшить вложенность"
          onClick={() => this.outdent()}
          className={classNames(outdent.className)}
        >
          {outdent.icon}
        </Option>}
      </div>
    );
  }

  renderInDropDown(currentBlockType, config) {
    const {options, className} = config;
    const {modalHandler} = this.props;
    return (
      <Dropdown
        className={classNames('itd-list-dropdown', className)}
        onChange={(value) => this.onDropdownChange(value)}
        modalHandler={modalHandler}
        aria-label="itd-list-control"
      >
        <img
          src={getFirstIcon(config)}
          role="presentation"
        />
        { this.options
          .filter(option => options.indexOf(option.type) >= 0)
          .map((option, index) => (<DropdownOption
            key={index}
            value={option.value}
            className={classNames('itd-list-dropdownOption', config[option.type].className)}
            active={currentBlockType === option.value}
          >
            {config[option.type].icon}
            {/*<img*/}
            {/*src={config[option.type].icon}*/}
            {/*role="presentation"*/}
            {/*/>*/}
          </DropdownOption>))
        }
      </Dropdown>
    );
  }

  render() {
    const {config} = this.props;
    const {currentBlockType} = this.state;
    if (config.inDropdown) {
      return this.renderInDropDown(currentBlockType, config);
    }
    return this.renderInFlatList(currentBlockType, config);
  }
}

List.propTypes = {
  getEditorState: PropTypes.func.isRequired,
  setEditorState: PropTypes.func.isRequired,
  modalHandler: PropTypes.object,
  config: PropTypes.object,
};

export default List;
