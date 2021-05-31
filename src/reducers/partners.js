import {
  REQ_PARTNERS,
  RECEIVE_PARTNERS,
  RECEIVE_PARTNERS_ERROR,
} from '../actions'

const statePartners = {
  isFetching: false,
  isLoad: false,
  isError: false,
  data: []
}
export const partners = (state = statePartners, action) => {
  switch (action.type) {
    case REQ_PARTNERS:
      return {
        ...state,
        isLoad: false,
        isFetching: true,
        isError: false,
      }
    case RECEIVE_PARTNERS:
      return {
        ...state,
        isFetching: false,
        isLoad: true,
        isError: false,
        data: action.data
      }
    case RECEIVE_PARTNERS_ERROR:
      return {
        ...state,
        isLoad: false,
        isFetching: false,
        isError: true,
      }
    default:
      return state
  }
}
