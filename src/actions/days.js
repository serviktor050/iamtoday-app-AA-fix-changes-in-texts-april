import cookie from 'react-cookie'
import { api } from '../config.js'
import moment from 'moment'

export const REQUEST_DAYS = 'REQUEST_DAYS'
export const RECEIVE_DAYS = 'RECEIVE_DAYS'
export const SELECT_DAYS = 'SELECT_DAYS'
export const INVALIDATE_DAYS = 'INVALIDATE_DAYS'

export const selectDays = days => ({
  type: SELECT_DAYS,
  days
})

export const invalidateDays = days => ({
  type: INVALIDATE_DAYS,
  days
})

export const requestDays = days => ({
  type: REQUEST_DAYS,
  days
})

export const setMenuList = page => ({
  type: 'SET_MENU_LIST',
  page
})

export const setAdminMenuList = menu => ({
  type: 'SET_ADMIN_MENU_LIST',
  menu
})

export const load = data => ({ type: 'LOAD', data })

export const receiveDays = (days, json) => {
  return ({
    type: RECEIVE_DAYS,
    days,
    json
  })
}

const fetchDays = partialState => dispatch => {
  const { token, days, date, program } = partialState

  dispatch(requestDays(days))
  const payload = {
    authToken: token ? token : cookie.load('token'),
    data: {
      date: date ? moment(date).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'),
      program
    }
  }

  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }

  const method = 'POST'
  return fetch(`${api}/data/adminday-get-info`, {
    headers,
    method,
    body: JSON.stringify(payload)
  })
  .then(response => response.json())
  .then(json => {
    return dispatch(receiveDays(days, json))
  })
}

const shouldFetchDays = (state, days) => {
  const d = state.days

  if (!d) {
    return true
  }

  if (d.isFetching) {
    return false
  }

  return d.didInvalidate
}

export const fetchDaysIfNeeded = days => (dispatch, getState) => {
  if (shouldFetchDays(getState(), days)) {
    return dispatch(fetchDays({
      token: getState().userToken.token,
      days,
      date: getState().dayDate,
      program: getState().programShow
    }))
  }
}
