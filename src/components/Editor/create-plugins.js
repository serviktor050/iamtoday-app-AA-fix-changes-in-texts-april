// import React, {Component} from 'react';
// import Editor from 'draft-js-plugins-editor-wysiwyg';
// import createCleanupEmptyPlugin from 'draft-js-cleanup-empty-plugin';
// import createEntityPropsPlugin from 'draft-js-entity-props-plugin';
// import createFocusPlugin, {FocusDecorator} from 'draft-js-focus-plugin';
// import createInlineToolbarPlugin from 'draft-js-inline-toolbar-plugin'; // eslint-disable-line import/no-unresolved
// import createDndPlugin, {DraggableDecorator} from 'draft-js-dnd-plugin';
// import createToolbarPlugin, {ToolbarDecorator, ToolbarComponent} from './plugins/toolbar/index';
// import createAlignmentPlugin, {AlignmentDecorator} from 'draft-js-alignment-plugin';
// import createResizeablePlugin, {ResizeableDecorator} from 'draft-js-resizeable-plugin';
// // Blocks
// import createImagePlugin, {imageCreator, imageStyles} from 'draft-js-image-plugin';
// // import createTablePlugin from 'draft-js-table-plugin';
// import createTablePlugin, {tableCreator, tableStyles} from './plugins/table/index';
// const inlineToolbarPlugin = createInlineToolbarPlugin();
//
// // Styles
// import 'draft-js-alignment-plugin/lib/plugin.css';
// import 'draft-js-focus-plugin/lib/plugin.css';
// import 'draft-js-image-plugin/lib/plugin.css';
// import 'draft-js-table-plugin/lib/plugin.css';
// import 'draft-js-toolbar-plugin/lib/plugin.css';
//
// // Utils
// import addBlock from 'draft-js-dnd-plugin/lib/modifiers/addBlock';
//
// import Immutable from 'immutable';
// import {
//   AtomicBlockUtils,
//   EditorState,
//   Entity,
//   RichUtils,
//   convertFromRaw,
//   convertToRaw,
//   CompositeDecorator,
//   DefaultDraftBlockRenderMap,
//
//   Modifier,
//   CharacterMetadata,
//   ContentBlock,
//   BlockMapBuilder,
//   genKey
// } from 'draft-js';
// const {
//   List,
//   Repeat,
// } = Immutable;
//
// const image = ResizeableDecorator({
//   resizeSteps: 10,
//   handles: true,
//   vertical: 'auto'
// })(
//   DraggableDecorator(
//     FocusDecorator(
//       AlignmentDecorator(
//         ToolbarDecorator()(
//           imageCreator({theme: imageStyles})
//         )
//       )
//     )
//   )
// );
// const table = FocusDecorator(
//   DraggableDecorator(
//     // ToolbarDecorator()(
//     tableCreator({theme: tableStyles, Editor})
//     // )
//   )
// );
//
//
// var CustomBlockUtils = {
//   insertAtomicBlock: function insertAtomicBlock(editorState, type, data, entityKey) {
//     var contentState = editorState.getCurrentContent();
//     var selectionState = editorState.getSelection();
//
//     var afterRemoval = Modifier.removeRange(contentState, selectionState, 'backward');
//
//     var targetSelection = afterRemoval.getSelectionAfter();
//     var afterSplit = Modifier.splitBlock(afterRemoval, targetSelection);
//     var insertionTarget = afterSplit.getSelectionAfter();
//
//     var asAtomicBlock = Modifier.setBlockType(afterSplit, insertionTarget, type);
//
//     const charData = entityKey ? CharacterMetadata.create({entity: entityKey}) : null;
//
//     var newContentBlock = Object.assign({
//       key: genKey(),
//       type: type,
//       text: '',
//       data
//     }, charData ? {
//         characterList: List(Repeat(charData, 1))
//       } : {});
//
//     var fragmentArray = [new ContentBlock(newContentBlock), new ContentBlock({
//       key: genKey(),
//       type: 'unstyled',
//       text: '',
//       characterList: Immutable.List()
//     })];
//
//     var fragment = BlockMapBuilder.createFromArray(fragmentArray);
//
//     var withAtomicBlock = Modifier.replaceWithFragment(asAtomicBlock, insertionTarget, fragment);
//
//     var newContent = withAtomicBlock.merge({
//       selectionBefore: selectionState,
//       selectionAfter: withAtomicBlock.getSelectionAfter().set('hasFocus', true)
//     });
//
//     return EditorState.push(editorState, newContent, 'insert-fragment');
//   }
// };
//
// // Init Plugins
// export default ({
//   handleUpload,
//   handleDefaultData,
//   toolbar = {disableItems: [], textActions: []}
// }) => [
//   // inlineToolbarPlugin,
//   createCleanupEmptyPlugin({
//     types: ['block-image', 'block-table']
//   }),  
//   createEntityPropsPlugin({}),
//   createToolbarPlugin({
//     __toolbarHandler: {
//       add: props => console.log('Add toolbar', props),
//       remove: props => console.log('Remove toolbar', props),
//     },
//     textActions: [
//       ...[
//         {
//           button: <span>H1</span>,
//           key: 'H1',
//           label: 'Header 1',
//           active: (block, editorState) => block.get('type') === 'header-1',
//           toggle: (block, action, editorState, setEditorState) => {
//
//             console.log(convertToRaw(editorState.getCurrentContent()).blocks.length);
//             setEditorState(RichUtils.toggleBlockType(
//               editorState,
//               'header-1'
//             ))
//           },
//         },
//         {
//           button: <span>H2</span>,
//           key: 'H2',
//           label: 'Header 2',
//           active: (block, editorState) => block.get('type') === 'header-2',
//           toggle: (block, action, editorState, setEditorState) => setEditorState(RichUtils.toggleBlockType(
//             editorState,
//             'header-2'
//           )),
//         },
//         {
//           button: <span>H3</span>,
//           key: 'H3',
//           label: 'Header 3',
//           active: (block, editorState) => block.get('type') === 'header-3',
//           toggle: (block, action, editorState, setEditorState) => setEditorState(RichUtils.toggleBlockType(
//             editorState,
//             'header-3'
//           )),
//         },
//         {
//           button: <span>H4</span>,
//           key: 'H4',
//           label: 'Header 4',
//           active: (block, editorState) => block.get('type') === 'header-4',
//           toggle: (block, action, editorState, setEditorState) => setEditorState(RichUtils.toggleBlockType(
//             editorState,
//             'header-4'
//           )),
//         },
//         {
//           button: <span>H5</span>,
//           key: 'H5',
//           label: 'Header 5',
//           active: (block, editorState) => block.get('type') === 'header-4',
//           toggle: (block, action, editorState, setEditorState) => setEditorState(RichUtils.toggleBlockType(
//             editorState,
//             'header-5'
//           )),
//         },
//         {
//           button: <span>BLOCK</span>,
//           key: 'block-table',
//           label: 'BLOCK',
//           active: (block, editorState) => block.get('type') === 'header-4',
//           toggle: (block, action, editorState, setEditorState) => {
//             const entityKey = Entity.create(
//               'block-table',
//               'IMMUTABLE'
//             );
//
//             setEditorState(CustomBlockUtils.insertAtomicBlock(
//               editorState,
//               'block-table',
//               {},
//               entityKey,
//             ))
//           },
//         }
//       ].filter(toolbarItem => !toolbar.disableItems.includes(toolbarItem.key)),
//       ...toolbar.textActions
//     ]
//   }),
//   createFocusPlugin({}),
//   createAlignmentPlugin({}),
//   createDndPlugin({
//     allowDrop: true,
//     handleUpload,
//     handleDefaultData,
//     handlePlaceholder: (state, selection, data) => {
//       const {type} = data;
//       if (type.indexOf('image/') === 0) {
//         return 'block-image';
//       } else if (type.indexOf('text/') === 0 || type === 'application/json') {
//         return 'placeholder-github';
//       }
//       return undefined;
//     }, handleBlock: (state, selection, data) => {
//       const {type} = data;
//       if (type.indexOf('image/') === 0) {
//         return 'block-image';
//       } else if (type.indexOf('text/') === 0 || type === 'application/json') {
//         return 'block-text';
//       }
//       return undefined;
//     },
//   }),
//   createResizeablePlugin({}),
//   // Blocks
//   createImagePlugin({component: image}),
//   createTablePlugin({component: table, Editor}),
// ];
