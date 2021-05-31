import cookie from 'react-cookie'
import { api } from '../config.js'
import { browserHistory } from 'react-router'

export const REQUEST_REPORTS = 'REQUEST_REPORTS'
export const RECEIVE_REPORTS = 'RECEIVE_REPORTS'
export const SELECT_REPORTS = 'SELECT_REPORTS'
export const INVALIDATE_REPORTS = 'INVALIDATE_REPORTS'

export const selectReports = reports => ({
  type: SELECT_REPORTS,
  reports
})

export const invalidateReports = reports => ({
  type: INVALIDATE_REPORTS,
  reports
})

export const requestReports = reports => ({
  type: REQUEST_REPORTS,
  reports
})

export const receiveReports = (reports, json) => {

  return ({
    type: RECEIVE_REPORTS,
    reports,
    json
  })
}

const fetchReports = partialState => dispatch => {
  const { token, reports } = partialState
  const authToken = token ? token : cookie.load('token')
  if (authToken) {
    let payload = {
      authToken,
      data: {}
    }

    return fetch(`${api}/user/userDay-get`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(json => dispatch(receiveReports(reports, json)))
  } else {
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
  }
}

const shouldFetchReports = (state, reports) => {
  const reps = state.reports

  if (!reps) {
    return true
  }

  if (reps.isFetching) {
    return false
  }

  return reps.didInvalidate
}

export const fetchReportsIfNeeded = reports => (dispatch, getState) => {
  if (shouldFetchReports(getState(), reports)) {
    return dispatch(fetchReports({
      token: getState().userToken.token,
      reports
    }))
  }
}
