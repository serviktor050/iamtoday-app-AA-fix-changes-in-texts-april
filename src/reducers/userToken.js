import {
  SET_SITE_SETTINGS
} from '../actions'

export function userToken(state = 'RETURN_ERROR', action) {
  switch (action.type) {
    case 'SET_TOKEN':
      return {
        token: action.token
      }
    default:
      return state
  }
}
export function siteSettings(state = {}, action) {
  switch (action.type) {
    case SET_SITE_SETTINGS:
      return {
        data: action.data
      }
    default:
      return state
  }
}