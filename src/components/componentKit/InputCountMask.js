import React from 'react'
import InputElement from 'react-input-mask'
import CSSModules from 'react-css-modules'
import styles from './inputCountMask.css'
const style = {
	color: '#f97b7c',
	fontSize: '12px',
	position: 'absolute',
	left: '0',
	bottom: '-36px'
}

const InputCountMask = ({ input, title, placeholder, type, meta: { touched, error } }) => (
	<div className={styles.inputBox}>
		{/* <input {...input} type={type || 'text'} placeholder={placeholder} className={styles.inputField}/> */}
		<InputElement {...input} mask="999" placeholder={placeholder} className={touched && error ? styles.inputFieldError : styles.inputField} maskChar=" "/>
		{touched && !error && <span className={styles.inputIcoRequiredSucceess}></span>}
		{touched && error && <span className={styles.inputIcoRequired}></span>}
		{touched && error && <span style={style}>{error}</span>}
	</div>
)

export default CSSModules(InputCountMask, styles)