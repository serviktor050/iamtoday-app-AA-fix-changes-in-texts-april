import {
  getCustomStyleMap,
  getSelectedBlocksMap
} from 'draftjs-utils';

import {
  Modifier,
  RichUtils,
  EditorState
} from 'draft-js';

/**
 * Function will add block level meta-data.
 */
export function setBlockData(editorState, data) {
  const newContentState = Modifier.setBlockData(
    editorState.getCurrentContent(),
    editorState.getSelection(),
    data);
  return EditorState.push(editorState, newContentState, 'change-block-data');
}