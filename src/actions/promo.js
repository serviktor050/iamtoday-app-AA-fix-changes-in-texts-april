import cookie from 'react-cookie'
import { api } from '../config.js'

export const RECEIVE_PROMO = 'RECEIVE_PROMO'
export const SELECT_PROMO = 'SELECT_PROMO'

export const selectPromo = profileData => ({
  type: SELECT_PROMO,
  profileData
})

export const receivePromo = json => {
  return ({
    type: RECEIVE_PROMO,
    json
  })
}

export const fetchPromo = promoType => dispatch => {
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }

  let payload = {
    authToken: cookie.load('token'),
    data: { type: promoType }
  }

  const method = 'POST'

  return fetch(`${api}/user/user-getPersonalPromo`, {
    headers,
    method,
    body: JSON.stringify(payload)
  })
  .then(response => response.json())
  .then(json => {
    dispatch(receivePromo(json))
  })
}
