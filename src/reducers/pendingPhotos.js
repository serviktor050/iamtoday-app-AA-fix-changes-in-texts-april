import {
  REQUEST_PENDING_PHOTO, RECEIVE_PENDING_PHOTO,
  REQUEST_PENDING_PHOTOS, RECEIVE_PENDING_PHOTOS
} from '../actions'

export const pendingPhoto = (state = {}, action) => {
  switch (action.type) {
    case REQUEST_PENDING_PHOTO:
      return {
        isFetching: true
      }
    case RECEIVE_PENDING_PHOTO:
      return {
        isFetching: false,
        ...action.payload
      }
    default:
      return state
  }
}

export const pendingPhotos = (state = {}, action) => {
  switch (action.type) {
    case REQUEST_PENDING_PHOTOS:
      return {
        isFetching: true
      }
    case RECEIVE_PENDING_PHOTOS:
      return {
        isFetching: false,
        list: action.payload,
        pageCount: action.pageCount
      }
    default:
      return state
  }
}
