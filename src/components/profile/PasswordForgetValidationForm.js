import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { Link } from 'react-router';
import CSSModules from 'react-css-modules';
import { api, host, domen } from '../../config.js'
import styles from './passwordForgetValidationForm.css';
import classNames from 'classnames';
import cookie from 'react-cookie';
import { dict } from 'dict';
import InputProfile from '../componentKit2/InputProfile';

const isAlfa = domen.isAlfa;

const PasswordForgetValidationForm = props => {
  const { error, handleSubmit, onSubmit } = props;
  const lang = cookie.load('AA.lang') || dict.default;
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={classNames(styles.entryBox, {
        [styles.alfa]: isAlfa,
      })}
    >
      <div className={styles.input}>
        <label>{dict[lang]['regs.yourEmail']}</label>
        <Field
          name='email'
          id='login[1]'
          placeholder={dict[lang]['regs.placeholder.yourEmail']}
          component={InputProfile}
          cls={styles.inputCustom}
        />
      </div>

      {error && <strong>{error}</strong>}

      <button
        type='submit'
        className={classNames(styles.btnSecondaryWideMb20, {
          [styles.mb0]: isAlfa
        })}
      >
        {dict[lang]['regs.restore']}
      </button>

      <ul className={styles.entryNav}>
        <li className={styles.entryNavItem}>
          <Link to="/" className={styles.link}> {dict[lang]['regs.logIn']}</Link>
        </li>
        <li className={styles.entryNavItem}>
          <Link className={styles.link} to="/signup">{dict[lang]['regs.registration']}</Link>
        </li>
      </ul>
    </form>
  )
}

const validate = (data, props) => {
  const errors = {}
  const lang = cookie.load('AA.lang') || dict.default;
  if (data.email) {
    data.email = data.email.replace(/ /g, '')
  }

  switch (true) {
    case !data.email:
      errors.email = dict[lang]['regs.emailMustNotEmpty']
      break
    case !/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i.test(data.email):
      errors.email = dict[lang]['regs.emailWrong']
      break
    default:
      break
  }

  return errors
}

export default CSSModules(reduxForm({
  form: 'signupValidation',
  validate
})(PasswordForgetValidationForm), styles)
