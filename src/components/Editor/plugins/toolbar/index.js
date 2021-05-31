import React from 'react';
import decorateComponentWithProps from 'decorate-component-with-props';
import {convertToRaw} from 'draft-js';

import ModalHandler from './event-handler/modals';

import createStore from './utils/createStore';
import Toolbar from './components/Toolbar';
import Separator from './components/Separator';

import buttonStyles from './buttonStyles.css';
import toolbarStyles from './toolbarStyles.css';

import defaultConfig from './config/defaultToolbar';
import controls from './controls/index';
import {setFontFamilies, setFontSizes, setColors} from 'draftjs-utils';

setFontFamilies(defaultConfig.fontFamily && defaultConfig.fontFamily.options);
setFontSizes(defaultConfig.fontSize && defaultConfig.fontSize.options);
setColors(defaultConfig.colorPicker && defaultConfig.colorPicker.colors);

export default (config = {}) => {
  const defaultTheme = {buttonStyles, toolbarStyles};

  const store = createStore({
    isVisible: false,
  });

  const modalHandler = new ModalHandler();

  const {theme = defaultTheme, uploadCallback} = config;
  const structure = defaultConfig.options.map((opt, index) => {
    const Control = controls[opt];
    const config = defaultConfig[opt];

    if (opt === 'image' && uploadCallback) {
      config.uploadCallback = uploadCallback;
    }

    return decorateComponentWithProps(Control, {key: index, config, modalHandler});
  });

  const toolbarProps = {
    store,
    structure,
    theme,
  };

  return {
    initialize: ({getEditorState, setEditorState}) => {
      store.updateItem('getEditorState', getEditorState);
      store.updateItem('setEditorState', setEditorState);
    },
    // Re-Render the text-toolbar on selection change
    onChange(editorState, {getEditorState, setEditorState}) {
      store.updateItem('getEditorState', getEditorState);
      store.updateItem('setEditorState', setEditorState);

      return editorState;
    },
    InlineToolbar: decorateComponentWithProps(Toolbar, toolbarProps),
    modalHandler
  };
};

export {
  Separator,
};
