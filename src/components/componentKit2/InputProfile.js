import React, {Component} from 'react'
import CSSModules from 'react-css-modules'
import styles from './inputProfile.css'
import classNames from 'classnames';
import { api, host, domen } from '../../config.js'

const isAlfa = domen.isAlfa;

const iconsName = [
  'ico-book',
  'ico-flag',
  'ico-price',
  'ico-rocket'
]
class InputProfile extends Component {

  state = {
    isFocus: false
  }
  onClickIcon(icon) {
    const { input } = this.props
    input.onChange(icon)
  }

  render() {
    const { input, cls, placeholder, value, type, smm, disabled,  meta: { touched, error } } = this.props
    const icons = iconsName.map(icon => {
      return (
        <div key={icon} onClick={this.onClickIcon.bind(this, icon)} className={styles.iconBoxItem}>
          <svg className={'svg-icon'}>
            <use xlinkHref={'#' + icon}/>
          </svg>
        </div>
      )
    })
    return (
      <div className={touched && error ? styles.inputBoxError :classNames(styles.inputBox, {[styles.inputBoxSmm]: smm})}>
        {input.name === 'customIcon' ? <div className={styles.iconBox}>{icons}</div> : ''}
        {/*<div className={classNames(styles.inputName, {*/}
          {/*[styles.inputNameShow]: input.value || this.state.isFocus,*/}
          {/*[styles.inputNameShowDis]: disabled*/}
        {/*})}>{placeholder}</div>*/}
        <input
          {...input}
          disabled={disabled}
          type={type || 'text'}
          placeholder={placeholder}
          className={classNames(styles.inputField, {
            [styles.colorWhite]: isAlfa,
              [cls]: !!cls
          })}
          onFocus={e => {
          e.target.placeholder = '';
            this.setState({ isFocus: true});
        }} onBlur={e => {
          e.target.placeholder = placeholder;
          this.setState({ isFocus: false});
        }}/>

        {touched && error && <p className={styles.inputAlert}>{error}</p>}
      </div>
    )
  }
}
export default CSSModules(InputProfile, styles)
