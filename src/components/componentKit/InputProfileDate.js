import React from 'react'
import CSSModules from 'react-css-modules'
import styles from './inputProfileDate.css'
const style = {
  color: 'red',
  fontSize: '12'
}

const InputProfileDate = ({ input, disabled, title, placeholder, val, type, meta: { touched, error } }) => (
  <div className={styles.inputBox}>
    {disabled ? <input disabled {...input} type={type || 'text'} placeholder={placeholder} className={styles.inputFieldDate} value={val} />
      : <input {...input} type={type || 'text'} placeholder={placeholder} className={styles.inputFieldDate} value={val} />
    }
    {touched && error && <span style={style}>{error}</span>}
  </div>
)

export default CSSModules(InputProfileDate, styles)
