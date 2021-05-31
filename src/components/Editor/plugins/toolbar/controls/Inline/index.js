/* @flow */

import PropTypes from 'prop-types';

import React, { Component } from 'react';
import {getSelectionInlineStyle, toggleCustomInlineStyle} from 'draftjs-utils';
import {RichUtils, EditorState, Modifier} from 'draft-js';
import classNames from 'classnames';
import Option from '../../../../components/Option';
import {Dropdown, DropdownOption} from '../../../../components/Dropdown';

import styles from './styles.css'; // eslint-disable-line no-unused-vars

class Inline extends Component {

  constructor(props) {
    super(props);

    this.state = {
      currentStyles: {},
    };
  }

  componentWillMount() {
    const {editorState} = this.props;
    if (editorState) {
      this.setState({
        currentStyles: getSelectionInlineStyle(editorState),
      });
    }
  }

  componentWillReceiveProps(properties) {
    if (properties.editorState &&
      this.props.editorState !== properties.editorState) {
      this.setState({
        currentStyles: getSelectionInlineStyle(properties.editorState),
      });
    }
  }

  toggleInlineStyle(style) {
    const newStyle = style === 'MONOSPACE' ? 'CODE' : style;
    const {getEditorState, setEditorState} = this.props;
    const editorState = getEditorState();

    let newState = RichUtils.toggleInlineStyle(editorState, newStyle);
    if (newStyle === 'SUBSCRIPT' || newStyle === 'SUPERSCRIPT') {
      const removeStyle = newStyle === 'SUBSCRIPT' ? 'SUPERSCRIPT' : 'SUBSCRIPT';
      const contentState = Modifier.removeInlineStyle(
        newState.getCurrentContent(),
        newState.getSelection(),
        removeStyle
      );
      newState = EditorState.push(newState, contentState, 'change-inline-style');
    }
    if (newState) {
      setEditorState(newState);
    }
  };

  renderInFlatList(currentStyles, config) {
    return (
      <div
        className={classNames('itd-inline-wrapper', config.className)}
        aria-label="itd-inline-control">
        {
          Object.keys(config.options)
            .map((style, index) => {
              const hint = config.options[style];

              return <Option
                key={index}
                hint={hint}
                value={style.toUpperCase()}
                onClick={() => this.toggleInlineStyle(style.toUpperCase())}
                className={classNames(config[style].className)}
                active={
                  currentStyles[style.toUpperCase()] === true ||
                  (style.toUpperCase() === 'MONOSPACE' && currentStyles['CODE'])
                }
              >
                {config[style].icon}
              </Option>
            })
        }
      </div>
    );
  }

  render() {
    const {config} = this.props;
    const {currentStyles} = this.state;

    return this.renderInFlatList(currentStyles, config);
  }
}

Inline.propTypes = {
  setEditorState: PropTypes.func.isRequired,
  getEditorState: PropTypes.func.isRequired,
  modalHandler: PropTypes.object,
  config: PropTypes.object,
};

export default Inline;

// todo: move all controls to separate folder controls
// make subscript less low
