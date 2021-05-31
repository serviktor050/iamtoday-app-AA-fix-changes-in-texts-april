import cookie from 'react-cookie'
import { api } from '../config.js'

export const REQUEST_PHOTOS = 'REQUEST_PHOTOS'
export const RECEIVE_PHOTOS = 'RECEIVE_PHOTOS'
export const SELECT_PHOTOS = 'SELECT_PHOTOS'
export const INVALIDATE_PHOTOS = 'INVALIDATE_PHOTOS'

export const selectPhotos = photos => ({
  type: SELECT_PHOTOS,
  photos
})

export const invalidatePhotos = photos => ({
  type: INVALIDATE_PHOTOS,
  photos
})

export const requestPhotos = photos => ({
  type: REQUEST_PHOTOS,
  photos
})

export const receivePhotos = (photos, json) => {
  return ({
    type: RECEIVE_PHOTOS,
    photos,
    json,
    receivedAt: Date.now()
  })
}

const fetchPhotos = partialState => dispatch => {
  const { token, photos } = partialState
  dispatch(requestPhotos(photos))
  let payload = {
    authToken: token ? token : cookie.load('token'),
    data: {
			season: cookie.load('currentSeason') ? parseInt(cookie.load('currentSeason')) : 0,
    }
  }

  let data = new FormData()
  data.append('json', JSON.stringify(payload))
  return fetch(`${api}/user/userPhoto-get`, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify(payload)
  })
  .then(response => response.json())
  .then(json => {
    dispatch(receivePhotos(photos, json))
  })
}

const shouldFetchPhotos = (state, photos) => {
  const ph = state.photos

  if (!ph) {
    return true
  }

  if (ph.isFetching) {
    return false
  }

  return ph.didInvalidate
}

export const fetchPhotosIfNeeded = photos => (dispatch, getState) => {
  if (shouldFetchPhotos(getState(), photos)) {
    return dispatch(fetchPhotos({
      token: getState().userToken.token,
      photos,
      selectedDayDate: getState().selectedDayDate,
      selectedDayId: getState().selectedDayId
    }))
  }
}
