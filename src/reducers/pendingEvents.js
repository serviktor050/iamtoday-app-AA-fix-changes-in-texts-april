import {
  REQUEST_PENDING_EXAM, RECEIVE_PENDING_EXAM,
  REQUEST_PENDING_EXAMS, RECEIVE_PENDING_EXAMS
} from '../actions'

export const pendingEvent = (state = {}, action) => {
  switch (action.type) {
    case REQUEST_PENDING_EXAM:
      return {
        isFetching: true
      }
    case RECEIVE_PENDING_EXAM:
      return {
        isFetching: false,
        ...action.payload
      }
    default:
      return state
  }
}

export const pendingEvents = (state = {}, action) => {
  switch (action.type) {
    case REQUEST_PENDING_EXAMS:
      return {
        isFetching: true
      }
    case RECEIVE_PENDING_EXAMS:
      return {
        isFetching: false,
        list: action.payload,
        pageCount: action.pageCount
      }
    default:
      return state
  }
}
