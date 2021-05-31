import React, {Component} from 'react'
import CSSModules from 'react-css-modules'
import styles from './loading.css'


class Loading extends Component {


  render() {
    return (
      <div className={styles.textCenter}>
        <div className={styles.loaderMain}></div>
      </div>
    )
  }
}
export default CSSModules(Loading, styles)
