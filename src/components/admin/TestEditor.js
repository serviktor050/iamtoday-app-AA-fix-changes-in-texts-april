import React from 'react'
import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

const TestEditor = () => (<Editor
  toolbarClassName="home-toolbar"
  wrapperClassName="home-wrapper"
  editorClassName="home-editor"
  placeholder="Вставьте текст..."
  // onChange={(editorContent) => {
  //   const { dispatch } = this.props
  //   dispatch({ type: 'CONTENT', content: editorContent, index: 0 })
  //   dispatch({ type: 'DAY_INTRO', intro: draftToHtml(editorContent), index: 0 })
  // }}
  // uploadCallback={this.uploadImageCallBack}
/>)

export default TestEditor
