import decorateComponentWithProps from 'decorate-component-with-props';
import createStore from './utils/createStore';
import Toolbar from './components/Toolbar';
import toolbarStyles from './toolbarStyles.css';

export default (config = {}) => {
  const store = createStore({
    isVisible: false,
  });

  const toolbarProps = {
    store
  };

  return {
    initialize: ({ setEditorState, getEditorState, getEditorRef, getReadOnly }) => {
      const editor = getEditorRef();

      if (editor && !editor.props.isNested) {
        store.updateItem('getReadOnly', getReadOnly);
        store.updateItem('getEditorState', getEditorState);
        store.updateItem('setEditorState', setEditorState);
      }

      store.updateItem('getEditorRef', getEditorRef);
    },

    // Re-Render the toolbar on every
    onChange: (editorState, { setEditorState, getEditorState, getEditorRef, getReadOnly }) => {
      const editor = getEditorRef();

      if (editor && !editor.props.isNested) {
        store.updateItem('editorState', editorState);
        store.updateItem('getReadOnly', getReadOnly);
        store.updateItem('getEditorState', getEditorState);
        store.updateItem('setEditorState', setEditorState);
      }

      store.updateItem('getEditorRef', getEditorRef);

      return editorState;
    },
    SideToolbar: decorateComponentWithProps(Toolbar, toolbarProps),
  };
};
