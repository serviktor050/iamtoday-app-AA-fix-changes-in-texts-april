import React, {Component} from 'react'
import CSSModules from 'react-css-modules'
import styles from './inputProfile.css'
import Tooltip from '../componentKit2/Tooltip'
import { api, host, domen } from '../../config.js'
import classNames from 'classnames';
import { default as intlTelInput } from 'intl-tel-input';
import '../../../node_modules/intl-tel-input/build/css/intlTelInput.css';

const isAlfa = domen.isAlfa;

const style = {
  color: '#f97b7c',
  fontSize: '12px',
  position: 'absolute',
  left: '0',
  bottom: '-20px'
}

const iconsName = [
  'ico-book',
  'ico-flag',
  'ico-price',
  'ico-rocket'
]
class InputProfile extends Component {

  state = {
    value :'',
    countryCode :'',
    isFocus: false
  }
  componentDidMount(){
    const { val, input} = this.props;
    this.setState({
      value: val || this.props.input.value //val || (arr.length > 1 ? arr[1]: this.props.input.value)
    })
  }


  componentWillReceiveProps(nextProps){

    if(nextProps.val !== this.props.val){
      this.setState({
        value: nextProps.val
      })
      this.props.input.onChange(nextProps.val)
    }
  }
  onClickIcon(icon) {
    const { input } = this.props
    input.onChange(icon)

  }
  onChange(e){
    const { remote } = this.props;
    if (!remote) {
      this.setState({
        value: e.target.value
      });
    }

    this.props.input.onChange(e.target.value)
  }

  render() {
    const { tooltip, cls, input, smm, notReq, required, placeholder, value, disabled, type, meta: { touched, error }, remote } = this.props;
    const placeholderText = `${placeholder}${required ? " *" : ""}`
    const icons = iconsName.map(icon => {
      return (
        <div
            key={icon}
            onClick={this.onClickIcon.bind(this, icon)}
            className={styles.iconBoxItem}
        >
          <svg className={'svg-icon'}>
            <use xlinkHref={'#' + icon}/>
          </svg>
        </div>
      )
    });


    const inputCls = !notReq && touched && error ? styles.inputFieldError : styles.inputField;

    return (

      <div className={styles.inputBox}>
        {input.name === 'customIcon' ? <div className={styles.iconBox}>{icons}</div> : ''}
        <div className={classNames(styles.inputName, {
          [styles.inputNameShow]: this.state.value || this.state.isFocus,
          [styles.inputNameShowDis]: disabled
        })}>{placeholderText}</div>
        <input {...input}
          disabled={disabled}
          type={type || 'text'}
          value={this.state.value}
          onChange={this.onChange.bind(this)}
          placeholder={placeholderText}
          ref='input'
          className={classNames(inputCls, {
            [cls]: !!cls
          })}
          onFocus={e => {
          e.target.placeholder = ''
            this.setState({ isFocus: true});
        }} onBlur={e => {
          e.target.placeholder = placeholderText;
          this.setState({ isFocus: false });
        }}/>
        {!notReq && touched && !error && <span className={styles.inputIcoRequiredSucceess}></span>}
        {!notReq && touched && error && <span className={styles.inputIcoRequired}></span>}
        {!notReq && touched && error && <span style={style}>{error}</span>}

          {   tooltip &&
          <Tooltip position='center'>
              {tooltip}
          </Tooltip>
          }

      </div>
    )
  }
}
export default CSSModules(InputProfile, styles)
