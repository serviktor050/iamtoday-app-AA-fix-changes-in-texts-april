import {
  SELECT_TASKDAY, INVALIDATE_TASKDAY,
  REQUEST_TASKDAY, RECEIVE_TASKDAY
} from '../actions'
import moment from 'moment'

export const activeItems = (state = [], action) => {
  switch (action.type) {
    case 'ADD_EXERCISE_ITEM':
      return state.concat([action.item])
    case 'DELETE_EXERCISE_ITEM':
      return state.filter(function(i) {
        return i !== action.item
      })
    default:
      return state
  }
}

export const showMobileLeftMenu = (state = false, action) => {
  switch (action.type) {
    case 'SHOW_LEFT_MENU':
      return action.show
    default:
      return state
  }
}

export const showFull = (state = true, action) => {
  switch (action.type) {
    case 'SHOW_FULL_CONTENT':
      return action.isFull
    default:
      return state
  }
}

export const calendarOffset = (state = 0, action) => {
  switch (action.type) {
    case 'DECREASE_OFFSET':
      return action.todayIndex > 0
        ? action.calendarOffset - 7
        : action.calendarOffset
    case 'INCREASE_OFFSET':
      return action.todayIndex < action.length - 7 ? action.calendarOffset + 7 : action.calendarOffset
    case 'SET_OFFSET_ZERO':
      return 0
    default:
      return state
  }
}

export const selectField = (state = {}, action) => {
  switch (action.type) {
    case 'SELECT_FIELD':
      return {
        ...state,
        [action.id]: action.selectField
      };
    default:
      return state
  }
}

export const isVisible = (state = false, action) => {
  switch (action.type) {
    case 'LITTLE_HEADER_MENU':
      return action.isVisible
    default:
      return state
  }
}

export const pollWasSend = (state = [], action) => {
  switch (action.type) {
    case 'POLL_WAS_SEND':
      return [ ...state, action.pollWasSend ]
    default:
      return state
  }
}

export const selectedTaskDay = (state = 'reactjs', action) => {
  switch (action.type) {
    case SELECT_TASKDAY:
      return action.taskDay
    default:
      return state
  }
}

export const selectedDayDate = (state = moment().format('YYYY-MM-DD'), action) => {
  switch (action.type) {
    case 'SELECT_DAY_DATE':
      return action.date
    default:
      return state
  }
}

export const selectedDayId = (state = '', action) => {
  switch (action.type) {
    case 'SELECT_DAY_ID':
      return action.id
    default:
      return state
  }
}

const taskDay = (state = {
  isFetching: false,
  didInvalidate: false,
  taskDay: {}
}, action) => {
  switch (action.type) {
    case INVALIDATE_TASKDAY:
      return {
        ...state,
        didInvalidate: true
      }
    case REQUEST_TASKDAY:
      return {
        ...state,
        isFetching: true,
        didInvalidate: false
      }
    case RECEIVE_TASKDAY:
      return {
        ...state,
        isFetching: false,
        didInvalidate: false,
        taskDay: {
          ...action.json,
        },
        lastUpdated: action.receivedAt
      }
    case 'CALENDAR_PREV':
      return
    case 'CALENDAR_NEXT':
      return
    default:
      return state
  }
}

export const recivedTaskDay = (state = {}, action) => {
  switch (action.type) {
    case INVALIDATE_TASKDAY:
    case RECEIVE_TASKDAY:
    case REQUEST_TASKDAY:
      return {
        ...state,
        [action.taskDay]: taskDay(state[action.taskDay], action)
      }
    default:
      return state
  }
}
const stateTaskDay = {
  isFetching: false,
  isLoad:false,
  dayData:{}
}

export const taskDayData = (state = stateTaskDay, action) =>{
  switch (action.type) {
    case 'REQ_TASK_DAY':
      return {
        ...state,
        isLoad:false,
        isFetching: true
      }

    case 'GET_TASK_DAY':
      return {
        ...state,
        isFetching: false,
        isLoad:true,
        dayData:action.data
      }

    default:
      return state
  }
}
