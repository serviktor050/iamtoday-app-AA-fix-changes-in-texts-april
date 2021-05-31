import {
  REQUEST_PENDING_PROFILE, RECEIVE_PENDING_PROFILE,
  REQUEST_PENDING_PROFILES, RECEIVE_PENDING_PROFILES,

  REQUEST_PENDING_INSURANCE_PROFILE, RECEIVE_PENDING_INSURANCE_PROFILE,
  REQUEST_PENDING_INSURANCE_PROFILES, RECEIVE_PENDING_INSURANCE_PROFILES
} from '../actions'

export const pendingProfile = (state = {}, action) => {
  switch (action.type) {
    case REQUEST_PENDING_PROFILE:
    case REQUEST_PENDING_INSURANCE_PROFILE:
      return {
        isFetching: true
      }
    case RECEIVE_PENDING_PROFILE:
    case RECEIVE_PENDING_INSURANCE_PROFILE:
      return {
        isFetching: false,
        ...action.payload
      }
    default:
      return state
  }
}

export const pendingProfiles = (state = {}, action) => {
  switch (action.type) {
    case REQUEST_PENDING_PROFILES:
    case REQUEST_PENDING_INSURANCE_PROFILES:
      return {
        isFetching: true
      }
    case RECEIVE_PENDING_PROFILES:
    case RECEIVE_PENDING_INSURANCE_PROFILES:
      return {
        isFetching: false,
        list: action.payload
      }
    default:
      return state
  }
}
