import React from 'react';
import CSSModules from 'react-css-modules';
import styles from './fieldFileInput.css';
import cookie from 'react-cookie';
import {api} from '../../config.js'
import { dict } from 'dict';
import classNames from 'classnames';

const style = {
  color: '#f97b7c',
  fontSize: '12px',
  position: 'absolute',
  left: '0',
  bottom: '-18px'
}
class FieldFileInput  extends React.Component {
  constructor(props) {
    super(props)
    this.onChange = this.onChange.bind(this)
    this.state = {
      file: null,
      customName: ''
    }
  }

  componentDidMount(){
    const { input } = this.props;
    if (input.value.documentName) {
      this.setState({
        customName: input.value.documentName
      })
    }
  }

  onChange(event) {
    const { input: { onChange }, customName } = this.props

    const name = event.target.files.length ?  event.target.files[0].name : '';
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader()

      reader.onload = (e) => {

        const content = reader.result.replace(/data:image\/\w+;base64,/, '');
        const payload = {
          authToken: cookie.load('token'),
          data: {
            name,
            content
          }
        };
        this.setState({
          file: name
        });

        const headers = {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        };

        fetch(`${api}/data/photo-file-upload`, {
          headers,
          method: 'POST',
          body: JSON.stringify(payload)
        })
          .then(response => response.json())
          .then(json => {

            if (json.errorCode !== 1) {
              return;
            }
            let payload = {
              fileId: json.data.uid,
              url: `${api}/files/${json.data.uid}.${json.data.extension}`.replace(/api\//, ''),
              documentName: customName || this.state.customName
            };
            onChange(payload)
          })
          .catch(err => {
            console.log(err)
          })

      }
      reader.readAsDataURL(event.target.files[0])
    }
  }

  onChangeName = (e) => {
    this.setState({
      customName:e.target.value
    })
  }

  render(){
    const {input, label, disabled, required, lang, customName, placeholder, custom,  meta: { touched, error }  } = this.props;  //whatever props you send to the component from redux-form Field

    return(
      <div className={styles.inputFile}>
        <div className={classNames(styles.inputName, {
          [styles.inputNameShow]: this.state.customName,
        })}>{placeholder}</div>
        <label className={styles.inputFileLabel}>{label}</label>
        <input
          ref="inputFile"
          type='file'
          accept='.jpg, .png, .jpeg'
          onChange={this.onChange}
          className={styles.inputFileOld}
        />
       <div
         className={touched && error ? styles.inputFileNewError : styles.inputFileNew}
       >
         <input
           className={styles.inputCustom}
           type="text"
           disabled={disabled}
           placeholder={placeholder}
           value={this.state.customName}
           onChange={this.onChangeName}
         />

         <button
           type='button'
           disabled={!customName && !this.state.customName}
           className={input.value.fileId || this.state.file ? styles.btnLoad : styles.btn}
           onClick={() => {
             this.refs.inputFile.click()
           }}
         >
           {input.value.fileId || this.state.file ? dict[lang]['replace'] : dict[lang]['download']}
         </button>
       </div>
        {
          input.value.fileId && <div className={styles.fileUpload}>
            {/*<img className={styles.iconUpload} src="assets/img/antiage/file-upload.png" alt="" />*/}
            <div className={styles.fileUploadText}>{(input.value.fileName || this.state.file).slice(0, 15) + '...'}</div>

          </div>
        }
        {touched && error && <span style={style}>{error}</span>}
      </div>
    )
  }
}

export default CSSModules(FieldFileInput, styles)