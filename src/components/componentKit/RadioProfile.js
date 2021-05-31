import React, { Component } from 'react'
import CSSModules from 'react-css-modules'
import styles from './radioProfile.css'
import { connect } from 'react-redux'
import { api, domen } from '../../config.js'
import classNames from 'classnames';

const style = {
  color: '#F97B7C',
  fontSize: '12',
  position: 'absolute',
  bottom: '-12px',
  left: '0',
};
const isAlfa = domen.isAlfa;
class RadioProfile extends Component {

  componentWillUnmount(){
    this.props.dispatch({
      type:'RADIO_ERROR_REMOVE_YOU'
    })
    this.props.dispatch({
      type:'RADIO_ERROR_REMOVE'
    })
  }

  componentDidUpdate(){
    if(this.props.input.name === 'workRelation'){
      if (this.props.meta.touched && this.props.meta.error) {
        this.props.dispatch({
          type:'RADIO_ERROR_YOU',
          errorYou: this.props.meta.error
        })
      }

      if (this.props.meta.touched && !this.props.meta.error) {
        this.props.dispatch({
          type:'RADIO_ERROR_REMOVE_YOU'
        })
      }
    }
  }

  render() {
    let { input, notError, title, value, name, id, meta: { touched, error } } = this.props
    return (
      <span className={classNames(styles.radio, {
        [styles.alfa]: isAlfa
      })} >
          <label className={styles.radioLabel} htmlFor={id}>

            <input {...input} className={styles.radioField} id={id} type='radio' name={name}/>
            <span className={styles.radioPh}></span>
            <span className={styles.text}>{title}</span>
          </label>

        {!notError ? (touched && error && <span style={style}>{error}</span>) :null}

      </span>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  dispatch
});

RadioProfile = connect(
  null,
  mapDispatchToProps
)(RadioProfile);

export default CSSModules(RadioProfile, styles);
