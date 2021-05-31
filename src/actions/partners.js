import { api } from '../config.js'
import cookie from 'react-cookie'

export const REQ_PARTNERS = 'REQ_PARTNERS'
export const RECEIVE_PARTNERS = 'RECEIVE_PARTNERS'
export const RECEIVE_PARTNERS_ERROR = 'RECEIVE_PARTNERS_ERROR'


const reqPartners = () =>{
  return ({
    type: REQ_PARTNERS
  })
}
const receivePartners = (data) => {
  return ({
    type: RECEIVE_PARTNERS,
    data
  })
}
const receivePartnersError = () => {
  return ({
    type: RECEIVE_PARTNERS_ERROR
  })
}
export const fetchPartners = () => dispatch => {
  dispatch(reqPartners())
  const payload = {
    authToken: cookie.load('token'),
  }

  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }

  const method = 'POST'
  return fetch(`${api}/user/user-getPersonalPromoPartners`, {
    headers,
    method,
    body: JSON.stringify(payload)
  })
    .then(response => response.json())
    .then(json => {
      //json.errorCode = 32
      if(json.errorCode === 1){
        dispatch(receivePartners(json.data))
      } else {
        dispatch(receivePartnersError())      }
    })
}
