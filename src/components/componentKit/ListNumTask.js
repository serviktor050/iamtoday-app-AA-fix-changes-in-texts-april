import React from 'react'
import CSSModules from 'react-css-modules'
import styles from './listNumTask.css'

const ListNumTask = props => (
  <li className={styles.numListItem}>
    <span className={styles.numListNumber}>props.num</span>
    <h6 className={styles.numListTitle}>props.name</h6>
    <p className={styles.numListDescription}>props.text</p>
  </li>
)

export default CSSModules(ListNumTask, styles)
