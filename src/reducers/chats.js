import {
  REQUEST_CHAT,
  CONCAT_PRIVATE_CHAT,
  CONCAT_TEAM_CHAT,
  CONCAT_PUBLIC_CHAT,
  CONCAT_ALL_USERS_CHAT,
  CONCAT_SINGLE_CHAT,
  RENDER_PRIVATE_CHAT,
  RENDER_PUBLIC_CHAT,
  RENDER_TEAM_CHAT,
  RENDER_ALL_USERS_CHAT,
  RENDER_SINGLE_CHAT,
  RECEIVE_PRIVATE_CHAT,
  RECEIVE_PUBLIC_CHAT,
  RECEIVE_ALL_USERS_CHAT,
  RECEIVE_TEAM_CHAT,
  GET_CHATS_LIST,
  GET_CHAT_INFO,
  RECEIVE_SINGLE_CHAT,
  CHANGE_STATUS_CHAT,
  CLOSE_CHAT,
  REQUEST_CHATS,
  PUBLIC_CHAT_ID,
  PRIVATE_CHAT_ID,
  ALL_USERS_CHAT_ID,
  SPECIALIZATION_CHAT_ID,
  CHANGE_CHAT_COMMENTS,
  SET_UNREAD_COMMENTS,
  SET_UNREAD_MSGS,
  RECEIVE_CHATS,
  SET_SKIP_CHAT,
  SET_CHOSEN_CHAT_TYPE_ID,
  SET_CHOSEN_CHAT_TYPE,
  CLEAR_RENDER_CHAT,
} from "../actions";

export const showGlobalMessage = (state = false, action) => {
  switch (action.type) {
    case "SHOW_GLOBAL_MESSAGE":
      return action.showGlobalMessage;
    default:
      return state;
  }
};

export const updateChats = (state = false, action) => {
  switch (action.type) {
    case "UPDATE_CHATS":
      return action.updateChats;
    default:
      return state;
  }
};
const take = 50;
const chatState = {
  isOpen: false,
  isFetching: false,
  isFetchingChat: 0,
  publicChats: {
    unreadCount: 0,
    skip: 0,
    take: take,
    comments: [],
  },
  privateChats: {
    unreadCount: 0,
    skip: 0,
    take: take,
    comments: [],
  },
  teamChats: {
    unreadCount: 0,
    skip: 0,
    take: take,
    comments: [],
  },
  allUsersChats: {
    unreadCount: 0,
    skip: 0,
    take: take,
    comments: [],
  },
  specializationChats: {
    unreadCount: 0,
    skip: 0,
    take: take,
    comments: [],

  },
  /*singleChats: {
    unreadCount: 0,
    skip: 0,
    take: take,
    comments: [],
  },*/
  renderPublicChat: [],
  renderTeamChat: [],
  renderPrivateChat: [],
  renderAllUsersChat: [],
  renderSingleChat: [],
  allChats: [],
  singleChat: [],
};

export const chat = (state = chatState, action) => {
  switch (action.type) {
    case SET_SKIP_CHAT:
      const chat = state[action.chat];
      const skip = state[action.chat].skip;
      return {
        ...state,
        [action.chat]: {
          ...chat,
          skip: skip + take,
        },
      };
    case REQUEST_CHAT:
      return {
        ...state,
        isFetching: true,
        isFetchingChat: state.isFetchingChat + 1,
      };
    case CONCAT_PRIVATE_CHAT:
      return {
        ...state,
        isFetching: true,
        renderPrivateChat: action.payload,
      };
    case CONCAT_TEAM_CHAT:
      return {
        ...state,
        isFetching: true,
        renderTeamChat: action.payload,
      };
    case CONCAT_PUBLIC_CHAT:
      return {
        ...state,
        isFetching: true,
        renderPublicChat: action.payload,
      };
    case CONCAT_ALL_USERS_CHAT:
      return {
        ...state,
        isFetching: true,
        renderAllUsersChat: action.payload,
      };
    case CONCAT_SINGLE_CHAT:
      return {
        ...state,
        isFetching: true,
        renderSingleChat: action.payload,
      };
    case RENDER_PRIVATE_CHAT:
      return {
        ...state,
        // isFetchingChat: 0,
        renderPrivateChat: action.payload,
      };
    case CLEAR_RENDER_CHAT:
      return {
        ...state,
        renderPrivateChat: [],
        renderPublicChat: [],
        renderAllUsersChat: [],
        renderSingleChat: [],
        publicChats: {
          ...state.publicChats,
          comments: [],
        },
        privateChats: {
          ...state.privateChats,
          comments: [],
        },
        teamChats: {
          ...state.teamChats,
          comments: [],
        },
        allUsersChats: {
          ...state.allUsersChats,
          comments: [],
        },
      };
    case RENDER_PUBLIC_CHAT:
      return {
        ...state,
        renderPublicChat: action.payload,
      };
    case RENDER_SINGLE_CHAT:
      return {
        ...state,
        renderSingleChat: action.payload,
      };
    case RENDER_TEAM_CHAT:
      return {
        ...state,
        renderTeamChat: action.payload,
      };
    case RENDER_ALL_USERS_CHAT:
      return {
        ...state,
        renderAllUsersChat: action.payload,
      };
    case RECEIVE_PUBLIC_CHAT:
      const commentsPublic = action.more
        ? action.payload.comments.concat(state.publicChats.comments)
        : action.payload.comments;
      return {
        ...state,
        isFetching: false,
        isFetchingChat: state.isFetchingChat - 1,
        publicChats: {
          ...state.publicChats,
          ...action.payload,
          comments: commentsPublic,
          counts: action.counts,
        },
      };

    case CHANGE_CHAT_COMMENTS:
      return {
        ...state,
        [action.chat]: {
          ...state[action.chat],
          comments: action.data,
        },
      };

    case SET_UNREAD_COMMENTS:
      return {
        ...state,
        [action.chat]: {
          ...state[action.chat],
          unreadCount: action.data,
        },
      };

    case RECEIVE_PRIVATE_CHAT:
      const commentsPrivate = action.more
        ? action.payload.comments.concat(state.privateChats.comments)
        : action.payload.comments;
      return {
        ...state,
        isFetching: false,
        isFetchingChat: state.isFetchingChat - 1,
        privateChats: {
          ...state.privateChats,
          ...action.payload,
          comments: commentsPrivate,
          counts: action.counts,
        },
      };
    case RECEIVE_TEAM_CHAT:
      const commentsTeam = action.more
        ? action.payload.comments.concat(state.teamChats.comments)
        : action.payload.comments;
      return {
        ...state,
        isFetching: false,
        isFetchingChat: state.isFetchingChat - 1,
        teamChats: {
          ...state.teamChats,
          ...action.payload,
          comments: commentsTeam,
          counts: action.counts,
        },
      };
    case RECEIVE_ALL_USERS_CHAT:
      const commentsAllUsers = action.more
        ? action.payload.comments.concat(state.allUsersChats.comments)
        : action.payload.comments;
      return {
        ...state,
        isFetching: false,
        isFetchingChat: state.isFetchingChat - 1,
        allUsersChats: {
          ...state.allUsersChats,
          ...action.payload,
          comments: commentsAllUsers,
          counts: action.counts,
        },
      };
    case GET_CHATS_LIST:
      return {
        ...state,
        isFetching: false,
        isFetchingChat: state.isFetchingChat - 1,
        allChats: [...action.payload.data],
      };
    case GET_CHAT_INFO:
      return {
        ...state,
        isFetching: false,
        chatInfo: { ...action.payload.data },
      };
    case RECEIVE_SINGLE_CHAT:
      return {
        ...state,
        isFetching: false,
        isFetchingChat: state.isFetchingChat - 1,
        singleChat: { ...action.payload },
      };
    case SET_CHOSEN_CHAT_TYPE:
      return {
        ...state,
        chosenChatType: action.type,
      };
    case SET_CHOSEN_CHAT_TYPE_ID:
      return {
        ...state,
        chosenChatTypeId: action.typeId,
      };
    case CLOSE_CHAT:
      return {
        ...state,
        isFetchingChat: state.isFetchingChat - 1,
        isFetching: false,
      };
    default:
      return state;
  }
};
const stateChats = {
  isFetching: false,
  chats: [],
  pageCount: 1,
  adminChatOpen: false,
  chatType: PRIVATE_CHAT_ID,
  groupId: 0,
  chatTypeId: 0,
  typeId: 0,
  unReadMsgs: 0,
};

export const chats = (state = stateChats, action) => {
  switch (action.type) {
    case SET_UNREAD_MSGS:
      return {
        ...state,
        unReadMsgs: action.unReadMsgs,
      };
    case "CHANGE_TYPE":
      return {
        ...state,
        chatType: action.chatType,
      };
    case "SET_GROUP_ID":
      return {
        ...state,
        groupId: action.groupId,
      };
    case "SET_TYPE_ID":
      return {
        ...state,
        typeId: action.typeId,
      };
    case "SET_CHAT_TYPE_ID":
      return {
        ...state,
        chatTypeId: action.chatTypeId,
      };
    case "ADMIN_CHAT_CLOSE":
      return {
        ...state,
        adminChatOpen: false,
      };
    case "ADMIN_CHAT_OPEN":
      return {
        ...state,
        adminChatOpen: true,
      };
    case REQUEST_CHATS:
      return {
        ...state,
        isFetching: true,
      };
    case RECEIVE_CHATS:
      return {
        ...state,
        chats: [...action.payload],
        pageCount: action.pageCount,
        isFetching: false,
      };
    case CHANGE_STATUS_CHAT:
      let list = state.chats.map((item) => {
        if (item.id === action.payload) {
          item.isAnswered = true;
        }
        return item;
      });

      return {
        ...state,
        chats: list,
      };
    default:
      return state;
  }
};
