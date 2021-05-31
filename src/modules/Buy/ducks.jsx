import { makeActionCreator, makeAsyncActionCreator } from 'utils';
import fetchDucks from 'modules/FetchDucks';
import api from 'utils/api';
import { loadStripe } from '@stripe/stripe-js';
export const stripePromise = loadStripe('pk_live_hsgjIbfXIBRCR1TreG1LOOlA');

export const moduleName = 'buy';

const {
  REQUEST,
  SUCCESS,
  ERROR,
  loading,
} = fetchDucks(moduleName);

export const ADD_TO_CART = `${moduleName}/ADD_TO_CART`;
export const SEND_PAYMENT = `${moduleName}/SEND_PAYMENT`;
export const GET_COST = `${moduleName}/GET_COST`;
export const CLEAR_CART = `${moduleName}/CLEAR_CART `;
export const GET_MLM_HISTORY = `${moduleName}/GET_MLM_HISTORY`;
export const CREATE_PERSONAL_ITEM_COST = `${moduleName}/CREATE_PERSONAL_ITEM_COST`

// Action Creators
export const addToCart = makeActionCreator(ADD_TO_CART, 'data');
export const clearCart = makeActionCreator(CLEAR_CART);

export const getCost = (data) => makeAsyncActionCreator({
  apiCall: api.getCost,
  actionName: GET_COST,
  moduleName,
  data: data,
  field: 'costList',
  // onSuccess: async (data, dispatch, getState) => {
  //   console.log(data)
  //   console.log(window.location)
  //   debugger
  //   window.location.href = data.data.confirmationUrl;
  // }
});

export const getUserPoints = (request) => makeAsyncActionCreator({
    apiCall: api.getMlmUserPoints,
    actionName: GET_MLM_HISTORY,
    data: request,
    moduleName,
    field: "userPoints",
});

export const sendPayment = (data, flag, returnUrl) => makeAsyncActionCreator({
  apiCall: api.sendPayment,
  actionName: SEND_PAYMENT,
  moduleName,
  data: { data, flag },
  field: 'payment',
  onSuccess: async (data, dispatch, getState) => {
    const confirmationUrl = data.data.confirmationUrl;
    if (flag === 'yandex') {
      window.location.href = confirmationUrl;
    } else if (flag === 'stripe') {
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({
        sessionId: confirmationUrl,
      });
      console.log(error)
    } else if (flag === 'points') {
      window.location.href = returnUrl
    }
  }
});

export const createPersonalItemCost = (data) => makeAsyncActionCreator({
  apiCall: api.createPersonalItemCost,
  actionName: CREATE_PERSONAL_ITEM_COST,
  moduleName,
  data,
})

// Reducer /////
export const initialState = {
  cart: []
};

export const reducer = (state = initialState, action) => {
  if (~action.type.indexOf(REQUEST) || ~action.type.indexOf(SUCCESS) || ~action.type.indexOf(ERROR)) {
    return {
      ...state,
      [action.field]: loading(state[action.field], action),
    }
  }

  switch (action.type) {
    case CLEAR_CART:
      return{
        ...state,
        cart: []
      };
    case ADD_TO_CART:{
      let cart = state.cart;
      if (action.data.removeChat) {
        cart = cart.filter((item) => item.itemType !== 3);
      } else {
        const product = cart.find((item) => item.itemType === action.data.itemType && item.itemId === action.data.itemId)

        if (!product) {
          cart = cart.concat(action.data);
        }
      }

      return {
        ...state,
        cart
      }
    }
    default:
      return state;
  }
};
