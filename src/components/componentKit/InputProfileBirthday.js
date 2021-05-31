import React from 'react'
import CSSModules from 'react-css-modules'
import styles from './inputProfileBirthday.css'
const style = {
  color: 'red',
  fontSize: '12'
}

const InputProfileBirthday = ({ input, title, placeholder, type, meta: { touched, error } }) => (
  <div className={styles.inputBoxMb30}>
    <input {...input} type={type || 'text'} placeholder={placeholder} className={styles.inputFieldDate}/>
    {touched && error && <span style={style}>{error}</span>}
  </div>
)

export default CSSModules(InputProfileBirthday, styles)
