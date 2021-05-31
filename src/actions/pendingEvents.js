import cookie from 'react-cookie'
import {api} from '../config.js'
import moment from 'moment'

moment.locale('ru')

const ITEMS_PER_PAGE = 50

export const REQUEST_PENDING_EXAM = 'REQUEST_PENDING_EXAM'
export const RECEIVE_PENDING_EXAM = 'RECEIVE_PENDING_EXAM'
export const REQUEST_PENDING_EXAMS = 'REQUEST_PENDING_EXAMS'
export const RECEIVE_PENDING_EXAMS = 'RECEIVE_PENDING_EXAMS'

export const EXAM_STATUS_APPROVE = 'done'
export const EXAM_STATUS_WAITING = 'waitingadmin'
export const EXAM_STATUS_REJECT = 'missed'

export const requestPendingExams = () => ({
  type: REQUEST_PENDING_EXAMS
})

export const receivePendingExams = (payload, pageCount) => ({
  type: RECEIVE_PENDING_EXAMS,
  payload,
  pageCount
})

export const fetchPendingExams = (status, page = 1, isExam, user, userFilterText) => (dispatch, getState) => {
  dispatch(requestPendingExams())

  const {token} = getState().userToken

  return fetch(`${api}/user/userDayAdmin-get`, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({
      authToken: token ? token : cookie.load('token'),
      data: {
        status: status ? status : 'waiting',
        take: ITEMS_PER_PAGE,
        skip: ITEMS_PER_PAGE * (page - 1),
        isExam: isExam,
        user,
        userFilterText
      }
    })
  })
    .then(response => response.json())
    .then(json => {
      const list = (json.data || [])
        .map(item => {
          const link = `/userReports/exams/${item.user}/${item.day}`
          const fullName = item.user.fullName || `${item.userInfo.firstName} ${item.userInfo.lastName}`

          return {
            ...item,
            link,
            fullName
          }
        })
        .sort((a, b) => a.updateTs > b.updateTs)

      const pageCount = json.data.length > 0 ? Math.ceil(json.itemsCounter / ITEMS_PER_PAGE) : 0
      dispatch(receivePendingExams(list, pageCount))
    })
    .catch(console.error)
}

export const requestPendingExam = () => ({
  type: REQUEST_PENDING_EXAM
})

export const receivePendingExam = payload => ({
  type: RECEIVE_PENDING_EXAM,
  payload
})

export const fetchPendingExam = (user, day) => (dispatch, getState) => {
  dispatch(requestPendingExam())

  const {token} = getState().userToken

  return fetch(`${api}/user/userDayAdmin-get`, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({
      authToken: token ? token : cookie.load('token'),
      data: {user, day}
    })
  })
    .then(response => response.json())
    .then(json => dispatch(receivePendingExam(json.data[0])))
    .catch(console.error)
}

const switchExamStatus = status => (id, adminAnswer) => (dispatch, getState) => {
  const {token} = getState().userToken

  return fetch(`${api}/user/userDay-update`, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({
      authToken: token ? token : cookie.load('token'),
      data: {id, status, adminAnswer}
    })
  })
    .then(response => {
      const res = response.json()

      return res
    })
    .catch(console.error)
}

export const approveExam = switchExamStatus(EXAM_STATUS_APPROVE)
export const waitingExam = switchExamStatus(EXAM_STATUS_WAITING)
export const rejectExam = switchExamStatus(EXAM_STATUS_REJECT)
