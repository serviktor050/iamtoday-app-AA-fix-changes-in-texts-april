import React from 'react'
import CSSModules from 'react-css-modules'
import styles from './errorField.css'

const ErrorField = ({ input, meta: { touched, error } }) => (
  <div className={styles.textCenter}>{touched && error && <strong>{error}</strong>}</div>
)

export default CSSModules(ErrorField, styles)
