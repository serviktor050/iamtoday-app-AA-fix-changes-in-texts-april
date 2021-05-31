import cookie from 'react-cookie'
import { api } from '../config.js'

export const REQUEST_PROFILE = 'REQUEST_PROFILE'
export const RECEIVE_PROFILE = 'RECEIVE_PROFILE'
export const SELECT_PROFILE = 'SELECT_PROFILE'
export const INVALIDATE_PROFILE = 'INVALIDATE_PROFILE'
export const TOOGLE_FORM = 'TOOGLE_FORM'
export const SET_CHECK_INS = 'SET_CHECK_INS'
export const REQUEST_SOC_LINK = 'REQUEST_SOC_LINK'

export const signUpTele2 = () => ({
  type: 'SIGN_UP_TELE2'
})
export const checkABTest = () => ({
  type: 'SETABTEST'
})
export const removeABTest = () => ({
  type: 'REMOVEABTEST'
})
export const selectProfile = profileData => ({
  type: SELECT_PROFILE,
  profileData
})
export const toggleForm = data => ({
  type: TOOGLE_FORM,
  data
})
export const setCheckIns = data => ({
  type: SET_CHECK_INS,
  data
})
export const invalidateProfile = profileData => ({
  type: INVALIDATE_PROFILE,
  profileData
})

export const requestProfile = profileData => ({
  type: REQUEST_PROFILE,
  profileData
})
export const showInfoBlockAction = boolean => ({
  type: 'SHOW_INFO_BLOCK',
  showInfoBlock: boolean
})
export const setUserProfile = data => ({
  type: 'USER_INFO',
  data: data
})
export const receiveProfile = (profileData, json) => {
  return ({
    type: RECEIVE_PROFILE,
    profileData,
    json
  })
}

export const fetchProfile = partialState => dispatch => {
  const { profileData } = partialState
  dispatch(requestProfile(profileData))
  const payload = {
    authToken: cookie.load('token'),
    data: {
      //withWorkTeams: true,
			season: cookie.load('currentSeason') ? cookie.load('currentSeason') : 0,
      withExtendedUserInfo: true
    }
  }

  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }

  const method = 'POST'

  return fetch(`${api}/user/user-get`, {
    headers,
    method,
    body: JSON.stringify(payload)
  })
  .then(response => response.json())
  .then(json => {
    dispatch(receiveProfile(profileData, json))
    dispatch({type:'USER_INFO', data:json.data[0]})
  })
}

const shouldFetchProfile = (state, profileData) => {
  const prof = state.profileData

  if (!prof) {
    return true
  }

  if (prof.isFetching) {
    return false
  }

  return prof.didInvalidate
}

export const fetchProfileIfNeeded = profileData => (dispatch, getState) => {
  if (shouldFetchProfile(getState(), profileData)) {
    return dispatch(fetchProfile({ profileData }))
  }
}
export const requestSocLink = () => ({
  type: REQUEST_SOC_LINK,
})
export const sendLink = data => dispatch => {

  dispatch(requestSocLink())
  const payload = {
    authToken: cookie.load('token'),
    data
  };

  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };

  const method = 'POST';

  return fetch(`${api}/user/socTaskReport-create`, {
    headers,
    method,
    body: JSON.stringify(payload)
  })
    .then(response => response.json())
    .then(json => {
      //dispatch(receiveProfile({}, json))
    })
}

