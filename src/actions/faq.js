import { api } from '../config.js'
import cookie from 'react-cookie'

export const REQ_FAQ = 'REQ_FAQ'
export const RECEIVE_FAQ = 'RECEIVE_FAQ'
export const RECEIVE_FAQ_ERROR = 'RECEIVE_FAQ_ERROR'

const receiveFaqData = (data) => {
  return ({
    type: RECEIVE_FAQ,
    data
  })
}
const receiveFaqError = () => {
  return ({
    type: RECEIVE_FAQ_ERROR
  })
}
const reqFaq = () =>{
  return ({
    type: REQ_FAQ
  })
}
export const fetchFaq = () => dispatch => {
  dispatch(reqFaq())
  const payload = {
    authToken: cookie.load('token'),
  }

  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
//partnerAdv-get
  const method = 'POST'
  return fetch(`${api}/data/faq-get`, {
    headers,
    method,
    body: JSON.stringify(payload)
  })
    .then(response => response.json())
    .then(json => {
      if(json.errorCode === 1){
        dispatch(receiveFaqData(json.data))
      } else {
        dispatch(receiveFaqError())      }
    })
}
