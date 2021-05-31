import React, { Component } from 'react'
import { Link } from 'react-router'
import CSSModules from 'react-css-modules'
import styles from './checkboxOfert.css'
const style = {
  color: '#F97B7C',
  fontSize: '1.2rem'
}

class CheckboxOfert extends Component {

  componentWillMount(){
   if(this.props.isTest){
      this.props.input.onChange(true)
    }
  }

    render(){
      const { id,  isAccept, input, title, meta: {touched, error} } = this.props;
      if(isAccept){
        if(input.value){
          localStorage.setItem('accept', true);
        } else {
          localStorage.removeItem('accept');
        }
      }

    return (
      <div className={styles.checkboxesItem}>
      <span className={styles.checkbox}>
        <label className={styles.checkboxLabel} htmlFor={id}>
          <input {...input} className={styles.checkboxField} checked={input.value} id={id} type="checkbox"/>
          <span className={styles.checkboxPh}>
            <svg className={styles.svgIcoTick}>
              <use xlinkHref="#ico-tick"></use>
            </svg>
          </span>
          <div className='gender'>
            <span className={styles.checkboxTitle}>{title}</span>
            <div className="divider"/>
            <Link className={styles.checkboxLink} target="_blank" to="/offer">оферты</Link>
          </div>
        </label>
      </span>
        {touched && error && <span style={style}>{error}</span>}
      </div>
    )
  }
}
export default CSSModules(CheckboxOfert, styles)

