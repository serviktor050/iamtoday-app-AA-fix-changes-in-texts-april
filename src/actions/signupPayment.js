import cookie from 'react-cookie'
import { promoVisit } from './promo/promoWatch'
import { api } from '../config.js'
import { programsData } from '../utils/data'

export const REQUEST_PAYMENT = 'REQUEST_PAYMENT'
export const RECEIVE_PAYMENT = 'RECEIVE_PAYMENT'
export const SELECT_PAYMENT = 'SELECT_PAYMENT'
export const INVALIDATE_PAYMENT = 'INVALIDATE_PAYMENT'

export const selectPayment = payment => ({
  type: SELECT_PAYMENT,
  payment
})

export const invalidatePayment = payment => ({
  type: INVALIDATE_PAYMENT,
  payment
})

export const requestPayment = payment => ({
  type: REQUEST_PAYMENT,
  payment
})

export const receivePayment = (payment, json) => {
  return ({
    type: RECEIVE_PAYMENT,
    payment,
    json,
    receivedAt: Date.now()
  })
}

const fetchPayment = partialState => dispatch => {
  const { profile, payment, choosenTomorrowType, choosenProgram, choosenPackageType, choosenPromo, fromPay } = partialState
  const { program, packageType, promo, emailFriend, share } = profile

  dispatch(requestPayment(payment))

  return fetch(`${api}/payment/payment-get-info`, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({
      authToken: cookie.load('token'),
      data: { take: 1 }
    })
  })
  .then(response => response.json())
  .then(json => {
    if (!json || !json.data || !json.data[0] || !json.data[0].txId || !(json.data[0].program == programsData.hero || json.data[0].program == programsData.mommy || json.data[0].program == programsData.extreme || json.data[0].program == programsData.yoga || json.data[0].program == programsData.family)) {
      let pack
      if (cookie.load('tester')) {
        pack = 4
      } else {
        pack = packageType && packageType !== 'undefined' ? packageType : choosenPackageType
      }
      let programValue

      if(json.data[0] && json.data[0].program){
          programValue = json.data[0].program
      } else {
          programValue = programsData.hero
      }
      //let programValue = program && program !== 'undefined' && program !== -1 ? program : choosenProgram

      if(programValue !== programsData.hero || programValue !== programsData.mommy || programValue !== programsData.extreme || programValue !== programsData.yoga || programValue !== programsData.family){
          if(programValue % 3 === 1){
            programValue = programsData.hero
          }
          if(programValue % 3 === 2){
            programValue = programsData.extreme
          }
          if(programValue % 3 === 3){
            programValue = programsData.yoga
          }
        // if(programValue % 5 === 4){
        //   programValue = programsData.yoga
        // }
        //   if(programValue % 5 === 0){
        //     programValue = programsData.family
        //   }
      }

      let payload = {
        authToken: cookie.load('token'),
        data: {
          program: programValue,
          package: pack,
          isShare: share && share !== 'undefined' ? share : false
        }
      }
      const promoName = promo || cookie.load('promoName')

      if (promoName && promoName !== 'undefined') {
        payload.data.promoName = promoName
      } else if (choosenPromo) {
        payload.data.promoName = choosenPromo
      }

      if (promoVisit.getPromoSessionId()) {
        payload.data.promoSession = promoVisit.getPromoSessionId()
      }

      if (choosenTomorrowType === 1 && program + '' === '12') {
        payload.data.tomorrowManEmail = cookie.load('email')
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
        return dispatch(receivePayment(payment, json))
      })
    } else {
      return dispatch(receivePayment(payment, { data: json.data[0] }))
    }
  })
}

const shouldFetchPayment = (state, payment) => {
  const td = state.payment

  if (!td) {
    return true
  }

  if (td.isFetching) {
    return false
  }

  return td.didInvalidate
}

export const fetchPaymentIfNeeded = (payment, fromPay) => (dispatch, getState) => {
  if (shouldFetchPayment(getState(), payment)) {
    return dispatch(fetchPayment({
      token: getState().userToken.token,
      profile: getState().profile,
      choosenTomorrowType: getState().choosenTomorrowType,
      choosenProgram: getState().choosenProgram,
      choosenPromo: getState().choosenPromo,
      choosenPackageType: getState().choosenPackageType,
      fromPay:fromPay,
      payment})
    )
  }
}
