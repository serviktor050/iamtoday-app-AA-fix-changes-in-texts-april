import {
  SELECT_REPORTS, INVALIDATE_REPORTS,
  REQUEST_REPORTS, RECEIVE_REPORTS
} from '../actions'

export const selectedReports = (state = 'reactjs', action) => {
  switch (action.type) {
    case SELECT_REPORTS:
      return action.reports
    default:
      return state
  }
}

export const activeAccordionItems = (state = [], action) => {
  switch (action.type) {
    case 'ADD_ACCORDION_ITEM':
      return state.concat([action.item])
    case 'DELETE_ACCORDION_ITEM':
      return state.filter(function(i) {
        return i !== action.item
      })
    default:
      return state
  }
}

const reports = (state = {
  isFetching: false,
  didInvalidate: false,
  reports: {}
}, action) => {
  switch (action.type) {
    case INVALIDATE_REPORTS:
      return {
        ...state,
        didInvalidate: true
      }
    case REQUEST_REPORTS:
      return {
        ...state,
        isFetching: true,
        didInvalidate: false
      }
    case RECEIVE_REPORTS:

      return {
        ...state,
        isFetching: false,
        didInvalidate: false,
        reports: action.json.data
      }
    default:
      return state
  }
}

export const recivedReports = (state = {}, action) => {
  switch (action.type) {
    case INVALIDATE_REPORTS:
    case RECEIVE_REPORTS:
    case REQUEST_REPORTS:
      return {
        ...state,
        [action.reports]: reports(state[action.reports], action)
      }
    default:
      return state
  }
}
