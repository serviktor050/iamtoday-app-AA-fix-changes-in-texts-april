import React from 'react'
import CSSModules from 'react-css-modules'
import styles from './inputModal.css'
const style = {
  color: 'red',
  fontSize: '12'
}

const InputModal = ({ input, title, placeholder, type, meta: { touched, error } }) => (
  <div className={styles.inputBoxFillReportInfo}>
    <input {...input} type={type || 'text'} placeholder={placeholder} className={styles.inputField}/>
    {touched && error && <span style={style}>{error}</span>}
  </div>
)

export default CSSModules(InputModal, styles)
