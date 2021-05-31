import React from 'react'
import CSSModules from 'react-css-modules'
import styles from './checkboxProfile.css'
import classNames from 'classnames';
const style = {
  color: 'red',
  fontSize: '12px'
}

const CheckboxProfile = (props) => {
  const { noRedux, className, titleComponent, input, title, value, kind, checker, onChange, id, meta: { touched, error } } = props;
  const Component = props.titleComponent;
  return (
    <div className={classNames(styles.checkboxesItem, {
      [className]: !!className
    })}>
      <span className={styles.checkbox}>
        <label className={styles.checkboxLabel} htmlFor={id}>
          <input
            {...input}
            value={ noRedux ? value : input.value }
            checked={checker}
            className={classNames(styles.checkboxField, {
              [styles.sign]: kind ===  'sign'
            })}
            id={id}
            type="checkbox"
            onChange={noRedux ? onChange : input.onChange}/>
          <span className={classNames(styles.checkboxPh, {
            [styles.sign]: kind ===  'sign'
          })}>
           {/* <svg className={styles.svgIcoTick}>
              <use xlinkHref="#ico-tick"></use>
            </svg>*/}
            <span className={styles.tick}></span>
          </span>
          {Component  && <Component  />}
          {title && <span className={styles.checkboxTitle}>{title}</span>}
        </label>
      </span>
      {touched && error && <span style={style}>{error}</span>}
    </div>
  )
}

export default CSSModules(CheckboxProfile, styles)
