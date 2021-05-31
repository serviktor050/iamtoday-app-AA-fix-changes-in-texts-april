import {
  SELECT_PHOTOS, INVALIDATE_PHOTOS,
  REQUEST_PHOTOS, RECEIVE_PHOTOS
} from '../actions'

export const selectedPhotos = (state = 'reactjs', action) => {
  switch (action.type) {
    case SELECT_PHOTOS:
      return action.photos
    default:
      return state
  }
}

const photos = (state = {
  isFetching: false,
  didInvalidate: false,
  photos: {}
}, action) => {
  switch (action.type) {
    case INVALIDATE_PHOTOS:
      return {
        ...state,
        didInvalidate: true
      }
    case REQUEST_PHOTOS:
      return {
        ...state,
        isFetching: true,
        didInvalidate: false
      }
    case RECEIVE_PHOTOS:
      return {
        ...state,
        isFetching: false,
        didInvalidate: false,
        photos: action.json
      }
    default:
      return state
  }
}

export const recivedPhotos = (state = {}, action) => {
  switch (action.type) {
    case INVALIDATE_PHOTOS:
    case RECEIVE_PHOTOS:
    case REQUEST_PHOTOS:
      return {
        ...state,
        [action.photos]: photos(state[action.photos], action)
      }
    default:
      return state
  }
}
