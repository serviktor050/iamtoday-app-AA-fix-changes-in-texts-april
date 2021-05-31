import { api } from '../config.js'
import cookie from 'react-cookie'
import { dict } from 'dict';

export const SET_HOST = 'SET_HOST'
export const RECEIVE_FINAL_STEPS = 'GET_FINAL_STEPS'
export const RECEIVE_FINAL_STEPS_ERROR = 'RECEIVE_FINAL_STEPS_ERROR'
export const REQ_FINAL_STEPS = 'REQ_FINAL_STEPS'
export const SET_PAY_WEEKLY = 'SET_PAY_WEEKLY'
export const SET_AUTH = 'SET_AUTH'

export const receiveFinalSteps = (data) => {
  return ({
    type: RECEIVE_FINAL_STEPS,
    data
  })
}
const receiveFinalStepsError = () => {
  return ({
    type: RECEIVE_FINAL_STEPS_ERROR
  })
}
const reqFinalSteps = () =>{
  return ({
    type: REQ_FINAL_STEPS
  })
}
export const setPayWeekly = (data) =>{
  return ({
    type: SET_PAY_WEEKLY,
    data
  })
}
export const setAuth = (data) =>{
  return ({
    type: SET_AUTH,
    data
  })
}
export const reqGetLang = (data) =>{
  return ({
    type: 'REQ_GET_LANG',
    data
  })
}
export const receiveGetLang = (data) =>{
  return ({
    type: 'SET_LANG',
    data
  })
}
export const fetchFinalSteps = () => dispatch => {
  dispatch(reqFinalSteps());
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }

  const method = 'POST';

  return fetch(`${api}/user/user-getRegFinalSteps`, {
    headers,
    method
  })
    .then(response => response.json())
    .then(json => {
      if(json.errorCode === 1){
        dispatch(receiveFinalSteps(json.data))
      } else {
        dispatch(receiveFinalStepsError())
      }
    })
}

export const getLang = () => dispatch => {
  dispatch(reqGetLang());
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }

  const method = 'POST';

  return fetch(`${api}/data/get-lang`, {
    headers,
    method
  })
    .then(response => response.json())
    .then(json => {


      if(json.errorCode === 1){
        let lang = cookie.load('AA.lang') || dict.default;
        if (!cookie.load('AA.lang')) {
          lang = json.data
          cookie.save('AA.lang', json.data, { path: '/', maxAge: 60 * 60 * 24 * 365 * 10 })
        }
        dispatch(receiveGetLang(lang))
      }
    })
}

export const setHost = host => {
  return {
  type: SET_HOST,
  host
}}
