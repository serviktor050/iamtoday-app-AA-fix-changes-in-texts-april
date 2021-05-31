import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import * as actions from '../../actions'
import { api } from '../../config.js'
import { Field, reduxForm, formValueSelector } from 'redux-form'
import cookie from 'react-cookie'
import Modal from 'boron-react-modal/FadeModal'
import { promoVisit } from '../../actions/promo/promoWatch'
import InputProfile from '../componentKit/InputProfile'
import SelectProgram from '../componentKit/SelectProgram'
import InputProfilePhone from '../componentKit/InputProfilePhone'

let contentStyle = {
  borderRadius: '18px',
  padding: '30px'
}

class SuccessTomorrowProfile extends Component {
  render() {
    let { dispatch, program, packageType, emailFriend, promo, share, receivePayment, phoneFriend, nameFriend } = this.props
    const paymentCreate = () => {
      this.refs.loadingModal.show()

      let payload = {
        authToken: cookie.load('token'),
        data: {
          program: program && program !== 'undefined' ? program : '5',
          package: packageType && packageType !== 'undefined' ? packageType : '1',
          isShare: share && share !== 'undefined' ? share : false
        }
      }

      if (promo) {
        payload.data.promoName = promo
      }

      if (promoVisit.getPromoSessionId()) {
        payload.data.promoSession = promoVisit.getPromoSessionId()
      }

      if (emailFriend) {
        payload.data.tomorrowManEmail = emailFriend
      }

      if (phoneFriend) {
        payload.data.tomorrowManPhone = phoneFriend
      }

      if (nameFriend) {
        payload.data.tomorrowManName = nameFriend
      }

      payload.data.carrotquestUid = `carrotquest_uid:${cookie.load('carrotquest_uid')};_ym_uid:${cookie.load('_ym_uid')};_ga_cid:${cookie.load('_ga_cid')};partner:${cookie.save('partner') ? cookie.save('partner') : 'none'}`

      let data = new FormData()
      data.append('json', JSON.stringify(payload))

      return fetch(`${api}/payment/payment-create`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(payload)
      })
      .then(response => response.json())
      .then(json => {
        if (json.errorCode === 1 && json.data) {
          dispatch(receivePayment('reactjs', json))
          browserHistory.push('/signup/pay')
        }
        this.refs.loadingModal.hide()
        this.refs.successModal.show()
      })
    }

    return (
      <form className='layout'>
        <div className="header">
          <div className="grid header__inner">
            <h1 className="grid__cell header__logo">
              Ясегодня
              <img src="/assets/img/ys_logo.svg" alt="Ясегодня"/>
            </h1>
          </div>
        </div>

        <div className="entry entry--sign-in">
          <div className="entry__inner">
            <div className="entry__box">
              <h2>Подтверждение об оплате скоро придет на ваш email!</h2>
              <br/>
              <h4>В ближайшее время мы отправим на указанную почту Вашего друга письмо-сюрприз, которое откроется в день старта проекта! Мы оповестим тебя о его решении : )</h4>
              <br/>
              {!this.props.params.program &&
                <Field name="program" id="program" options={[
                  { name: '#Я ГЕРОЙ', value: '5' },
                  { name: '#МАМА МОЖЕТ', value: '6' },
                  { name: '#ЭКСТРЕМАЛЬНАЯ СУШКА', value: '7' },
                  { name: '#Я ЗАВТРА', value: '8' }
                ]} component={SelectProgram} />
              }
              {program + '' !== '8' &&
                <Field name="packageType" id="packageType" options={[
                  { name: '1 человек', value: '1' },
                  { name: '2 человека', value: '2' },
                  { name: '3 человека', value: '3' }
                  // { name: 'Тестер', value: '4' }
                ]} component={SelectProgram} />
              }
              {program + '' === '8' &&
                <div>
                  <Field name='emailFriend' id='emailFriend' placeholder='Email друга' component={InputProfile} />
                  <Field name='phoneFriend' id='phoneFriend' type='tel' placeholder='Телефон друга' component={InputProfilePhone} />
                  <Field name='nameFriend' id='nameFriend' placeholder='Имя друга' component={InputProfile} />
                </div>
              }
              <Field name='promo' id='promo' placeholder='Промокод, если есть' component={InputProfile} />
              <button className="btn btn--primary" onClick={e => {
                e.preventDefault()

                return fetch(`${api}/day/package-get`, {
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  },
                  method: 'POST',
                  body: JSON.stringify({ promoName: promo })
                })
                .then(response => response.json())
                .then(json => {
                  if (json.errorCode === 1) {
                    paymentCreate()
                  } else {
                    this.refs.errorPromoModal.show()
                  }
                })
              }}>
                Выберите программу себе
              </button>
              <div className="divider" />
              <button className="btn btn--action" onClick={e => {
                e.preventDefault()
                cookie.remove('token', { path: '/' })
                cookie.remove('txId', { path: '/' })
                cookie.remove('role', { path: '/' })
                cookie.remove('program', { path: '/' })
                cookie.remove('packageType', { path: '/' })
                cookie.remove('promoName', { path: '/' })
                cookie.remove('share', { path: '/' })
                cookie.remove('general', { path: '/' })
                cookie.remove('tester', { path: '/' })
                browserHistory.push('/')
              }}>
                Выйти
              </button>
            </div>
          </div>
        </div>
        <Modal ref='loadingModal' contentStyle={contentStyle} backdrop={false}>
          <div className="entry__header">
            <h2 className="entry__title text-center">Загружается...</h2>
          </div>
          <div className="text-center">
            <div className="loader loader--main"></div>
          </div>
        </Modal>
        <Modal ref='successModal' contentStyle={contentStyle}>
          <h2>Изменения сохранены</h2>
          <br/>
          <button className="btn btn--action" onClick={() => this.refs.successModal.hide()}>
            Продолжить
          </button>
        </Modal>
        <Modal ref='errorPromoModal' contentStyle={contentStyle}>
          <h2>Промокод недействителен</h2>
          <br/>
          <button className="btn btn--action" onClick={() => this.refs.errorPromoModal.hide()}>
            Продолжить
          </button>
        </Modal>
      </form>
    )
  }
}

SuccessTomorrowProfile = reduxForm({
  form: 'friendPayCreateValidation'
})(SuccessTomorrowProfile)

let selector = formValueSelector('friendPayCreateValidation')

const mapStateToProps = state => {
  let { program, packageType, promo, amount, share } = state.profile

  program = selector(state, 'program')
  packageType = selector(state, 'packageType')

  const emailFriend = selector(state, 'emailFriend')
  const phoneFriend = selector(state, 'phoneFriend')
  const nameFriend = selector(state, 'nameFriend')
  promo = selector(state, 'promo')

  return {
    program,
    packageType,
    promo,
    amount,
    emailFriend,
    phoneFriend,
    nameFriend,
    share
  }
}

const mapDispatchToProps = dispatch => ({
  signup: bindActionCreators(actions.signup, dispatch),
  receivePayment: bindActionCreators(actions.receivePayment, dispatch)
})

SuccessTomorrowProfile = connect(
  mapStateToProps,
  mapDispatchToProps
)(SuccessTomorrowProfile)

export default SuccessTomorrowProfile
