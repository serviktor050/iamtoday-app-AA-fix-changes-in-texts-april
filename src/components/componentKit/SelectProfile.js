import React from 'react'
import CSSModules from 'react-css-modules'
import styles from './selectProfile.css'

const stylesLocal = {
  pointerEvents: 'none'
}
const style = {
  color: 'red',
  fontSize: '12'
}

const SelectProfile = ({ input, options, type, meta: { touched, error } }) => (
  <div className={styles.select}>
    <select {...input} className={styles.selectField}>
      {options.map(o =>
        <option value={o} key={o}>{o}</option>
      )}
    </select>
    <svg className={styles.svgIcoArrowAccordion} style={stylesLocal}>
      <use xlinkHref="#ico-arrow-accordion"></use>
    </svg>
    {touched && error && <span style={style}>{error}</span>}
  </div>
)

export default CSSModules(SelectProfile, styles)
