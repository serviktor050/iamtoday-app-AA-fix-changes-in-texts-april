/* @flow */

import PropTypes from 'prop-types';

import React, { Component } from 'react';
import {getSelectedBlocksMetadata} from 'draftjs-utils';
import {setBlockData} from '../../utils/setBlockData';
import classNames from 'classnames';
import Option from '../../../../components/Option';
import {Dropdown, DropdownOption} from '../../../../components/Dropdown';
import {getFirstIcon} from '../../utils/toolbar';
import styles from './styles.css'; // eslint-disable-line no-unused-vars

class TextAlign extends Component {

  constructor(props) {
    super(props);

    this.state = {
      currentTextAlignment: undefined,
    }
  }

  componentWillReceiveProps(properties) {
    if (properties.getEditorState) {
      const newTextAlignment = getSelectedBlocksMetadata(properties.getEditorState()).get('text-align');
      if (newTextAlignment !== this.state.currentTextAlignment) {
        this.setState({
          currentTextAlignment: newTextAlignment,
        });
      }
    }
  }

  addBlockAlignmentData(value) {
    const {getEditorState, setEditorState} = this.props;
    const {currentTextAlignment} = this.state;
    if (currentTextAlignment !== value) {
      setEditorState(setBlockData(getEditorState(), {'text-align': value}));
    } else {
      setEditorState(setBlockData(getEditorState(), {'text-align': undefined}));
    }
  }

  renderInFlatList(config) {
    const {currentTextAlignment} = this.state;
    const {options, left, center, right, justify, className} = config;
    return (
      <div className={classNames('itd-text-align-wrapper', className)} aria-label="itd-textalign-control">
        {options.indexOf('left') >= 0 && <Option
          hint="Выравнивание по левому краю"
          value="left"
          className={classNames(left.className)}
          active={currentTextAlignment === 'left'}
          onClick={(value) => this.addBlockAlignmentData(value)}
        >
          {left.icon}
        </Option>}
        {options.indexOf('center') >= 0 && <Option
          hint="Выравнивание по центру"
          value="center"
          className={classNames(center.className)}
          active={currentTextAlignment === 'center'}
          onClick={(value) => this.addBlockAlignmentData(value)}
        >
          {center.icon}
        </Option>}
        {options.indexOf('right') >= 0 && <Option
          hint="Выравнивание по правому краю"
          value="right"
          className={classNames(right.className)}
          active={currentTextAlignment === 'right'}
          onClick={(value) => this.addBlockAlignmentData(value)}
        >
          {right.icon}
        </Option>}
        {options.indexOf('justify') >= 0 && <Option
          hint="Выравнивание по краям"
          value="justify"
          className={classNames(justify.className)}
          active={currentTextAlignment === 'justify'}
          onClick={(value) => this.addBlockAlignmentData(value)}
        >
          {justify.icon}
        </Option>}
      </div>
    );
  }

  renderInDropDown(config) {
    const {currentTextAlignment} = this.state;
    const {options, left, center, right, justify, className} = config;
    const {modalHandler} = this.props;
    return (
      <Dropdown
        className={classNames('itd-text-align-dropdown', className)}
        onChange={(value) => this.addBlockAlignmentData(value)}
        modalHandler={modalHandler}
        aria-label="itd-textalign-control"
      >
        <img
          src={getFirstIcon(config)}
          role="presentation"
        />
        {options.indexOf('left') >= 0 && <DropdownOption
          value="left"
          active={currentTextAlignment === 'left'}
          className={classNames('itd-text-align-dropdownOption', left.className)}
        >
          <img
            src={left.icon}
            role="presentation"
          />
        </DropdownOption>}
        {options.indexOf('center') >= 0 && <DropdownOption
          value="center"
          active={currentTextAlignment === 'center'}
          className={classNames('itd-text-align-dropdownOption', center.className)}
        >
          <img
            src={center.icon}
            role="presentation"
          />
        </DropdownOption>}
        {options.indexOf('right') >= 0 && <DropdownOption
          value="right"
          active={currentTextAlignment === 'right'}
          className={classNames('itd-text-align-dropdownOption', right.className)}
        >
          <img
            src={right.icon}
            role="presentation"
          />
        </DropdownOption>}
        {options.indexOf('justify') >= 0 && <DropdownOption
          value="justify"
          active={currentTextAlignment === 'justify'}
          className={classNames('itd-text-align-dropdownOption', justify.className)}
        >
          <img
            src={justify.icon}
            role="presentation"
          />
        </DropdownOption>}
      </Dropdown>
    );
  }

  render() {
    const {config} = this.props;
    if (config.inDropdown) {
      return this.renderInDropDown(config);
    }
    return this.renderInFlatList(config);
  }
}


TextAlign.propTypes = {
  getEditorState: PropTypes.func.isRequired,
  setEditorState: PropTypes.func.isRequired,
  modalHandler: PropTypes.object,
  config: PropTypes.object,
};

export default TextAlign;