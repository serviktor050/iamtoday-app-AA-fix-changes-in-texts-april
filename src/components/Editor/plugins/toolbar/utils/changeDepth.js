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
 * Function to change depth of block(s).
 */
export function changeBlocksDepth(
  editorState,
  adjustment,
  maxDepth,
) {
  const selectionState = editorState.getSelection();
  const contentState = editorState.getCurrentContent();
  let blockMap = contentState.getBlockMap();
  const blocks = getSelectedBlocksMap(editorState).map((block) => {
    let depth = block.getDepth() + adjustment;
    depth = Math.max(0, Math.min(depth, maxDepth));
    return block.set('depth', depth);
  });
  blockMap = blockMap.merge(blocks);
  return contentState.merge({
    blockMap,
    selectionBefore: selectionState,
    selectionAfter: selectionState,
  });
}

export function changeDepth(
  editorState,
  adjustment,
  maxDepth,
) {
  const selection = editorState.getSelection();
  let key;
  if (selection.getIsBackward()) {
    key = selection.getFocusKey();
  } else {
    key = selection.getAnchorKey();
  }
  const content = editorState.getCurrentContent();
  const block = content.getBlockForKey(key);
  const type = block.getType();
  if (type !== 'unordered-list-item' && type !== 'ordered-list-item') {
    return editorState;
  }
  const blockAbove = content.getBlockBefore(key);
  if (!blockAbove) {
    return editorState;
  }
  const typeAbove = blockAbove.getType();
  if (typeAbove !== type) {
    return editorState;
  }
  const depth = block.getDepth();
  if (adjustment === 1 && depth === maxDepth) {
    return editorState;
  }
  const adjustedMaxDepth = Math.min(blockAbove.getDepth() + 1, maxDepth);
  const withAdjustment = changeBlocksDepth(
    editorState,
    adjustment,
    adjustedMaxDepth,
  );
  return EditorState.push(
    editorState,
    withAdjustment,
    'adjust-depth',
  );
}