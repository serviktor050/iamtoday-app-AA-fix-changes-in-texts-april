import {
  getCustomStyleMap
} from 'draftjs-utils';

import {
  Modifier,
  RichUtils,
  EditorState
} from 'draft-js';

export default function toggleCustomInlineStyle(
  editorState,
  styleType,
  style,
) {
  const selection = editorState.getSelection();
  const customStyleMap = getCustomStyleMap();
  const nextContentState = Object.keys(customStyleMap[styleType] || {})
    .reduce((contentState, s) => Modifier.removeInlineStyle(contentState, selection, s),
      editorState.getCurrentContent());
  let nextEditorState = EditorState.push(
    editorState,
    nextContentState,
    'changeinline-style',
  );
  const currentStyle = editorState.getCurrentInlineStyle();
  if (selection.isCollapsed()) {
    nextEditorState = currentStyle
      .reduce((state, s) => RichUtils.toggleInlineStyle(state, s),
        nextEditorState);
  }
  if (!currentStyle.has(style)) {
    nextEditorState = RichUtils.toggleInlineStyle(
      nextEditorState,
      style,
    );
  }
  return nextEditorState;
}