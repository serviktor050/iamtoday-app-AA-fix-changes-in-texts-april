import React from 'react';
import TextBlock from './components/text-block';
import nestedEditorCreator from './components/nested-editor';
import styles from './style.css';
import {Entity} from 'draft-js';

const defaultTheme = {
  ...styles,
};

const createRenderer = (Editor) => {
  const NestedEditor = nestedEditorCreator(Editor);
  return (params) => {
    let {block, editorState, onChange, setFocus, active, plugins, isPresentation, onGetRef} = params;
    let {pluginEditor} = block.props.blockProps;

    return (
      <NestedEditor
        {...pluginEditor.getProps()}
        plugins={plugins}
        onGetRef={onGetRef}
        setFocus={setFocus}
        isFocused={block.props.blockProps.isFocused}
        setReadOnly={(value) => pluginEditor.setReadOnly(value)}
        readOnly={!active || isPresentation}
        editorState={editorState}
        onChange={onChange}/>
    );
  };
};

const textBlockPlugin = (config = {}) => {
  const type = config.type || 'block-text-block';
  const theme = config.theme ? config.theme : defaultTheme;
  const Editor = config.Editor;

  const plugins = config.plugins || [];
  const decorator = config.decorator || (component => component);
  const renderNestedEditor = createRenderer(Editor);

  const component = decorator(config.component || TextBlock({theme}));

  return {
    blockRendererFn: (contentBlock, pluginEditor) => {
      const entityKey = contentBlock.getEntityAt(0);
      const entityInstance = entityKey ? Entity.get(entityKey) : null;

      if (entityInstance && entityInstance.type === type) {
        return {
          component,
          props: {
            plugins,
            pluginEditor,
            getProps: pluginEditor.getProps,
            setReadOnly: pluginEditor.setReadOnly,
            renderNestedEditor
          }
        };
      }
    }
  };
};

export default textBlockPlugin;
export const textBlockCreator = TextBlock;
export const textBlockStyles = styles;
