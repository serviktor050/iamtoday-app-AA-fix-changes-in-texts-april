import {
  SELECT_PAYMENT, INVALIDATE_PAYMENT,
  REQUEST_PAYMENT, RECEIVE_PAYMENT
} from '../actions'

export const selectedPayment = (state = 'reactjs', action) => {
  switch (action.type) {
    case SELECT_PAYMENT:
      return action.payment
    default:
      return state
  }
}

export const paymentType = (state = 'ya', action) => {
  switch (action.type) {
    case 'PAYMENT_TYPE':
      return action.paymentType
    default:
      return state
  }
}

const payment = (state = {
  isFetching: false,
  didInvalidate: false,
  payment: {}
}, action) => {
  switch (action.type) {
    case INVALIDATE_PAYMENT:
      return {
        ...state,
        didInvalidate: true
      }
    case REQUEST_PAYMENT:
      return {
        ...state,
        isFetching: true,
        didInvalidate: false
      }
    case RECEIVE_PAYMENT:
      return {
        ...state,
        isFetching: false,
        didInvalidate: false,
        payment: action.json,
        lastUpdated: action.receivedAt
      }
    default:
      return state
  }
}

export const recivedPayment = (state = {}, action) => {
  switch (action.type) {
    case INVALIDATE_PAYMENT:
    case RECEIVE_PAYMENT:
    case REQUEST_PAYMENT:
      return {
        ...state,
        [action.payment]: payment(state[action.payment], action)
      }
    default:
      return state
  }
}

