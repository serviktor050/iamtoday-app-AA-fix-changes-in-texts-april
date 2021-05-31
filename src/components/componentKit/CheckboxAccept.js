import React from 'react'
import CSSModules from 'react-css-modules'
import styles from './checkboxAccept.css'
const style = {
  color: 'red',
  fontSize: '12'
}

const CheckboxAccept = ({ input, title, id, meta: { touched, error } }) => (
  <li className={styles.checkboxesItem}>
    <span className={styles.checkbox}>
      <label className={styles.checkboxLabel} htmlFor={id}>
        <input {...input} className={styles.checkboxField} id={id} type="checkbox"/>
        <span className={styles.checkboxPh}>
          <svg className={styles.svgIcoTick}>
            <use xlinkHref="#ico-tick"></use>
          </svg>
        </span>
        <span className={styles.checkboxTitle}>{title}</span>
      </label>
    </span>
    {touched && error && <span style={style}>{error}</span>}
  </li>
)

export default CSSModules(CheckboxAccept, styles)
