/* @flow */

import PropTypes from 'prop-types';

import React, { Component } from 'react';
import {getSelectedBlocksType} from 'draftjs-utils';
import {RichUtils} from 'draft-js';
import classNames from 'classnames';
import Option from '../../../../components/Option';
import {Dropdown, DropdownOption} from '../../../../components/Dropdown';
import styles from './styles.css'; // eslint-disable-line no-unused-vars

class BlockType extends Component {

  constructor(props) {
    super(props);

    this.state = {
      currentBlockType: 'unstyled',
    };

    this.blocksTypes = [
      {label: 'Без стиля', style: 'unstyled'},
      {label: 'H1', style: 'header-one'},
      {label: 'H2', style: 'header-two'},
      {label: 'H3', style: 'header-three'},
      {label: 'H4', style: 'header-four'},
      {label: 'H5', style: 'header-five'},
      {label: 'H6', style: 'header-six'},
      {label: 'Blockquote', style: 'blockquote'},
    ];
  }

  componentWillMount() {
    const {getEditorState} = this.props;
    if (getEditorState) {
      this.setState({
        currentBlockType: getSelectedBlocksType(getEditorState()),
      });
    }
  }

  componentWillReceiveProps(properties) {

    if (properties.getEditorState) {
      const newBlockType = getSelectedBlocksType(properties.getEditorState());
      if (newBlockType !== this.state.currentBlockType) {
        this.setState({
          currentBlockType: newBlockType,
        });
      }
    }
  }

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

  renderFlat(blocks) {
    const {config: {className}} = this.props;
    const {currentBlockType} = this.state;

    return (
      <div className={classNames('itd-inline-wrapper', className)}>
        {
          blocks.map((block, index) =>
            <Option
              key={index}
              value={block.style}
              active={currentBlockType === block.style}
              onClick={() => this.toggleBlockType}
            >
              {block.label}
            </Option>
          )
        }
      </div>
    );
  }

  renderInDropdown(blocks) {
    const {currentBlockType} = this.state;
    const currentBlockData = blocks.filter(blk => blk.style === currentBlockType);
    const currentLabel = currentBlockData && currentBlockData[0] && currentBlockData[0].label;
    const {config: {className, dropdownClassName}, modalHandler} = this.props;
    return (
      <div className="itd-block-wrapper" aria-label="itd-block-control">
        <Dropdown
          hint="Тип блока"
          className={classNames('itd-block-dropdown', className)}
          optionWrapperClassName={classNames(dropdownClassName)}
          onChange={(value) => this.toggleBlockType(value)}
          modalHandler={modalHandler}
        >
          <span>{currentLabel || 'Блок'}</span>
          {
            blocks.map((block, index) =>
              <DropdownOption
                active={currentBlockType === block.style}
                value={block.style}
                key={index}
              >
                {block.label}
              </DropdownOption>)
          }
        </Dropdown>
      </div>
    );
  }

  render() {
    const {config} = this.props;
    const {inDropdown} = config;
    const blocks = this.blocksTypes.filter(({label}) => config.options.includes(label));
    return inDropdown ? this.renderInDropdown(blocks) : this.renderFlat(blocks);
  }
}

BlockType.propTypes = {
  getEditorState: PropTypes.func.isRequired,
  setEditorState: PropTypes.func.isRequired,
  modalHandler: PropTypes.object,
  config: PropTypes.object,
};

export default BlockType;