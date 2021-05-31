import fetchDucks from "modules/FetchDucks";
import { makeActionCreator, makeAsyncActionCreator } from "../../utils";
import api from "../../utils/api";
import moment from "moment";

export const moduleName = "sales";

const { REQUEST, SUCCESS, ERROR, loading } = fetchDucks(moduleName);

export const GET_SALES_SUMMARY = `${moduleName}/GET_SALES_SUMMARY`;
export const GET_SALES_HISTORY = `${moduleName}/GET_SALES_HISTORY`;
export const GET_SALES_STRUCTURE = `${moduleName}/GET_SALES_STRUCTURE`;
export const SET_SALES_HISTORY_FILTER = `${moduleName}/SET_SALES_HISTORY_FILTER`;
export const SET_SALES_STRUCTURE_FILTER = `${moduleName}/SET_SALES_STRUCTURE_FILTER`;
export const GET_PLAY_LIST_GROUPS = `${moduleName}/GET_PLAY_LIST_GROUPS`;

export const getPlayListGroups = () =>
  makeAsyncActionCreator({
    apiCall: api.getPlayListGroups,
    actionName: GET_PLAY_LIST_GROUPS,
    moduleName,
    field: "modulesInfo",
    onSuccess: async (data, dispatch, getState) => {
      //const unReadMessage = data.filter((item) => !item.isRead).length;
      //await dispatch(setUnReadMessage(unReadMessage))
    },
  });

export const setSalesHistoryFilter = makeActionCreator(
  SET_SALES_HISTORY_FILTER,
  "data"
);

export const getSalesSummary = (request) =>
  makeAsyncActionCreator({
    apiCall: api.getSalesChildUser,
    actionName: GET_SALES_SUMMARY,
    data: request,
    moduleName,
    field: "salesSummary",
  });

export const getSalesStructure = (request) =>
  makeAsyncActionCreator({
    actionName: GET_SALES_STRUCTURE,
    data: request,
    moduleName,
    apiCall: async (data) => {
      const result = await api.getSalesStructure(data);
      if (result.data && result.data.data) {
        const data = result.data.data;
        result.data.data = {
          itemsCounter: result.data.itemsCounter,
          list: data,
        };
      }
      return result;
    },
    field: "salesStructure",
  });

export const getSalesHistory = (request) =>
  makeAsyncActionCreator({
    apiCall: api.getSalesUserPoints,
    actionName: GET_SALES_HISTORY,
    data: request,
    moduleName,
    field: "salesHistory",
  });

const today = moment();

// -----------profiles--------------

export const GET_PROFILES = `${moduleName}/GET_PROFILES`;
export const FILTER_PROFILES = `${moduleName}/FILTER_PROFILES`;
export const VERIFY_USER = `${moduleName}/VERIFY_USER`;
export const CLEAR_FILTER = `${moduleName}/CLEAR_FILTER`;

export const getProfiles = (data) => makeAsyncActionCreator({
  apiCall: api.getProfiles,
  actionName: GET_PROFILES,
  data,
  moduleName,
  field: 'profiles',
});

export const filterProfiles = (data) => makeAsyncActionCreator({
  apiCall: api.getProfiles,
  actionName: FILTER_PROFILES,
  data,
  moduleName,
  field: 'filteredProfiles',
});

export const verifyUser = (data) => makeAsyncActionCreator({
  apiCall: api.setUserVerified,
  actionName: VERIFY_USER,
  data,
  moduleName,
});

export const clearFilter = makeActionCreator(CLEAR_FILTER, 'data');

// -----------mentoring-------------

export const SAVE_STATE = `${moduleName}/SAVE_STATE`;
export const REMOVE_STATE = `${moduleName}/REMOVE_STATE`;
export const ADD_TUTOR = `${moduleName}/ADD_TUTOR`;
export const REMOVE_TUTOR = `${moduleName}/REMOVE_TUTOR`;
export const GET_USER_TUTORS_REQUEST = `${moduleName}/GET_USER_TUTORS_REQUEST`;
export const CLEAR_USER_TUTORS_REQUEST = `${moduleName}/CLEAR_USER_TUTOR_REQUEST`;
export const GET_TUTOR_INFO = `${moduleName}/GET_TUTOR_INFO`;
export const GET_USER_INFO = `${moduleName}/GET_USER_INFO`;
export const GET_TUTORS_LIST = `${moduleName}/GET_TUTORS_LIST`;
export const SET_CURRENT_TUTOR = `${moduleName}/SET_CURRENT_TUTOR`;
export const RECOMMEND_TUTOR_TO_STUDENT = `${moduleName}/RECOMMEND_TUTOR_TO_STUDENT`;
export const APPROVE_DECLINED_REQUEST = `${moduleName}/APPROVE_DECLINED_REQUEST`;
export const SET_NEW_TUTOR_FOR_STUDENT = `${moduleName}/SET_NEW_TUTOR_FOR_STUDENT`;
export const SEND_EMAIL = `${moduleName}/SEND_EMAIL`;
export const CHOOSE_NEW_TUTOR = `${moduleName}/CHOOSE_NEW_TUTOR`;
export const DELETE_REQUEST = `${moduleName}/DELETE_REQUEST`;

export const saveState = makeActionCreator(SAVE_STATE, "data");
export const addTutor = makeActionCreator(ADD_TUTOR, "data");
export const removeTutor = makeActionCreator(REMOVE_TUTOR, "data");
export const setCurrentTutor = makeActionCreator(SET_CURRENT_TUTOR, "data");
export const clearRequests = makeActionCreator(CLEAR_USER_TUTORS_REQUEST, 'data');


export const chooseNewTutor = (data, {onSuccess, onError}) => makeAsyncActionCreator({
  apiCall: api.chooseNewTutor,
  actionName: CHOOSE_NEW_TUTOR,
  data,
  moduleName,
  onSuccess,
  onError
})

export const getUserTutorsRequest = (request) =>
  makeAsyncActionCreator({
    apiCall: api.getUserTutorRequest,
    actionName: GET_USER_TUTORS_REQUEST,
    data: request,
    moduleName,
    field: "tutorRequests",
  });

export const getAcceptedUserTutorsRequest = (request) =>
  makeAsyncActionCreator({
    apiCall: api.getUserTutorRequest,
    actionName: GET_USER_TUTORS_REQUEST,
    data: request,
    moduleName,
    field: "tutorRequestsAccepted",
  });


export const getTutorsList = (request) =>
  makeAsyncActionCreator({
    apiCall: api.getTutorsList,
    actionName: GET_TUTORS_LIST,
    data: request,
    moduleName,
    field: "tutorsList",
  });

export const getTutorInfo = (data) => 
  makeAsyncActionCreator({
    apiCall: api.getTutorInfo,
    actionName: GET_TUTOR_INFO,
    data,
    moduleName,
    field: 'currentTutor'
  })

export const getUserInfo = (data) => 
  makeAsyncActionCreator({
    apiCall: api.getUserInfo,
    actionName: GET_USER_INFO,
    data,
    moduleName,
    field: 'currentStudent'
  })

export const recommendTutorToStudent = (request) =>
  makeAsyncActionCreator({
    apiCall: api.recommendTutorToStudent,
    actionName: RECOMMEND_TUTOR_TO_STUDENT,
    data: {
      userId: request.userId,
      status: "waiting_user",
      tutorUserId: request.tutorUserId,
    },
    moduleName,
  });

export const approveDeclinedRequest = ({ id, managerResponse }) =>
  makeAsyncActionCreator({
    apiCall: api.userTutorRequestUpdate,
    actionName: APPROVE_DECLINED_REQUEST,
    data: {
      id,
      status: "rejected_manager",
      managerResponse,
    },
    moduleName,
    field: "approvedDeclinedRequest",
  });

export const deleteRequestForChange = (id) => 
  makeAsyncActionCreator({
    apiCall: api.deleteRequest,
    actionName: DELETE_REQUEST,
    data: {
      id
    },
    moduleName,
    field: 'deleteRequest'
  })

export const setNewTutorForStudent = (
  { userId, id, tutorUserId },
  { onSuccess, onError }
) =>
  makeAsyncActionCreator({
    apiCall: api.userTutorRequestUpdate,
    actionName: SET_NEW_TUTOR_FOR_STUDENT,
    data: {
      id,
      status: "waiting_tutor",
      userId,
      tutorUserId,
    },
    moduleName,
    onSuccess,
    onError,
  });

export const sendEmail = (data, {onSuccess, onError}) => makeAsyncActionCreator({
  apiCall: api.sendEmail,
  actionName: SEND_EMAIL,
  data,
  moduleName,
  onSuccess,
  onError
})

// ---------questions-----------

export const GET_QUESTIONS = `${moduleName}/GET_QUESTIONS`;

export const getQuestions = (data) => makeAsyncActionCreator({
  apiCall: api.getQuestionsAdmin,
  actionName: GET_QUESTIONS,
  data,
  moduleName,
  field: 'questions',
})

// reducer

export const initialState = {
  salesHistoryFilter: {
    orderByField: "createTs",
    orderByDirection: "desc",
    dateStart: today.clone().subtract(7, "days").format("YYYY-MM-DD"),
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
    case SET_SALES_HISTORY_FILTER: {
      return {
        ...state,
        salesHistoryFilter: action.data,
      };
    }
    case SAVE_STATE: {
      return {
        ...state,
        declinedRequestsState: action.data,
      };
    }
    case REMOVE_STATE: {
      delete state.declinedRequestsState;
      return state;
    }
    case ADD_TUTOR: {
      return {
        ...state,
        declinedRequestsState: {
          ...state.declinedRequestsState,
          tutorsIds: [...state.declinedRequestsState.tutorsIds, action.data],
        },
      };
    }
    case REMOVE_TUTOR: {
      const { tutorsIds } = state.declinedRequestsState;
      const newTutorsIds = tutorsIds.filter((item) => item !== action.data);
      return {
        ...state,
        declinedRequestsState: {
          ...state.declinedRequestsState,
          tutorsIds: newTutorsIds,
        },
      };
    }
    case SET_CURRENT_TUTOR: {
      return {
        ...state,
        currentTutor: action.data,
      };
    }
    case CLEAR_USER_TUTORS_REQUEST: {
      return {
        ...state,
        tutorRequests: {
          ...state.tutorRequests,
          data: []
        }
      }
    }
    case CLEAR_FILTER: {
      return {
        ...state,
        filteredProfiles: null,
      }
    }
    default:
      return state;
  }
};
