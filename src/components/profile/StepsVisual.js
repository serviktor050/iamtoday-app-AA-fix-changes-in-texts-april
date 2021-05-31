import React, {Component} from 'react'
import CSSModules from 'react-css-modules'
import styles from './stepsVisual.css'
import classNames from 'classnames';

class StepsVisual extends Component {

  state = {
    step: 'one',
  }

  componentDidMount(){
    this.setState({
        step: this.props.step
    })
  }

  render() {
    return (
      <div className={styles.stepsVisual}>
        <div className={styles.stepsVisualList}>
          <div className={classNames(styles.stepsVisualItem, {
            [styles.active]: this.props.step === 'one'
          })} />
          <div className={classNames(styles.stepsVisualItem, {
              [styles.active]: this.props.step === 'two'
          })} />
          <div className={classNames(styles.stepsVisualItem, {
              [styles.active]: this.props.step === 'three'
          })} />
        </div>
      </div>
    )
  }
}
export default CSSModules(StepsVisual, styles)
