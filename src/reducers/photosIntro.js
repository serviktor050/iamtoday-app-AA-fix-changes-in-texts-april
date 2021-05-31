import {
  SELECT_PHOTOS_INTRO, INVALIDATE_PHOTOS_INTRO,
  REQUEST_PHOTOS_INTRO, RECEIVE_PHOTOS_INTRO
} from '../actions'

export const selectedPhotosIntro = (state = 'reactjs', action) => {
  switch (action.type) {
    case SELECT_PHOTOS_INTRO:
      return action.photosIntro
    default:
      return state
  }
}
export const selectPhotoFaq = (state = {currentValue:'UserPhotoCaptionMan',content:{}}, action) => {
  switch (action.type) {
    case 'SELECT_PHOTO_FAQ':
      return {
        ...state,
        currentValue:action.value
      }
    case 'SET_CONTENT':
      return {
        ...state,
        content:action.content
      }
    default:
      return state
  }
}
const photosIntro = (state = {
  isFetching: false,
  didInvalidate: false,
  photosIntro: {}
}, action) => {
  switch (action.type) {
    case INVALIDATE_PHOTOS_INTRO:
      return {
        ...state,
        didInvalidate: true
      }
    case REQUEST_PHOTOS_INTRO:
      return {
        ...state,
        isFetching: true,
        didInvalidate: false
      }
    case RECEIVE_PHOTOS_INTRO:
      return {
        ...state,
        isFetching: false,
        didInvalidate: false,
        photosIntro: action.json
      }
    default:
      return state
  }
}

export const recivedPhotosIntro = (state = {}, action) => {
  switch (action.type) {
    case INVALIDATE_PHOTOS_INTRO:
    case RECEIVE_PHOTOS_INTRO:
    case REQUEST_PHOTOS_INTRO:
      return {
        ...state,
        [action.photosIntro]: photosIntro(state[action.photosIntro], action)
      }
    default:
      return state
  }
}
