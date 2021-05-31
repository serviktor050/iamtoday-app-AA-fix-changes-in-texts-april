import cookie from "react-cookie";
import { api } from "../config.js";
import moment from "moment";
import {
  getChatList,
  getChatInfo,
  postPinChat,
  postUnpinChat,
  deleteUser,
  addUser,
  updateChat,
  createNewChat,
} from "../utils/api";

moment.locale("ru");

export const PUBLIC_CHAT_ID = 1;
export const PRIVATE_CHAT_ID = 2;
export const PROFILE_CHAT_ID = 3;
export const INSURANCE_CHAT_ID = 4;
export const PROFILE_PHOTO_CHAT_ID = 5;
export const EXAM_CHAT_ID = 6;
export const ALL_USERS_CHAT_ID = 7;
export const SPECIALIZATION_CHAT_ID = 11;
export const TEAM_CHAT_ID = 9; // VIP_CHAT_ID = 9;
export const SMM_CHAT_ID = 8;
export const CREATED_BY_USER_CHAT_ID = 11;
export const WELCOME_MESSAGE = "ANTI-AGE EXPERT";


export const CLOSE_CHAT = "CLOSE_CHAT";
export const REQUEST_CHAT = "REQUEST_CHAT";
export const RECEIVE_CHATS = "RECEIVE_CHATS";
export const REQUEST_CHATS = "REQUEST_CHATS";
export const CONCAT_PRIVATE_CHAT = "CONCAT_PRIVATE_CHAT";
export const CONCAT_PUBLIC_CHAT = "CONCAT_PUBLIC_CHAT";
export const CONCAT_TEAM_CHAT = "CONCAT_TEAM_CHAT";
export const CONCAT_ALL_USERS_CHAT = "CONCAT_ALL_USERS_CHAT";
export const CONCAT_SINGLE_CHAT = "CONCAT_SINGLE_CHAT";
export const RENDER_PRIVATE_CHAT = "RENDER_PRIVATE_CHAT";
export const RENDER_PUBLIC_CHAT = "RENDER_PUBLIC_CHAT";
export const RENDER_TEAM_CHAT = "RENDER_TEAM_CHAT";
export const CLEAR_RENDER_CHAT = "CLEAR_RENDER_CHAT";
export const RENDER_ALL_USERS_CHAT = "RENDER_ALL_USERS_CHAT";
export const RENDER_SINGLE_CHAT = "RENDER_SINGLE_CHAT";
export const RECEIVE_PRIVATE_CHAT = "RECEIVE_PRIVATE_CHAT";
export const RECEIVE_PUBLIC_CHAT = "RECEIVE_PUBLIC_CHAT";
export const RECEIVE_TEAM_CHAT = "RECEIVE_TEAM_CHAT";
export const RECEIVE_ALL_USERS_CHAT = "RECEIVE_ALL_USERS_CHAT";
export const RECEIVE_SINGLE_CHAT = "RECEIVE_SINGLE_CHAT";
export const GET_CHATS_LIST = "GET_CHATS_LIST";
export const GET_CHAT_INFO = "GET_CHAT_INFO";
export const CHANGE_STATUS_CHAT = "CHANGE_STATUS_CHAT";
export const CHANGE_CHAT_COMMENTS = "CHANGE_CHAT_COMMENTS";
export const SET_UNREAD_COMMENTS = "SET_UNREAD_COMMENTS";
export const SET_UNREAD_MSGS = "SET_UNREAD_MSGS";
export const SET_SKIP_CHAT = "SET_SKIP_CHAT";
export const SET_CHOSEN_CHAT_TYPE_ID = "SET_CHOSEN_CHAT_TYPE_ID";
export const SET_CHOSEN_CHAT_TYPE = "SET_CHOSEN_CHAT_TYPE";

const ITEMS_PER_PAGE = 50;
let updateInstance;

export const setUnReadMsgs = (unReadMsgs) => ({
  type: SET_UNREAD_MSGS,
  unReadMsgs,
});

const commentGetAdminList = (authToken, data) => {
  return fetch(`${api}/user/comment-get-adminList`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      data,
      authToken,
    }),
  })
    .then((response) => {
      return response.json();
    })
    .catch(console.error);
};

// CHAT LIST ACTIONS

const commentGetInfo = (authToken, data) => {
  return fetch(`${api}/user/comment-get-info`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      data,
      authToken,
    }),
  })
    .then((response) => {
      //console.log(response)
      return response.json();
    })
    .catch(console.error);
};
export const adminChatCloseAction = () => ({
  type: "ADMIN_CHAT_CLOSE",
});
export const adminChatOpenAction = () => ({
  type: "ADMIN_CHAT_OPEN",
});
export const changeChatComments = (chat, data) => ({
  type: "CHANGE_CHAT_COMMENTS",
  chat,
  data,
});

export const setUnReadComments = (chat, data) => ({
  type: "SET_UNREAD_COMMENTS",
  chat,
  data,
});
export const setChatTypeId = (chatTypeId) => ({
  type: "SET_CHAT_TYPE_ID",
  chatTypeId,
});

export const setTypeId = (typeId) => ({
  type: "SET_TYPE_ID",
  typeId,
});

export const setGroupId = (groupId) => ({
  type: "SET_GROUP_ID",
  groupId,
});
export const changeChatType = (chatType) => ({
  type: "CHANGE_TYPE",
  chatType,
});
export const changeStatusChatAction = (payload) => ({
  type: CHANGE_STATUS_CHAT,
  payload,
});

export const requestChats = () => ({
  type: REQUEST_CHATS,
});

export const receiveChats = (payload, pageCount) => ({
  type: RECEIVE_CHATS,
  payload,
  pageCount,
});

export const setSkip = (chat) => ({
  type: SET_SKIP_CHAT,
  chat,
});

const getChatTitle = ({ name, isPublic, userStarter }) => {
  let title;

  if (isPublic) {
    title = name;
  } else {
    const { firstName, lastName, programName, id } = userStarter;

    title = `${id} - ${firstName} ${lastName}`; // `[${id}] ${firstName} ${lastName}`

    if (programName) {
      title += ` / ${programName}`;
    }

    if (name) {
      title += ` / ${name}`;
    }
  }

  return title;
};
// actions to save chatId and chatTypeId when redirected to SingleChatPage
export const setChosenChatTypeId = (chatTypeId) => ({
  type: "SET_CHOSEN_CHAT_TYPE_ID",
  chatTypeId,
});

export const setChosenChatType = (chatType) => ({
  type: "SET_CHOSEN_CHAT_TYPE",
  chatType,
});

export const fetchChats = (type, page = 1, user, userFilterText) => (
  dispatch,
  getState
) => {
  dispatch(requestChats());

  const { userToken } = getState();
  const token = userToken.token || cookie.load("token");
  const userId = Number(cookie.load("user_id"));

  return commentGetAdminList(token, {
    type,
    take: ITEMS_PER_PAGE,
    skip: ITEMS_PER_PAGE * (page - 1),
    user,
    userFilterText,
  }).then((chatsArray) => {
    let flatChats = Array.prototype.concat
      .apply([], chatsArray.data)
      .map(({ userStarter, ...chat }) => ({
        ...chat,
        userStarter: userStarter || {},
      })) // Баг с null в userStarter
      .map((chat) => {
        const title = getChatTitle(chat);
        const unread = chat.comments.length; // TODO: Убрать когда придумаем способ чекать прочитанные
        const lastComment = chat.comments[unread - 1];
        const hasMessages = Boolean(lastComment);
        const isAnswered = lastComment
          ? lastComment.userInfo.id === userId
          : false;
        const lastCommentDate = hasMessages ? moment(lastComment.date) : null;

        return {
          ...chat,
          title,
          unread,
          isAnswered,
          hasMessages,
          updateTs: isAnswered
            ? 0
            : hasMessages
              ? moment().valueOf() - lastCommentDate.valueOf()
              : -1,
          timePassed: hasMessages ? lastCommentDate.fromNow(true) : "-",
        };
      });

    const pageCount =
      chatsArray.data.length > 0
        ? Math.ceil(chatsArray.itemsCounter / ITEMS_PER_PAGE)
        : 0;

    dispatch(receiveChats(flatChats, pageCount));
  });
};

export const fetchPublicChats = fetchChats(PUBLIC_CHAT_ID);
export const fetchPrivateChats = fetchChats(PRIVATE_CHAT_ID);
export const fetchAllUsersChats = fetchChats(ALL_USERS_CHAT_ID);
export const fetchProfileChats = fetchChats(PROFILE_CHAT_ID);
export const fetchInsuranceChats = fetchChats(INSURANCE_CHAT_ID);
export const fetchProfilePhotoChats = fetchChats(PROFILE_PHOTO_CHAT_ID);
export const fetchSpecialzationChats = fetchChats(SPECIALIZATION_CHAT_ID);

// CHAT MESSAGES ACTIONS

export const requestChat = () => ({
  type: REQUEST_CHAT,
});

export const receivePublicChatAction = (payload, counts, more) => ({
  type: RECEIVE_PUBLIC_CHAT,
  payload,
  counts,
  more,
});

export const receivePrivateChatAction = (payload, counts, more) => ({
  type: RECEIVE_PRIVATE_CHAT,
  payload,
  counts,
  more,
});
export const receiveTeamChatAction = (payload, counts, more) => ({
  type: RECEIVE_TEAM_CHAT,
  payload,
  counts,
  more,
});
export const receiveAllUsersChatAction = (payload, counts, more) => ({
  type: RECEIVE_ALL_USERS_CHAT,
  payload,
  counts,
  more,
});
export const receiveSingleChatAction = (payload, counts, more) => ({
  type: RECEIVE_SINGLE_CHAT,
  payload,
  counts,
  more,
});
export const getChatsListAction = (payload, counts, more) => ({
  type: GET_CHATS_LIST,
  payload,
  counts,
  more,
});

export const getChatInfoAction = (payload, counts, more) => ({
  type: GET_CHAT_INFO,
  payload,
  counts,
  more,
});

export const concatPrivateChatAction = (payload) => ({
  type: CONCAT_PRIVATE_CHAT,
  payload,
});
export const concatTeamChatAction = (payload) => ({
  type: CONCAT_TEAM_CHAT,
  payload,
});
export const concatPublicChatAction = (payload) => ({
  type: CONCAT_PUBLIC_CHAT,
  payload,
});
export const concatSingleChatAction = (payload) => ({
  type: CONCAT_SINGLE_CHAT,
  payload,
});

export const concatAllUsersChatAction = (payload) => ({
  type: CONCAT_ALL_USERS_CHAT,
  payload,
});
export const concatSpecializationChatAction = (payload) => ({
  type: CONCAT_SPECIALIZATION_CHAT,
  payload,
});

export const renderPublicChatAction = (payload) => ({
  type: RENDER_PUBLIC_CHAT,
  payload,
});
export const renderTeamChatAction = (payload) => ({
  type: RENDER_TEAM_CHAT,
  payload,
});
export const renderPrivateChatAction = (payload) => ({
  type: RENDER_PRIVATE_CHAT,
  payload,
});

export const renderAllUsersChatAction = (payload) => ({
  type: RENDER_ALL_USERS_CHAT,
  payload,
});
export const renderSingleChatAction = (payload) => ({
  type: RENDER_SINGLE_CHAT,
  payload,
});
export const clearRenderChat = () => ({
  type: CLEAR_RENDER_CHAT,
});

export const closeChat = () => (dispatch, getState) => {
  dispatch({
    type: CLOSE_CHAT,
  });
};

export const fetchChat = (type, typeId, more, answer) => (
  dispatch,
  getState
) => {
  dispatch(requestChat());
  const chat = getState().chat;
  let skip = 0;
  let take = 10;

  if (type == PRIVATE_CHAT_ID) {
    take = answer
      ? chat.privateChats.skip + chat.privateChats.take
      : chat.privateChats.take;
    skip = more
      ? chat.privateChats.skip + take
      : answer
        ? 0
        : chat.privateChats.skip;
  }
  if (type == TEAM_CHAT_ID) {
    take = answer
      ? chat.teamChats.skip + chat.teamChats.take
      : chat.teamChats.take;
    skip = more ? chat.teamChats.skip + take : answer ? 0 : chat.teamChats.skip;
  }
  if (type == PUBLIC_CHAT_ID) {
    take = answer
      ? chat.publicChats.skip + chat.publicChats.take
      : chat.publicChats.take;
    skip = more
      ? chat.publicChats.skip + take
      : answer
        ? 0
        : chat.publicChats.skip;
  }
  //check request to server
  if (type == ALL_USERS_CHAT_ID) {
    take = answer
      ? chat.allUsersChats.skip + chat.allUsersChats.take
      : chat.allUsersChats.take;
    skip = more
      ? chat.allUsersChats.skip + take
      : answer
        ? 0
        : chat.allUsersChats.skip;
  }
  if (type == SPECIALIZATION_CHAT_ID) {
    take = answer ? chat.specializationChats.skip + chat.specializationChats.take : chat.specializationChats.take;
    skip = 0// more ? chat.specializationChats.skip + take : answer ? 0
    //: chat.specializationChats.skip;
  }

  const { token } = getState().userToken;
  const data = typeId ? { type, typeId, skip, take } : { type, typeId, skip, take };

  return commentGetInfo(token || cookie.load("token"), data).then((chats) => {
    if (chats.data && chats.data[0]) {
      if (chats.data[0].type === PUBLIC_CHAT_ID) {
        if (more) {
          dispatch(setSkip("publicChats"));
        }
        dispatch(
          receivePublicChatAction(chats.data[0], chats.itemsCounter, more)
        );
      } else if (chats.data[0].type === TEAM_CHAT_ID) {
        if (more) {
          dispatch(setSkip("teamChats"));
        }
        dispatch(
          receiveTeamChatAction(chats.data[0], chats.itemsCounter, more)
        );
      } else if (chats.data[0].type === ALL_USERS_CHAT_ID) {
        if (more) {
          dispatch(setSkip("allUsersChats"));
        }
        dispatch(
          receiveAllUsersChatAction(chats.data[0], chats.itemsCounter, more)
        );
      } else if (chats.data[0].type === SPECIALIZATION_CHAT_ID) {
        if (more) {
          dispatch(setSkip("specializationChats"));
        }
        dispatch(
          receiveSpecializationChatAction(
            chats.data[0],
            chats.itemsCounter,
            more
          )
        );
      } else {
        if (more) {
          dispatch(setSkip("privateChats"));
        }
        dispatch(
          receivePrivateChatAction(chats.data[0], chats.itemsCounter, more)
        );
      }
    } else {
      dispatch(closeChat());
    }
  });
};
const getUnReadMsgs = (chat, dispatch) => {
  const count = chat.reduce((acc, curr) => acc + curr.unreadCount, 0);
  dispatch(setUnReadMsgs(count));
};

export const fetchChatList = (filterText, page = 1) => (dispatch, getState) => {
  const { userToken } = getState();
  const token = userToken.token || cookie.load("token");

  const requestData = {
    take: ITEMS_PER_PAGE,
    skip: ITEMS_PER_PAGE * (page - 1),
    userFilterText: filterText
  }
  return getChatList({
    authtoken: token,
    data: requestData
  }).then((chat) => {
    dispatch(getChatsListAction(chat.data, chat.data.itemsCounter));
    getUnReadMsgs(chat.data.data, dispatch);
  });
  //.then((count) => dispatch(setUnReadMsgs(count)));
};

export const fetchChatInfo = (type, typeId, page = 1) => (
  dispatch,
  getState
) => {
  const { userToken } = getState();
  const token = userToken.token || cookie.load("token");

  return getChatInfo({
    authtoken: token,
    take: ITEMS_PER_PAGE,
    skip: ITEMS_PER_PAGE * (page - 1),
    data: { type: type, typeId: typeId },
  }).then((chat) => {
    dispatch(getChatInfoAction(chat.data, chat.itemsCounter));
  });
};

export const fetchSingleChat = (
  type,
  typeId,
  filter,
  dateStart,
  dateEnd,
  more,
  answer,
  page = 1
) => (dispatch) => {
  const token = cookie.load("token");
  const data = {
    type: type,
    typeId: typeId,
    skip: ITEMS_PER_PAGE * (page - 1),
    take: ITEMS_PER_PAGE,
    searchText: filter,
    dateStart: dateStart,
    dateEnd: dateEnd
  };

  return commentGetInfo(token, data).then((chat) => {
    dispatch(receiveSingleChatAction(chat.data[0], chat.itemsCounter));
  });
};
// CHAT METHODS
export const addUserAction = (type, typeId, id) => (dispatch) => {
  const token = cookie.load("token");
  const data = {
    type: type,
    typeId: typeId,
    recipient: id,
  };

  return addUser({ authToken: token, data: data }).then(() =>
    dispatch(fetchChatInfo(type, typeId))
  );
};

export const deleteUserAction = (type, typeId, id) => (dispatch) => {
  const token = cookie.load("token");
  const data = {
    type: type,
    typeId: typeId,
    recipient: id,
  };

  return deleteUser({ authToken: token, data: data }).then(() =>
    dispatch(fetchChatInfo(type, typeId))
  );
};

export const pinChatAction = (type, typeId) => (dispatch) => {
  const token = cookie.load("token");
  const data = {
    type: type,
    typeId: typeId,
  };

  return postPinChat({ authToken: token, data: data }).then(() =>
    dispatch(fetchChatInfo(type, typeId))
  );
};

export const unpinChatAction = (type, typeId) => (dispatch) => {
  const token = cookie.load("token");
  const data = {
    type: type,
    typeId: typeId,
  };

  return postUnpinChat({ authToken: token, data: data }).then(() =>
    dispatch(fetchChatInfo(type, typeId))
  );
};

export const addNewChatAction = (photo, name, recipients) => (
  dispatch,
  getState
) => {
  const token = cookie.load("token");
  const data = {
    type: CREATED_BY_USER_CHAT_ID,
    text: WELCOME_MESSAGE,
    isSystem: true,
    photo: photo,
    name: name,
    recipients: recipients,
  };
  return createNewChat({ authtoken: token, data: data }).then(() =>
    dispatch(fetchChatList())
  );
};

export const updateChatAction = (type, typeId, name, photo) => (dispatch) => {
  const token = cookie.load("token");
  const data = {
    type: type,
    typeId: typeId,
    name: name,
    photo: photo,
  };

  return updateChat({ authToken: token, data: data }).then(() =>
    dispatch(fetchChatList())
  );
};

const chatMessageCreate = (authToken, data) => {
  return fetch(`${api}/user/chatmessage-create`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      data,
      authToken,
    }),
  })
    .then((response) => {
      const res = response.json();
      return res;
    })
    .catch(console.error);
};

export const createWithMessage = (
  type,
  typeId,
  text,
  isSystem = false
) => (dispatch, getState) => {
  const { token } = getState().userToken;
  const authToken = token || cookie.load("token");
  const data = typeId
    ? { type, recipient: typeId, text, isSystem }
    : { type, typeId, text, isSystem };
  // const data = {type, text, isSystem}

  return chatMessageCreate(authToken, data);
};

export const answerToChat = (group, text, type, typeId, reply) => (
  dispatch,
  getState
) => {
  const { token } = getState().userToken;
  const authToken = token || cookie.load("token");
  let data = typeId
    ? group
      ? { group, text, type, typeId, reply }
      : { text, type, typeId, reply }
    : { group, text, type, typeId, reply };
  return chatMessageCreate(authToken, data);
};

export const addToChat = (type, typeId, text) => (dispatch, getState) => {
  const { token } = getState().userToken;
  const authToken = token || cookie.load("token");

  const data = typeId ? { type, typeId, text } : { type, typeId, text };

  return fetch(`${api}/user/chat-adduser`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      data,
      authToken,
    }),
  })
    .then((response) => response.json())
    .catch(console.error);
};

export const waitingFromChat = (group) => (dispatch, getState) => {
  const { token } = getState().userToken;
  const authToken = token || cookie.load("token");

  return chatMessageCreate(authToken, { group, status: 1 });
};

export const answeredChat = (group) => (dispatch, getState) => {
  const { token } = getState().userToken;
  const authToken = token || cookie.load("token");
  return chatMessageCreate(authToken, { group, status: 2 });
};
