import {
  RECEIVE_PROMO
} from '../actions'

export const promoForYou = (state = {}, action) => {
  switch (action.type) {
    case RECEIVE_PROMO:
      return action.json.data
    default:
      return state
  }
}

export const showPromos = (state = false, action) => {
  switch (action.type) {
    case 'SHOW_PROMOS':
      return action.showPromos
    default:
      return state
  }
}
