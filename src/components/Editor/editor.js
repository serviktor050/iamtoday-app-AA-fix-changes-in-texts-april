import React, {Component} from 'react';
import {
  AtomicBlockUtils,
  EditorState,
  Entity,
  RichUtils,
  convertFromRaw,
  convertToRaw,
  CompositeDecorator,
  DefaultDraftBlockRenderMap,
  Modifier,
  CharacterMetadata,
  ContentBlock,
  BlockMapBuilder,
  genKey
} from 'draft-js';
import {
  getCustomStyleMap,
} from 'draftjs-utils';

import Editor, {createEditorStateWithText} from 'draft-js-plugins-editor'; // eslint-disable-line import/no-unresolved
import createEntityPropsPlugin from 'draft-js-entity-props-plugin';
import createSidebarPlugin from './plugins/sidebar'; // eslint-disable-line import/no-unresolved
import createToolbarPlugin from './plugins/toolbar'; // eslint-disable-line import/no-unresolved
import createTextBlockPlugin, {textBlockCreator} from './plugins/text-block/index';
import createFocusPlugin from './plugins/focus';
import createImagePlugin from './plugins/image';
import createLinkPlugin from './plugins/link';
import createTaskPlugin from './plugins/task';
import createEmbeddedPlugin from './plugins/embedded';
import createYoutubePlugin from './plugins/youtube';
import blockStyleFn from './plugins/toolbar/utils/BlockStyle';


import {StickyContainer, Sticky} from 'react-sticky';

import {
  Map
} from 'immutable';

import './styles.css';
import './Draft.css';

const focusPlugin = createFocusPlugin({});
const entityPropsPlugin = createEntityPropsPlugin({});
const textBlock = textBlockCreator({theme: {}, Editor});
const sidebarPlugin = createSidebarPlugin({});
const embeddedPlugin = createEmbeddedPlugin({});
const youtubePlugin = createYoutubePlugin({});
const linkPlugin = createLinkPlugin({});
const taskPlugin = createTaskPlugin({decorator: focusPlugin.decorator});
const imagePlugin = createImagePlugin({decorator: focusPlugin.decorator});

const plugins = [
  focusPlugin,
  entityPropsPlugin,
  imagePlugin,
  linkPlugin,
  youtubePlugin,
  embeddedPlugin,
  taskPlugin,
  sidebarPlugin
];

const editorStyles = {};

const {SideToolbar} = sidebarPlugin;

export default class SimpleInlineToolbarEditor extends Component {

  constructor(props) {
    super(props);

    this.blockRenderMap = DefaultDraftBlockRenderMap.merge(
      this.customBlockRendering(props)
    );

    const {uploadCallback} = props;
    const toolbarPlugin = createToolbarPlugin({uploadCallback});
    const textBlockPlugin = createTextBlockPlugin({
      Editor,
      component: textBlock,
      decorator: focusPlugin.decorator,
      plugins: [
        focusPlugin,
        entityPropsPlugin,
        sidebarPlugin,
        toolbarPlugin,
        linkPlugin,
        imagePlugin,
      ]
    });

    this.state = {
      toolbarPlugin,
      pluginsList: [
        ...plugins,
        toolbarPlugin,
        textBlockPlugin,
      ],
      editorState: props.editorState
        ? EditorState.push(EditorState.createEmpty(), convertFromRaw(props.editorState))
        : EditorState.createEmpty()
    };
  }

  componentWillReceiveProps(props) {
    if (this.props.editorState !== props.editorState) {
      const newState = props.editorState
        ? EditorState.push(EditorState.createEmpty(), convertFromRaw(props.editorState))
        : EditorState.createEmpty()

      this.onChange(newState)
    }
  }

  onChange = (editorState, focus) => {
    if (this.unmounted) return;

    const { onChange } = this.props;

    if (onChange) {
      onChange(convertToRaw(editorState.getCurrentContent()));
    }

    this.setState({editorState, lastUpdate: Date.now()});

    if (focus) {
      this.focus()
    }
  };

  focus = () => {
    const {toolbarPlugin} = this.state;

    toolbarPlugin.modalHandler.onEditorClick();

    this.editor.setReadOnly(false);

    this.setState({lastUpdate: Date.now()});

    setTimeout(() => this.editor.focus());
  };

  customBlockRendering = props => {
    const {blockTypes} = props;

    var newObj = {
      'paragraph': {
        element: 'div',
      },
      'unstyled': {
        element: 'div',
      },
      'block-image': {
        element: 'div',
      },
      'block-text-block': {
        element: 'div',
      }
    };

    for (var key in blockTypes) {
      newObj[key] = {
        element: 'div'
      };
    }

    return Map(newObj);
  };

  blockRendererFn = contentBlock => {
    const {blockTypes} = this.props;
    const type = contentBlock.getType();
    return blockTypes && blockTypes[type] ? {
        component: blockTypes[type]
      } : undefined;
  };

  render() {
    const {editorState, toolbarPlugin = {}, pluginsList = []} = this.state;
    const {
      readOnly,
      isPresentation = false,
      flags = {},
      toolbarOffset = 0,
      toolbarStartOffset = 0,
      placeholder = 'Начать',
    } = this.props;
    const customStyleMap = getCustomStyleMap();
    const {InlineToolbar} = toolbarPlugin;

    return (
      <StickyContainer style={{width: '100%'}}>
        {
          !isPresentation ? <Sticky
              stickyStyle={{top: toolbarOffset}}
              style={{position: 'relative', zIndex: 1000}}
              topOffset={toolbarStartOffset}>
              <InlineToolbar />
            </Sticky> : null
        }

        <div className={editorStyles.editor} onClick={() => {
          this.focus();
        }}>
          <Editor
            placeholder={placeholder}
            editorState={editorState}
            flags={flags}
            onChange={(state) => this.onChange(state)}
            plugins={pluginsList}
            isPresentation={isPresentation}
            readOnly={readOnly || isPresentation}
            customStyleMap={{
              ...customStyleMap,
              UPPERCASE: {textTransform: 'uppercase'}
            }}
            blockStyleFn={blockStyleFn}
            blockRenderMap={this.blockRenderMap}
            blockRendererFn={this.blockRendererFn}
            ref={(element) => {
              this.editor = element;
            }}
          />

          { !isPresentation ? <SideToolbar /> : null }
        </div>
      </StickyContainer>
    );
  }
}
