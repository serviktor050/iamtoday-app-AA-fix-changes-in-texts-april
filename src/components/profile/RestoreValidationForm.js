import React from 'react'
import { Field, reduxForm } from 'redux-form'
import { Link } from 'react-router'
import LogoLink from '../componentKit/LogoLink'
import CustomInput from '../componentKit/CustomInput'
import CSSModules from 'react-css-modules'
import styles from './restoreValidationForm.css'
import InputProfile from '../componentKit2/InputProfile'
import { api, domen } from '../../config.js'
import { dict } from 'dict';
import cookie from 'react-cookie';

const defaultBg = <img className={styles.alfaBg} src="/assets/img/antiage/bg.jpg" alt=""/>

let RestoreValidationForm = props => {

  const { error, handleSubmit, onSubmit} = props

  const isTele2Lk = domen.isTele2
  const isAlfa = domen.isAlfa
  const isUnipro = domen.isUnipro
  const lang = cookie.load('AA.lang') || dict.default;

  let bg = defaultBg;
  if (isAlfa) {
    document.body.style.backgroundColor = "#213349"
  }
  return (
    <div className={styles.layoutEntry}>
    <div className={styles.gridEntryHeader}>
      <div className={styles.gridCellTodaymeLogo}>
        <LogoLink isUnipro={isUnipro} isAlfa={isAlfa}/>
      </div>
    </div>

    <div className={styles.entryMin}>
      <div className={styles.entryInner}>

        <div className={styles.entryHeader}>
          <h2 className={isAlfa ? styles.entryTitleCenterAlfa : styles.entryTitleCenter}>{dict[lang]['regs.recovery']}</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.entryBox}>

          {/* <div className={styles.grid}>
           <input type="email" className={styles.inputField} placeholder="Ваш email" value="alex@gmail.com"/>
           <p className={styles.inputAlert}>Неверный e-mail</p>
           </div>
           <div className={styles.inputBox}>
           <input type="password" className={styles.inputField} placeholder="Ваш пароль" value=""/>
           </div> */}

          {/*<Field name='email' id='login[1]' placeholder='Ваш e-mail' component={InputProfile} />
          <Field name='password' id='login[2]' placeholder='Ваш пароль' type='password' component={InputProfile} />

          <button type='submit' className={styles.buttonSecondaryWide}>Войти</button>*/}

          <div className={styles.deskGridCell12}>
            <Field cls={styles.input} name='password' id='login[2]' placeholder={dict[lang]['regs.newPassword']} type='password' component={InputProfile} />
            <Field cls={styles.input} name='passwordAgain' id='login[3]' placeholder={dict[lang]['regs.newPasswordRepeate']} type='password' component={InputProfile} />
            <button type='submit' className={isTele2Lk ?  styles.btnTele2: styles.btnPrimary}>
              {dict[lang]['regs.toRestore']}
            </button>
          </div>

          <ul className={styles.entryNavMtb20}>
            <li className={styles.entryNavItem}>
              <Link to="/signup">{dict[lang]['regs.registration']}</Link>
            </li>
          </ul>
        </form>

      </div>
    </div>

      <div className={styles.entryBg}>
        {bg}
    </div>


  </div>
    /*<form onSubmit={handleSubmit(onSubmit)} className={styles.layoutLogin}>

      <div className={styles.header}>
        <div className={styles.gridHeaderInner}>
          <h1 className={styles.gridCellHeaderLogo}>
            Ясегодня
            <img src="/assets/img/ys_logo.svg" alt="Ясегодня"/>
          </h1>
        </div>
      </div>

      <div className={styles.entrySignIn}>

        <div className={styles.entryInner}>
          <div className={styles.entryBox}>

            <div className={styles.entryForm}>
              <div className={styles.entryFormHeader}>
                <Link to="/signup">Регистрация</Link>
              </div>

              <hr/>

              {error && <strong>{error}</strong>}

              <h2 className={styles.h2}>Восстановление пароля</h2>

              <div className={styles.gridMiddle}>
                <div className={styles.deskGridCell12}>
                  <Field name='password' id='login[2]' title='Новый пароль' type='password' component={CustomInput} />
                  <Field name='passwordAgain' id='login[3]' title='Новый пароль повторно' type='password' component={CustomInput} />
                  <button type='submit' className={styles.btnPrimary}>
                    Восстановить
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

    </form>*/
  )
}

const validate = data => {
  const errors = {}
  const lang = cookie.load('AA.lang') || dict.default;
  switch (true) {
    case !data.password:
      errors.password = dict[lang]['passMustNotEmpty']
      break
    case data.password.length < 6:
      errors.password = dict[lang]['regs.passMustMore']
      break
    case data.password.length > 20:
      errors.password = dict[lang]['regs.passMustLess']
      break
    case /["]/g.test(data.password):
      errors.password = dict[lang]['regs.passCanNotSign']
      break
    default:
      break
  }

  if (data.password !== data.passwordAgain) {
    errors.passwordAgain = dict[lang]['regs.passMustEqual']
  }

  return errors
}

RestoreValidationForm = reduxForm({
  form: 'loginValidation',
  validate
})(RestoreValidationForm)

export default CSSModules(RestoreValidationForm, styles)
