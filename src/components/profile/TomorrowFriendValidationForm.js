import React from 'react'
import { Field, reduxForm } from 'redux-form'

import InputProfile from '../componentKit2/InputProfile'
import CSSModules from 'react-css-modules'
import styles from './tomorrowFriendValidationForm.css'

let TomorrowFriendValidationForm = props => {
  const { error, handleSubmit, onSubmit } = props
  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.entryBox}>

      <Field name='name' id='login[1]' placeholder='Имя' component={InputProfile} />
      <Field name='email' id='login[2]' placeholder='Email' component={InputProfile} />
      <Field name='phone' id='login[3]' placeholder='Телефон' component={InputProfile} />

      {error && <strong>{error}</strong>}

      <button type='submit' className={styles.buttonSecondaryWide}>Продолжить</button>
    </form>
  )
}

const validate = data => {
  const errors = {}

  if (data.email) {
    data.email = data.email.replace(/ /g, '')
  }

  switch (true) {
    case !data.email:
      errors.email = 'Email должен быть заполнен'
      break
    case !/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i.test(data.email):
      errors.email = 'Email заполнен неправильно, проверьте его еще раз'
      break
    default:
      break
  }

  if (!data.firstName) {
    errors.firstName = 'Имя должен быть заполнено'
  }

  if (!data.phone) {
    errors.phone = 'Телефон должен быть заполнен'
  }

  return errors
}

TomorrowFriendValidationForm = reduxForm({
  form: 'signupValidation',
  validate
})(TomorrowFriendValidationForm)

export default CSSModules(TomorrowFriendValidationForm, styles)
