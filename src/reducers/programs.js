import { SELECT_PROGRAMS, RECEIVE_PROGRAMS } from '../actions'

const programs = (state = {
  isFetching: false,
  didInvalidate: false,
  programs: {}
}, action) => {
  switch (action.type) {
    case RECEIVE_PROGRAMS:
      return {
        ...state,
        programs: action.json.data
      }
    default:
      return state
  }
}

export const selectedPrograms = (state = 'reactjs', action) => {
  switch (action.type) {
    case SELECT_PROGRAMS:
      return action.programs
    default:
      return state
  }
}

export const recivedPrograms = (state = {}, action) => {
  switch (action.type) {
    case RECEIVE_PROGRAMS:
      return {
        ...state,
        [action.programs]: programs(state[action.programs], action)
      }
    default:
      return state
  }
}
