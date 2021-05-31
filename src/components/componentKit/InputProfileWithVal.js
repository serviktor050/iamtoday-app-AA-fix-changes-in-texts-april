import React from 'react'
import CSSModules from 'react-css-modules'
import styles from './inputProfileWithVal.css'

const InputProfileWithVal = ({ input, title, placeholder, val, type, meta: { touched, error } }) => (
  <div className={styles.inputBox}>
    <input {...input} type={type || 'text'} placeholder={placeholder} className={styles.inputField} />
    {touched && error && <span>{error}</span>}
  </div>
)

export default CSSModules(InputProfileWithVal, styles)
