import React from 'react';
import {Entity, AtomicBlockUtils} from 'draft-js';
import DraftOffsetKey from 'draft-js/lib/DraftOffsetKey';
import Icon from '../../../../components/Icon';

export default class Toolbar extends React.Component {

  state = {
    position: {
      transform: 'scale(0)',
    }
  }

  componentDidMount() {
    this.props.store.subscribeToItem('editorState', this.onEditorStateChange);
  }

  componentWillUnmount() {
    this.props.store.unsubscribeFromItem('editorState', this.onEditorStateChange);
  }

  onEditorStateChange = (editorState) => {
    const {store} = this.props;
    const selection = editorState.getSelection();
    const getEditorRef = store.getItem('getEditorRef');
    const editor = getEditorRef();

    if (!selection.getHasFocus() || editor && (editor.props.readOnly || editor.props.isNested)) {
      this.setState({
        position: {
          transform: 'scale(0)',
        },
      });
      return;
    }

    const currentContent = editorState.getCurrentContent();
    const currentBlock = currentContent.getBlockForKey(selection.getStartKey());
    // TODO verify that always a key-0-0 exists
    const offsetKey = DraftOffsetKey.encode(currentBlock.getKey(), 0, 0);

    // Note: need to wait on tick to make sure the DOM node has been create by Draft.js
    setTimeout(() => {
      const node = document.querySelectorAll(`[data-offset-key="${offsetKey}"]`)[0];

      if (node) {
        const top = node.getBoundingClientRect().top;
        const editor = this.props.store.getItem('getEditorRef')().refs.editor;
        this.setState({
          position: {
            top: (top + window.scrollY),
            left: editor.getBoundingClientRect().left - 80,
            transform: 'scale(1)',
            transition: 'transform 0.15s cubic-bezier(.3,1.2,.2,1)',
          },
        });
      }
    }, 0);
  }

  addTextBlock() {
    const {store} = this.props;
    const getEditorState = store.getItem('getEditorState');
    const setEditorState = store.getItem('setEditorState');

    // console.log('addTextBlock', store.getItem('getEditorRef')().props.isNested);

    const entityKey = Entity.create(
      'block-text-block',
      'IMMUTABLE'
    );

    setEditorState(AtomicBlockUtils.insertAtomicBlock(
      getEditorState(),
      entityKey,
      ' '
    ), true)
  }

  render() {
    return (
      <div
        className="sidebar-wrapper tooltip-alternative-wrapper"
        style={this.state.position}
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <div className="tooltip">Управляемый блок</div>
        <div
          onClick={() => this.addTextBlock()}
          className={`sidebar-inner`}>
          <Icon kind="plus"/>
        </div>
      </div>
    );
  }
}
