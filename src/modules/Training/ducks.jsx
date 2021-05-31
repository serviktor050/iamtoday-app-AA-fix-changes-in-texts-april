import { makeActionCreator, makeAsyncActionCreator } from 'utils';
import fetchDucks from 'modules/FetchDucks';
import api from 'utils/api';

export const moduleName = 'training';

const {
  REQUEST,
  SUCCESS,
  ERROR,
  loading,
} = fetchDucks(moduleName);

export const GET_PLAY_LIST_GROUPS = `${moduleName}/GET_PLAY_LIST_GROUPS`;
export const SET_CATEGORIES = `${moduleName}/SET_CATEGORIES`;
export const SET_MODULE_TAB = `${moduleName}/SET_MODULE_TAB`;
export const SET_WEBINARS_TAB = `${moduleName}/SET_WEBINARS_TAB`;
export const SET_VIDEO_TAB = `${moduleName}/SET_VIDEO_TAB`;
export const SET_PLAYLIST = `${moduleName}/SET_PLAYLIST`;
export const GET_EXERCISE = `${moduleName}/GET_EXERCISE`;
export const GET_PLAYLIST = `${moduleName}/GET_PLAYLIST`;
export const GET_WEBINARS_PLAYLIST = `${moduleName}/GET_WEBINARS_PLAYLIST`;
export const SET_EXERCISE = `${moduleName}/SET_EXERCISE`;
export const GET_SINGLE_VIDEO = `${moduleName}/GET_SINGLE_VIDEO`;
export const SET_VIEW = `${moduleName}/SET_VIEW`;
export const TOGGLE_LIKE = `${moduleName}/TOGGLE_LIKE`;
export const SET_LIKE = `${moduleName}/SET_LIKE`;
export const SEND_LIKE = `${moduleName}/SEND_LIKE`;
export const SEND_UN_LIKE = `${moduleName}/SEND_UN_LIKE`;
export const SET_REMIND = `${moduleName}/SET_REMIND`;
export const SAVE_MODULE_USER_NOTE = `${moduleName}/SAVE_MODULE_USER_NOTE`;
export const SAVE_VIDEO_USER_NOTE = `${moduleName}/SAVE_VIDEO_USER_NOTE`;
export const SAVE_SINGLE_VIDEO_USER_NOTE = `${moduleName}/SAVE_SINGLE_VIDEO_USER_NOTE`;
export const SET_MODULE_USER_NOTE = `${moduleName}/SET_MODULE_USER_NOTE`;
export const SET_VIDEO_USER_NOTE = `${moduleName}/SET_VIDEO_USER_NOTE`;
export const SET_SINGLE_VIDEO_USER_NOTE = `${moduleName}/SET_SINGLE_VIDEO_USER_NOTE`
export const SET_PLAYLIST_COLLAPSED = `${moduleName}/SET_PLAYLIST_COLLAPSED`;
export const ACTIVATE_MODULE = `${moduleName}/ACTIVATE_MODULE`;

export const SET_VIDEO_RATING = `${moduleName}/SET_VIDEO_RATING`;

// Action Creators
export const setCategories = makeActionCreator(SET_CATEGORIES, 'data');

export const setModuleTab = makeActionCreator(SET_MODULE_TAB, 'data');
export const setWebinarsTab = makeActionCreator(SET_WEBINARS_TAB, 'data');
export const setVideoTab = makeActionCreator(SET_VIDEO_TAB, 'data');
export const setModuleUserNote = makeActionCreator(SET_MODULE_USER_NOTE, 'data');
export const setVideoUserNote = makeActionCreator(SET_VIDEO_USER_NOTE, 'data');
export const setSingleVideoUserNote = makeActionCreator(SET_SINGLE_VIDEO_USER_NOTE, 'data');
export const setPlayListCollapsed = makeActionCreator(SET_PLAYLIST_COLLAPSED, 'data');

export const setPlaylist = makeActionCreator(SET_PLAYLIST, 'data');
export const setExercise = makeActionCreator(SET_EXERCISE, 'data');
export const setLike = makeActionCreator(SET_LIKE, 'id', 'likes', 'liked');

export const setRemind = (data) => makeAsyncActionCreator({
  apiCall: api.setRemind,
  actionName: SET_REMIND,
  moduleName,
  data,
  field: 'remind',
  // onSuccess: async (data, dispatch, getState) => {
  //   cb(method);
  // }
});
export const saveModuleUserNote = (itemId, text, cb = null) => makeAsyncActionCreator({
    apiCall: api.saveNote,
    actionName: SAVE_MODULE_USER_NOTE,
    moduleName,
    data: {itemType: 2, itemId, text},
    field: 'moduleNote',
    onSuccess: async (data, dispatch, getState) => {
        dispatch(setModuleUserNote({itemId, text}));
        cb && cb(data);
    }
});
export const saveVideoUserNote = (itemId, text, cb = null) => makeAsyncActionCreator({
    apiCall: api.saveNote,
    actionName: SAVE_VIDEO_USER_NOTE,
    moduleName,
    data: {itemType: 1, itemId, text},
    field: 'moduleVideoNote',
    onSuccess: async (data, dispatch, getState) => {
        dispatch(setVideoUserNote({itemId, text}));
        cb && cb(data);
    }
});
export const saveSingleVideoUserNote = (itemId, text, cb = null) => makeAsyncActionCreator({
  apiCall: api.saveNote,
  actionName: SAVE_SINGLE_VIDEO_USER_NOTE,
  moduleName,
  data: {itemType: 1, itemId, text},
  field: 'singleVideoNote',
  onSuccess: async (data, dispatch, getState) => {
      dispatch(setSingleVideoUserNote({itemId, text}));
      cb && cb(data);
  }
});
export const sendLike = (id, method, cb) => makeAsyncActionCreator({
  apiCall: api.sendLike,
  actionName: SEND_LIKE,
  moduleName,
  data: {id},
  field: 'like',
  onSuccess: async (data, dispatch, getState) => {
    cb(method);
  }
});
export const sendUnLike = (id, method, cb) => makeAsyncActionCreator({
  apiCall: api.sendUnLike,
  actionName: SEND_UN_LIKE,
  moduleName,
  data: {id},
  field: 'like',
  onSuccess: async (data, dispatch, getState) => {
    cb(method);
  }
});
export const toggleLike = (data, method, cb) => dispatch => {
  if (method === 'like') {
    dispatch(sendLike(data, method, cb));
  } else {
    dispatch(sendUnLike(data, method, cb));
  }
};

export const sendView = (data) => makeAsyncActionCreator({
    apiCall: api.sendView,
    actionName: SET_VIEW,
    moduleName,
    data: data,
    field: 'view',
    onSuccess: async (data, dispatch, getState) => {
        //const unReadMessage = data.filter((item) => !item.isRead).length;
        //await dispatch(setUnReadMessage(unReadMessage))
    }
});
export const getPlayListGroups = () => makeAsyncActionCreator({
  apiCall: api.getPlayListGroups,
  actionName: GET_PLAY_LIST_GROUPS,
  moduleName,
  field: 'playlists',
	onSuccess: async (data, dispatch, getState) => {
    // const unReadMessage = data.filter((item) => !item.isRead).length;
    // await dispatch(setUnReadMessage(unReadMessage))
	}
});
export const getWebinarsPlaylist = (data) => makeAsyncActionCreator({
  apiCall: api.getWebinarPlaylist,
  actionName: GET_WEBINARS_PLAYLIST,
  moduleName,
  data: data,
  field: 'webinars'
})
export const getExercise = (data) => makeAsyncActionCreator({
    apiCall: api.getExercise,
    actionName:GET_EXERCISE,
    moduleName,
    data: data,
    mapData: (data) => {
        return data[0];
    },
    field: 'exercise',
    onSuccess: async (data, dispatch, getState) => {
        //const unReadMessage = data.filter((item) => !item.isRead).length;
        //await dispatch(setUnReadMessage(unReadMessage))
    }
});
export const getPlaylist = ({id, exerciseId}) => makeAsyncActionCreator({
    apiCall: api.getPlaylist,
    actionName:GET_PLAYLIST,
    moduleName,
    data: {id},
    field: 'playlist',
    onSuccess: async (data, dispatch, getState) => {
        let exercise = {};

        data.data.videos.forEach((item) => {
            if (item.id == exerciseId){
                exercise = item;
            }
        });

        await dispatch(setExercise(exercise));
        //const unReadMessage = data.filter((item) => !item.isRead).length;
        //await dispatch(setUnReadMessage(unReadMessage))
    }
});
export const getWebinarVideo = ({id}) => makeAsyncActionCreator({
  apiCall: api.getWebinarVideo,
  actionName: GET_SINGLE_VIDEO,
  moduleName,
  data: {id},
  field: 'video',
  onSuccess: async (data, dispatch, getState) => {
    let exercise = {};

    data.data.forEach((item) => {
        if (item.id == id){
            exercise = item;
        }
    });

    await dispatch(setExercise(exercise));
  }
})

const updateVideoUserNote = (videos, id, userNote) => {
    if (videos) {
        return videos.map((item) => {
            return item.id === id
                ? {...item, userNote}
                : {...item};
        })
    }
    return videos;
};

export const activateModule = (data, onSuccess, onError) => makeAsyncActionCreator({
  apiCall: api.activateModule,
  actionName: ACTIVATE_MODULE,
  moduleName,
  data,
  onSuccess,
  onError
})
// RATING

export const setVideoRating = (data, onSuccess) => makeAsyncActionCreator({
  apiCall: api.setVideoRating,
  actionName: SET_VIDEO_RATING,
  moduleName,
  data,
  field: 'videoRating',
  onSuccess,
})

// QUESTIONS 

export const SEND_NEW_QUESTION = `${moduleName}/SEND_NEW_QUESTION`;
export const SEND_NEW_ANSWER = `${moduleName}/SEND_NEW_ANSWER`;
export const CHANGE_ANSWER = `${moduleName}/CHANGE_ANSWER`;
export const DELETE_ANSWER = `${moduleName}/DELETE_ANSWER`;
export const GET_COMMENTS = `${moduleName}/GET_COMMENTS`;
export const DELETE_COMMENTS = `${moduleName}/DELETE_COMMENTS`;

export const deleteComments = makeActionCreator(DELETE_COMMENTS, 'data');

export const sendNewQuestion = (data, onSuccess, onError) => makeAsyncActionCreator({
  apiCall: api.sendNewQuestion,
  actionName: SEND_NEW_QUESTION,
  moduleName,
  data: {
    ...data,
    type: 12,
    reply: null
  },
  onSuccess,
  onError
})


export const sendNewAnswer = (data, onSuccess, onError) => makeAsyncActionCreator({
  apiCall: api.sendAnswer,
  actionName: SEND_NEW_ANSWER,
  moduleName,
  data,
  onSuccess,
  onError
})

export const changeAnswer = (data, onSuccess, onError) => makeAsyncActionCreator({
  apiCall: api.changeAnswer,
  actionName: CHANGE_ANSWER,
  data,
  onSuccess,
  onError
})

export const deleteAnswer = (data, onSuccess, onError) => makeAsyncActionCreator({
  apiCall: api.deleteAnswer,
  actionName: DELETE_ANSWER,
  data,
  moduleName,
  onSuccess,
  onError
})

export const getComments = (data) => makeAsyncActionCreator({
  apiCall: api.getComments,
  actionName: GET_COMMENTS,
  data,
  moduleName,
  field: 'comments',
})

// FOR TEMPORARY EVENT IN FEBRUARY 2021
export const CHECK_POINTS_AND_BUY = `${moduleName}/CHECK_POINTS_AND_BUY`;

export const userCreateWebinar = (data, returnUrl, onSuccess) => makeAsyncActionCreator({
  apiCall: api.userCreateWebinar,
  actionName: CHECK_POINTS_AND_BUY,
  moduleName,
  data,
  temporaryFlag: true,
  onSuccess: async (data) => {
    const confirmationUrl = data.data.confirmationUrl;
    if (confirmationUrl) {window.location.href = confirmationUrl} else onSuccess()
  }
})

// END OF TEMPORARY EVENT


// Reducer
export const initialState = {
    selectCategories: 'all',
    exercise: null,
    comments: null,
};

export const reducer = (state = initialState, action) => {
  if (~action.type.indexOf(REQUEST) || ~action.type.indexOf(SUCCESS) || ~action.type.indexOf(ERROR)) {
    return {
      ...state,
      [action.field]: loading(state[action.field], action),
    }
  }

  switch (action.type) {
    case SET_LIKE:
      const exercises = state.playlist.data.exercises.map((exercise) => {
        if (exercise.id === action.id) {
          exercise.liked = action.liked;
          exercise.likes = action.likes;
        }
        return exercise;
      });
      return{
        ...state,
        playlist: {
          ...state.playlist,
          data: {
            ...state.playlist.data,
            exercises
          }
        },
      };
    case SET_CATEGORIES:
      return {
        ...state,
        selectCategories: action.data,
     };
      case SET_MODULE_TAB:
          return {
              ...state,
              selectedModuleTabName: action.data,
          };
      case SET_WEBINARS_TAB:
        return {
          ...state,
          selectedWebinarTabName: action.data,
        }
      case SET_VIDEO_TAB:
          return {
              ...state,
              selectedVideoTabName: action.data,
          };
      case SET_PLAYLIST_COLLAPSED:
          return {
              ...state,
              playlistCollapsed: action.data,
          };

      case SET_MODULE_USER_NOTE:
          if (action.data.itemId === state.playlist.data.id) {
              return {
                  ...state,
                  playlist: {...state.playlist, data: {...state.playlist.data, userNote: action.data.text}}
              };
          } else {
              return {...state}
          }
      case SET_PLAYLIST:
        const data = {data: action.data};
        return {
          ...state,
          playlist: data,
        };
      case SET_VIDEO_USER_NOTE: {
          return {
              ...state,
              exercise: {
                  ...state.exercise,
                  userNote: state.exercise.id === action.data.itemId
                      ? action.data.text
                      : state.exercise.userNote
              },
              playlist: {
                  ...state.playlist,
                  data: {
                      ...state.playlist.data,
                      videos: updateVideoUserNote(state.playlist.data.videos, action.data.itemId, action.data.text)
                  }
              }
          };
      }
      case SET_SINGLE_VIDEO_USER_NOTE: {
        return {
          ...state,
          exercise: {
            ...state.exercise,
            userNote: state.exercise.id === action.data.itemId
                ? action.data.text
                : state.exercise.userNote
          }
        }
      }
      case SET_EXERCISE: {
        return {
            ...state,
            exercise: action.data,
        };
      }
      case DELETE_COMMENTS: {
        return {
          ...state,
          comments: null,
        };
      }
    default:
      return state;
  }
};
