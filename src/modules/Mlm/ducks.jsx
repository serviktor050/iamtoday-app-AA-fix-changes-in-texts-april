import fetchDucks from "modules/FetchDucks";
import { makeActionCreator, makeAsyncActionCreator } from "../../utils";
import api from "../../utils/api";
import { declineTutorRequest } from 'utils/api';
import moment from "moment";
import { loadStripe } from "@stripe/stripe-js";
import {SUCCESS_MODAL_TEXT, UNSUCCESS_MODAL_TEXT} from './MlmPoints/WithdrawalPoints'
export const stripePromise = loadStripe("pk_live_hsgjIbfXIBRCR1TreG1LOOlA");
// import stripePromise from '../Buy/ducks'

export const moduleName = "mlm";

const { REQUEST, SUCCESS, ERROR, loading } = fetchDucks(moduleName);

export const GET_MLM_MENTORSHIP_REQUESTS = `${moduleName}/GET_MLM_MENTORSHIP_REQUESTS`;
export const GET_MLM_SUMMARY = `${moduleName}/GET_MLM_SUMMARY`;
export const GET_MLM_HISTORY = `${moduleName}/GET_MLM_HISTORY`;
export const GET_MLM_STRUCTURE = `${moduleName}/GET_MLM_STRUCTURE`;
export const GET_MLM_STATISTIC = `${moduleName}/GET_MLM_STATISTIC`;
export const GET_MLM_STATISTIC_WITH_TREE = `${moduleName}/GET_MLM_STATISTIC_WITH_TREE`;
export const GET_MLM_STATISTIC_MY_GROUP = `${moduleName}/GET_MLM_STATISTIC_MY_GROUP`;
export const SET_MLM_HISTORY_FILTER = `${moduleName}/SET_MLM_HISTORY_FILTER`;
export const SET_MLM_STRUCTURE_FILTER = `${moduleName}/SET_MLM_STRUCTURE_FILTER`;
export const SEND_PAYMENT = `${moduleName}/SEND_PAYMENT`;
export const WITHDRAW_POINT = `${moduleName}/WITHDRAW_POINTS`;
export const DECLINE_TUTOR_REQUEST = `${moduleName}/DECLINE_TUTOR_REQUEST`;
export const ACCEPT_TUTOR_REQUEST = `${moduleName}/ACCEPT_TUTOR_REQUEST`;
export const GET_NEW_MENTORSHIP_REQUESTS = `${moduleName}/GET_NEW_MENTORSHIP_REQUESTS`;
export const GET_TUTOR_INFO = `${moduleName}/GET_TUTOR_INFO`;
export const CREATE_REQUEST_TO_CHANGE_TUTOR = `${moduleName}/CREATE_REQUEST_TO_CHANGE_TUTOR`;
export const GET_REQUESTS = `${moduleName}/GET_REQUESTS`;
export const SET_USER_PHOTO = `${moduleName}/SET_USER_PHOTO`;
export const SET_MODAL_TEXT = `${moduleName}/SET_MODAL_TEXT`;
export const GET_MLM_MINE_ORDERS_HISTORY = `${moduleName}/GET_MLM_MINE_ORDERS_HISTORY`;
export const SET_1LEVEL_USERS = `${moduleName}/SET_1LEVEL_USERS`;

export const getMineOrdersHistory = data =>
  makeAsyncActionCreator({
    actionName: GET_MLM_MINE_ORDERS_HISTORY,
    apiCall: api.getMineOrdersHistory,
    field: "mlmMineOrdersHistory",
    moduleName,
    data,
  });

export const setMlmHistoryFilter = makeActionCreator(SET_MLM_HISTORY_FILTER, 'data');
export const setUserPhoto = makeActionCreator(SET_USER_PHOTO, 'data');
export const setModalText = makeActionCreator(SET_MODAL_TEXT, 'data');
export const set1LevelUsers = makeActionCreator(SET_1LEVEL_USERS);

export const acceptMentorRequest = (data, onSuccess, onError) =>
  makeAsyncActionCreator({
    actionName: ACCEPT_TUTOR_REQUEST,
    apiCall: api.acceptTutorRequest,
    moduleName,
    onSuccess,
    onError,
    data,
  });

export const declineMentorRequest = data =>
  makeAsyncActionCreator({
    actionName: DECLINE_TUTOR_REQUEST,
    apiCall: api.declineTutorRequest,
    moduleName,
    data,
  });

export const getMlmSummary = (request) =>
  makeAsyncActionCreator({
    apiCall: api.getMlmChildUser,
    actionName: GET_MLM_SUMMARY,
    data: request,
    moduleName,
    field: "mlmSummary",
  });

export const getMentorshipRequests = data =>
  makeAsyncActionCreator({
    actionName: GET_MLM_MENTORSHIP_REQUESTS,
    apiCall: api.getMentorshipRequests,
    field: "mentorshipRequests",
    moduleName,
    data,
  });

export const getNewMentorshipRequests = data => makeAsyncActionCreator({
  actionName: GET_NEW_MENTORSHIP_REQUESTS,
  apiCall: api.getMentorshipRequests,
    field: "newMentorshipRequests",
    moduleName,
    data,
})

export const getMlmStatisticData = (request) =>
  makeAsyncActionCreator({
    actionName: GET_MLM_STATISTIC,
    data: request,
    moduleName,
    apiCall: async (data) => {
      const result = await api.getMlmStatistic(data);
      if (result.data && result.data.data) {
        const data = result.data.data;
        result.data.data = {
          itemsCounter: result.data.itemsCounter,
          users: data.users,
          spending: data.spending,
          parentUserInfo: data.parentUserInfo,
          grandparentUserInfo: data.grandparentUserInfo
        };
      }
      return result;
    },
    field: "mlmStatistic",
  });


  export const getMlmStatisticDataWithTree = (request) =>
  makeAsyncActionCreator({
    actionName: GET_MLM_STATISTIC_WITH_TREE,
    data: { ...request, childTree: true },
    moduleName,
    apiCall: async (data) => {
      const result = await api.getMlmStatistic(data);
      if (result.data && result.data.data) {
        const data = result.data.data;
        result.data.data = {
          itemsCounter: result.data.itemsCounter,
          users: data.users,
          spending: data.spending,
          //grandparent: data.grandparentUserInfo
        };
      }
      return result;
    },
    field: "mlmStatisticTree"
  });

  export const getMlmStatisticMyGroup = (request) =>
  makeAsyncActionCreator({
    actionName: GET_MLM_STATISTIC_MY_GROUP,
    data: { ...request, childTree: false },
    moduleName,
    apiCall: async (data) => {
      const result = await api.getMlmStatistic(data);
      if (result.data && result.data.data) {
        const data = result.data.data;
        result.data.data = {
          itemsCounter: result.data.itemsCounter,
          users: data.users,         
        };
      }
      return result;
    },
    field: "mlmStatisticMyGroup",
  });


export const sendPayment = (data, flag) =>
  makeAsyncActionCreator({
    apiCall: api.sendPayment,
    actionName: SEND_PAYMENT,
    moduleName,
    data: { data, flag },
    field: "payment",
    onSuccess: async (data, dispatch, getState) => {
      const confirmationUrl = data.data.confirmationUrl;
      if (flag === "yandex") {
        window.location.href = confirmationUrl;
      } else if (flag === "stripe") {
        const stripe = await stripePromise;
        const { error } = await stripe.redirectToCheckout({
          sessionId: confirmationUrl,
        });
        console.log(error);
      }
    },
  });

export const withdrawPoints = (data) =>
  makeAsyncActionCreator({
    apiCall: api.createWithdrawRequest,
    actionName: WITHDRAW_POINT,
    moduleName,
    data: data,
    field: 'withdrawal'
  });

export const getMlmStructure = (request) =>
  makeAsyncActionCreator({
    actionName: GET_MLM_STRUCTURE,
    data: request,
    moduleName,
    apiCall: async (data) => {
      const result = await api.getMlmStructure(data);
      if (result.data && result.data.data) {
        const data = result.data.data;
        result.data.data = {
          itemsCounter: result.data.itemsCounter,
          list: data,
        };
      }
      return result;
    },
    field: "mlmStructure",
  });

export const getMlmHistory = (request) =>
  makeAsyncActionCreator({
    apiCall: api.getMlmUserPoints,
    actionName: GET_MLM_HISTORY,
    data: request,
    moduleName,
    field: "mlmHistory",
});

export const getTutorInfo = (data) => 
  makeAsyncActionCreator({
    apiCall: api.getTutorInfo,
    actionName: GET_TUTOR_INFO,
    data,
    moduleName,
    field: 'currentTutor'
  })

export const createRequestToChangeTutor = (data, onSuccess, onError) => 
  makeAsyncActionCreator({
    apiCall: api.recommendTutorToStudent,
    actionName: CREATE_REQUEST_TO_CHANGE_TUTOR,
    data,
    moduleName,
    onSuccess,
    onError
  })

export const getOutcommingRequests = (data) => 
  makeAsyncActionCreator({
    apiCall: api.getUserOutcommingRequest,
    actionName: GET_REQUESTS,
    data,
    moduleName,
    field: 'outcommingRequests'
  })

const today = moment();

export const initialState = {
  mlmHistoryFilter: {
    orderByField: "createTs",
    orderByDirection: "desc",
    dateStart: "2020-01-01",
    dateEnd: today.format("YYYY-MM-DD"),
    historyType: "all",
  },
};

export const reducer = (state = initialState, action) => {
    if (~action.type.indexOf(REQUEST) || ~action.type.indexOf(SUCCESS) || ~action.type.indexOf(ERROR)) {
        return {
            ...state,
            [action.field]: loading(state[action.field], action),
        }
    }
    switch (action.type) {
        case SET_MLM_HISTORY_FILTER: {
            return {
                ...state,
                mlmHistoryFilter: action.data
            }
        }
        case SET_USER_PHOTO: {
            return {
                ...state,
                photo: action.data
            }
        }

        case SET_1LEVEL_USERS: {
          const users = state.mlmStatisticTree.data.users.filter(user => user.mlmUserInfo.childLevel === 1)
          return {
            ...state,
            level1Users: users
          }
        }

        default:
            return state;
  }
};
