import React from 'react'
import CSSModules from 'react-css-modules'
import styles from './selectProgram.css'

const stylesLocal = {
  pointerEvents: 'none'
}

const style = {
  color: 'red',
  fontSize: '12'
}

const SelectProgram = ({ input, zone, timezone, options, type, meta: { touched, error } }) => {
  const zoneHour = -(zone / 60)
  return (

    <div className={styles.select}>
      <select {...input} value={timezone === null ? -12 : input.value} className={styles.selectField}>
        {options.map(o => {
          return <option value={o.value} key={o.name}>{o.name || 'не выбрано'}</option>
        })}
      </select>
      <svg className={styles.svgIcoArrowAccordion} style={stylesLocal}>
        <use xlinkHref="#ico-arrow-accordion"></use>
      </svg>
      {touched && error && <span style={style}>{error}</span>}
    </div>
  )
}

export default CSSModules(SelectProgram, styles)
