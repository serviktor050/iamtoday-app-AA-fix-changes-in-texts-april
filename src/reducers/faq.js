import {
  RECEIVE_FAQ,
  RECEIVE_FAQ_ERROR,
  REQ_FAQ
} from '../actions'

const stateFaq = {
  isFetching: false,
  isLoad: false,
  isError: false,
  activeAccordionFaqItems: [21],
  data: {}
}
export const faq = (state = stateFaq, action) => {
  switch (action.type) {
    case REQ_FAQ:
      return {
        ...state,
        isLoad: false,
        isFetching: true,
        isError: false,
      }
    case RECEIVE_FAQ:
      return {
        ...state,
        isFetching: false,
        isLoad: true,
        isError: false,
        data: action.data
      }
    case RECEIVE_FAQ_ERROR:
      return {
        ...state,
        isLoad: false,
        isFetching: false,
        isError: true,
      }
    case 'ADD_ACCORDION_FAQ_ITEM':
      return {
        ...state,
        activeAccordionFaqItems: state.activeAccordionFaqItems.concat([action.item])
      }
    case 'DELETE_ACCORDION_FAQ_ITEM':
      return {
        ...state,
        activeAccordionFaqItems: state.activeAccordionFaqItems.filter(function(i) {
        return i !== action.item
      })
      }
    default:
      return state
  }
}
