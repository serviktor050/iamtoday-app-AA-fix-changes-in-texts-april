import React from 'react'
import InputElement from 'react-input-mask'
import CSSModules from 'react-css-modules'
import styles from './inputProfilePhone.css'
const style = {
  color: 'red',
  fontSize: '12'
}

const InputProfilePhone = ({ input, title, placeholder, type, meta: { touched, error } }) => (
  <div className={styles.inputBox}>
    {/* <input {...input} type={type || 'text'} placeholder={placeholder} className={styles.inputField}/> */}
    <InputElement {...input} mask="+7 999 999 9999" placeholder={placeholder} className={styles.inputField} maskChar=" "/>
    {touched && error && <span style={style}>{error}</span>}
  </div>
)

export default CSSModules(InputProfilePhone, styles)
