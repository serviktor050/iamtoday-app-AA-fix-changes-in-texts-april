import {
  SET_HOST,
  RECEIVE_FINAL_STEPS,
  REQ_FINAL_STEPS,
  SET_SIMPLE_REGS,
  RECEIVE_FINAL_STEPS_ERROR,
  SET_PAY_WEEKLY
} from '../actions'

const initialState = {
  host: 'default',
  isError: false,
  payWeekly: false,
  isLoading: false,
  isRegistered: false,
  isSimpleRegs: false,
  finalSteps:[],
  isLoadingLang: false,
}

export const sign = (state = initialState, action) => {
  switch (action.type) {
    case 'REQ_GET_LANG':
      return {
        isLoadingLang: true,
      }
    case 'SET_LANG':
      return {
        isLoadingLang: false,
      }
    case 'SET_AUTH':
      return {
        ...state,
        isRegistered: action.data
      }
    case SET_PAY_WEEKLY:
      return {
        ...state,
        payWeekly: action.data
      }
    case REQ_FINAL_STEPS:
      return {
        ...state,
        isLoading: true
      }
    case RECEIVE_FINAL_STEPS:
      return {
        ...state,
        finalSteps: action.data,
        isLoading: false,
        isError: false
      }
    case RECEIVE_FINAL_STEPS_ERROR:
      return {
        ...state,
        isLoading: false,
        isError: true
      }
    case SET_HOST:
      return {
        ...state,
        host: action.host
      }
    case SET_SIMPLE_REGS:
      return {
        ...state,
        isSimpleRegs: action.data
      }
    default:
      return state
  }
}

