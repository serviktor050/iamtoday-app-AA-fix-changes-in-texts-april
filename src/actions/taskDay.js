import cookie from 'react-cookie'
import { api } from '../config.js'
import moment from 'moment'
import { browserHistory } from 'react-router'
import { setTypeId } from './chats'

export const REQUEST_TASKDAY = 'REQUEST_TASKDAY'
export const RECEIVE_TASKDAY = 'RECEIVE_TASKDAY'
export const SELECT_TASKDAY = 'SELECT_TASKDAY'
export const INVALIDATE_TASKDAY = 'INVALIDATE_TASKDAY'

export const selectTaskDay = taskDay => ({
  type: SELECT_TASKDAY,
  taskDay
})

export const invalidateTaskDay = taskDay => ({
  type: INVALIDATE_TASKDAY,
  taskDay
})

export const requestTaskDay = taskDay => ({
  type: REQUEST_TASKDAY,
  taskDay
})
export const reqTaskDay = () => ({
  type: 'REQ_TASK_DAY'
})
export const getTaskDay = data => ({
  type: 'GET_TASK_DAY',
  data
})
export const receiveTaskDay = (taskDay, json) => {
  return ({
    type: RECEIVE_TASKDAY,
    taskDay,
    json,
    receivedAt: Date.now()
  })
}

export const fetchTaskDay = (partialState, done) => dispatch => {
  const { token, taskDay, selectedDayDate, selectedDayId } = partialState
  dispatch(requestTaskDay(taskDay))
  dispatch(reqTaskDay())
  const authToken = token ? token : cookie.load('token')
  if (authToken) {
    let payload = {
      authToken,
      data: {}
         // program: cookie.load('userProgram') ? cookie.load('userProgram') : 1,
      // }
    }

    if (cookie.load('currentSeason')) {
      payload.data.season = cookie.load('currentSeason')
    }

    if (selectedDayId) {
      payload.data.id = selectedDayId
    } else if (!cookie.load('currentSeason')) {
      payload.data.date = selectedDayDate ? selectedDayDate : moment().format('YYYY-MM-DD')
    }
    return fetch(`${api}/data/userday-get-info`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(json => {
      dispatch(receiveTaskDay(taskDay, json))
      if(json.data[0]){
        dispatch(getTaskDay(json.data[0]))
        dispatch(setTypeId(json.data[0].id))
      }
      if(done){
        done(json.data[0].id)
      }
    })
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

const shouldFetchTaskDay = (state, taskDay) => {
  const td = state.taskDay

  if (!td) {
    return true
  }

  if (td.isFetching) {
    return false
  }

  return td.didInvalidate
}

export const fetchTaskDayIfNeeded = (taskDay, done) => (dispatch, getState) => {
  if (shouldFetchTaskDay(getState(), taskDay)) {
    return dispatch(fetchTaskDay({
      token: getState().userToken.token,
      taskDay,
      selectedDayDate: getState().selectedDayDate,
      selectedDayId: getState().selectedDayId
    },done))
  }
}

export function taskDone(payload) {
  return (dispatch) => {
    fetch(`${api}/user/userTask-setState`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(payload)
    })
        .then(response => response.json())
        .then(json => {
        })
  }
}
