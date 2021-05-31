import React from 'react'
import CSSModules from 'react-css-modules'
import styles from './radioProfileHidden.css'

const RadioProfileHidden = ({ index, input, val, key, onClick, name, meta: { touched, error } }) => (
  <li key={index} className={styles.optionsItem} id={`sports[${key}]`} onClick={onClick}>
    <input {...input} type='radio' name={name} style={{visibility: 'hidden', margin: -5}} value={val}/>
    {val}
  </li>
)

export default CSSModules(RadioProfileHidden, styles)
