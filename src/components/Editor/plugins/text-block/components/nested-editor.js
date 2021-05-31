import React, {Component} from 'react';
import reactDOM from 'react-dom'
import {EditorState, ContentState, convertFromRaw, convertToRaw} from 'draft-js';
import {createEditorStateWithText} from 'draft-js-plugins-editor'; // eslint-disable-line import/no-unresolved


export default (PluginEditor) => class NestedEditor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editorState: props.editorState
        ? EditorState.createWithContent(convertFromRaw(props.editorState))
        : EditorState.createEmpty()
    };
  }

  componentDidMount() {
    const DOMNode = reactDOM.findDOMNode(this.editor);

    DOMNode.addEventListener('mousedown', this.mouseDown, false);
    DOMNode.addEventListener('keydown', this.stopPropagation, false);
  }

  componentWillUnmount() {
    const DOMNode = reactDOM.findDOMNode(this.editor);

    DOMNode.addEventListener('mousedown', this.mouseDown, false);
    DOMNode.addEventListener('keydown', this.stopPropagation, false);
  }

  shouldComponentUpdate(props, state) {
    const nextContentState = state.editorState.getCurrentContent();
    const currentContentState = this.state.editorState.getCurrentContent();

    if (this.props.isFocused && this.props.isFocused !== props.isFocused) {
      this.startPropagation();
    }

    if (nextContentState !== currentContentState || this.props.isFocused !== props.isFocused) {
      return true;
    }

    return true;
  }

  startPropagation() {
    this.props.onChange(convertToRaw(this.state.editorState.getCurrentContent()));
  }

  onChange = (editorState) => {
    const {readOnly, onChange} = this.props;

    if (readOnly && this.state.editorState.getDecorator()) return;

    this.setState({editorState});

    onChange(convertToRaw(editorState.getCurrentContent()));
  }

  mouseDown = (event) => {
    const {readOnly, setFocus} = this.props;

    event.stopPropagation();

    if (readOnly === false) {
      return;
    }

    setFocus(event);
  }

  stopPropagation = (event) => {
    if (event.keyCode === 38) {
      event.stopPropagation();
    } else if (event.keyCode === 40) {
      event.stopPropagation();
    }
  }

  render() {
    const {editorState} = this.state;
    const {readOnly, plugins, onGetRef} = this.props;

    return (
      <PluginEditor
        {...this.props}
        plugins={plugins}
        flags={{test: true}}
        ref={(element) => {
          this.editor = element;

          onGetRef(element);
        }}
        isNested={true}
        editorState={editorState}
        onChange={editorState => this.onChange(editorState)}
        readOnly={readOnly}
      />
    );
  }
};
