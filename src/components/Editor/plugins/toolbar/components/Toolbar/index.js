import React from 'react';
import {Entity} from 'draft-js';

export default class Toolbar extends React.Component {

  render() {
    const {theme, store} = this.props;
    const getEditorRef = store.getItem('getEditorRef');
    const getEditorState = store.getItem('getEditorState');
    const setEditorState = store.getItem('setEditorState');

    return (
      <div className={`toolbar`}>
        {getEditorState && this.props.structure.map((Component, index) => (
          <Component
            key={index}
            theme={theme.buttonStyles}
            getEditorRef={() => store.getItem('getEditorRef')()}
            getEditorState={() => store.getItem('getEditorState')()}
            setEditorState={(state) => store.getItem('setEditorState')(state)}
          />
        ))}
      </div>
    );
  }
}
