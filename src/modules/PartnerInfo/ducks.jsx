import fetchDucks from "modules/FetchDucks";
import { makeAsyncActionCreator, makeActionCreator } from "../../utils";
import api from "../../utils/api";
import moment from "moment";

export const moduleName = "partnerInfo";
const today = moment();

const { REQUEST, SUCCESS, ERROR, loading } = fetchDucks(moduleName);

export const GET_MLM_STATISTIC = `${moduleName}/GET_MLM_STATISTIC`;
export const GET_PARTNER_INFO = `${moduleName}/GET_PARTNER_INFO`;
export const SET_MLM_PARTNER_FILTER = `${moduleName}/SET_MLM_HISTORY_FILTER`;

export const getPartnerInfo = (request) =>
  makeAsyncActionCreator({
    //apiCall: api.getMlmChildUser,
    apiCall: api.getMlmUserPoints,
    actionName: GET_PARTNER_INFO,
    data: request,
    moduleName,
    field: "partnerInfo",
  });

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
        };
      }
      return result;
    },
    field: "mlmStatistic",
  });
export const setMlmPartnerFilter = makeActionCreator(
  SET_MLM_PARTNER_FILTER,
  "data"
);

// Reducer
export const initialState = {
  mlmPartnerFilter: {
    orderByField: "createTs",
    orderByDirection: "desc",
    dateStart: today.clone().subtract(30, "days").format("YYYY-MM-DD"),
    dateEnd: today.format("YYYY-MM-DD"),
    historyType: "all",
  },
};

export const reducer = (state = initialState, action) => {
  if (
    ~action.type.indexOf(REQUEST) ||
    ~action.type.indexOf(SUCCESS) ||
    ~action.type.indexOf(ERROR)
  ) {
    return {
      ...state,
      [action.field]: loading(state[action.field], action),
    };
  }
  switch (action.type) {
    case SET_MLM_PARTNER_FILTER: {
      return {
        ...state,
        mlmPartnerFilter: action.data,
      };
    }

    default:
      return state;
  }
};
