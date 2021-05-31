import React, {Component} from 'react';

import Icon from '../../../components/Icon';

const TextBlockComponent = ({theme}) => class TextBlock extends Component {
  constructor(props) {
    super();
    const {blockProps} = props;
    const {entityData} = blockProps;
    const {editorState = null, visibility = true} = entityData;

    this.state = {
      visibility,
      localState: editorState,
      focusedEdit: null
    };

    this.setFocus = this.setFocus.bind(this);
  }

  componentDidMount() {

  }

  setFocus(event) {
    event && event.stopPropagation();

    const {blockProps} = this.props;
    const {isFocused, setFocusToBlock, setReadOnly} = blockProps;

    if (!isFocused) {
      setReadOnly(true);
      setFocusToBlock();
    }

    setTimeout(() => this.editor.focus(), 0)
  }

  updateEntityData = (rawEditorState) => {
    const {visibility} = this.state;
    const {setEntityData} = this.props.blockProps;

    setEntityData({editorState: rawEditorState});

    this.setState({localState: rawEditorState});
  }

  toggleVisibility() {
    const visibility = !this.state.visibility;
    const {setEntityData} = this.props.blockProps;

    setEntityData({visibility});

    this.setState({visibility});
  }

  isBlockEmpty(block) {
    return !block || !block.text && block.type !== 'atomic'
  }

  render() {
    const {localState, visibility} = this.state;
    const {blockProps, block} = this.props;
    const {isFocused, plugins, renderNestedEditor, getProps} = blockProps;
    const {isPresentation, flags, editorState} = getProps();
    const isVisible = flags.showHidden || visibility;
    // Check is current block really last and remove bottom line
    const contentState = editorState.getCurrentContent();
    const nextBlock = contentState.getBlockAfter(block.key);
    const lastBlock = contentState.getLastBlock();

    const isCurrentBlockLast = nextBlock && lastBlock
      ? nextBlock.key === lastBlock.key && this.isBlockEmpty(nextBlock)
      : false

    if (isPresentation && (!localState || !isVisible)) {
      return null;
    }

    const focusedClass = isFocused && !isPresentation ? 'nested-editor-container__focused' : '';
    const lastBlockClass = isCurrentBlockLast ? 'nested-editor-container__last' : '';

    const Editor = renderNestedEditor({
      block: this,
      plugins,
      editorState: localState,
      onChange: (editorState) => this.updateEntityData(editorState),
      setFocus: this.setFocus,
      active: isFocused,
      onGetRef: (element) => {
        this.editor = element;
      },
      isPresentation
    });

    return (
      <div
        onClick={this.setFocus}
        contentEditable={false}
        suppressContentEditableWarning={true}
        data-visibility={visibility}
        className={`nested-editor-container ${focusedClass} ${lastBlockClass}`}>
        {
          !isPresentation ? <div
            onClick={(e) => {
              e.stopPropagation();

              this.toggleVisibility();
            }}
            className="nested-editor-container__visibility">
            <Icon
              kind={visibility ? 'visible' : 'hidden'}/>
          </div> : null
        }

        { Editor }
      </div>
    );
  }
};

export default TextBlockComponent;