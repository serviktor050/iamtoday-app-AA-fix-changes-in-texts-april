import React from 'react'
import CSSModules from 'react-css-modules'
import styles from './customInput.css'
const style = {
  color: 'red',
  fontSize: '12'
}

const CustomInput = ({ input, title, id, type, meta: { touched, error } }) => (
  <div className={styles.inputLine}>
    <input {...input} id={id} type={type || 'text'} className={styles.inputField}/>
    <label className={styles.inputLabel} htmlFor={id}>{title}</label>
    {touched && error && <span style={style}>{error}</span>}
  </div>
)

export default CSSModules(CustomInput, styles)
