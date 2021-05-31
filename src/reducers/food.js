import {
  SELECT_FOOD, INVALIDATE_FOOD,
  REQUEST_FOOD, RECEIVE_FOOD
} from '../actions'

export const foodTab = (state = 0, action) => {
  switch (action.type) {
    case 'CHANGE_FOOD_TAB':
      return action.tab
    default:
      return state
  }
}

export const foodProgram = (state = '', action) => {
  switch (action.type) {
    case 'FOOD_PROGRAM':
      return action.program
    default:
      return state
  }
}

export const foodDescription = (state = '', action) => {
  switch (action.type) {
    case 'FOOD_DESCRIPTION':
      return action.description
    default:
      return state
  }
}

export const selectedFood = (state = 'reactjs', action) => {
  switch (action.type) {
    case SELECT_FOOD:
      return action.json
    default:
      return state
  }
}

const food = (state = {
  isFetching: false,
  didInvalidate: false,
  load:false,
  food: []
}, action) => {
  switch (action.type) {
    case INVALIDATE_FOOD:
      return {
        ...state,
        didInvalidate: true,
          load:false
      }
    case REQUEST_FOOD:
      return {
        ...state,
        isFetching: true,
        load:false,
        didInvalidate: false
      }
    case RECEIVE_FOOD:
      return {
        ...state,
        isFetching: false,
        didInvalidate: false,
        load:true,
        food: action.json.data
      }
    default:
      return state
  }
}

export const recivedFood = (state = {}, action) => {
  switch (action.type) {
    case INVALIDATE_FOOD:
    case RECEIVE_FOOD:
    case REQUEST_FOOD:
      return {
        ...state,
        [action.food]: food(state[action.food], action)
      }
    default:
      return state
  }
}
const stateFood = {
  data:{},
  load:false,
  isFetch:false
}

export const foodData = (state = stateFood, action) => {
    switch (action.type) {
        case 'REQ_FOOD':
          return {
              ...state,
              load:false,
              isFetch:true
          }
        case 'GET_FOOD':
            return {
                ...state,
                load:true,
                isFetch:false,
                data:action.data
            }
        default:
            return state
    }
}

