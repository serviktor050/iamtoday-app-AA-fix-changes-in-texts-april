import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {getChatInfo, createNewChat} from "../../utils/api";
import cookie from "react-cookie";
import { browserHistory } from "react-router";
import { CREATED_BY_USER_CHAT_ID, WELCOME_MESSAGE} from "../../actions/chats"
import * as R from 'ramda';


//function to start private chat
export function startPrivateChat(id) {
    const token = cookie.load("token");
    const chatInfoData = {
      authtoken: token,
      data: { type: CREATED_BY_USER_CHAT_ID, userId: id }
    }

    const createChatData = {
      authtoken: token,
      data: { text: WELCOME_MESSAGE, type: CREATED_BY_USER_CHAT_ID, recipients:[id]}
    }


    const goToChat = (chatId, chatTypeId) => {
      browserHistory.push({
        pathname: `/chats/${chatId}`,
        state: { type: CREATED_BY_USER_CHAT_ID, typeId: chatTypeId }
      })
    }

    return getChatInfo(chatInfoData).then((res) => {
       if (res.data.errorCode === 3) {
         //create private chat if not found
            createNewChat(createChatData)
         .then((response)=>goToChat(response.data.data.id, response.data.data.typeId))
            } else {
             goToChat(res.data.data.id, res.data.data.typeId)
            }
          }
        )
  }

export const useOutsideClick = (ref, callback, additionalRefs = [],) => {
  const handleClick = e => {
    if (additionalRefs && additionalRefs.length > 0 && additionalRefs.every(item => !!item) && additionalRefs.every(item => !!item.current)) {
      const isClickedOnRef = ref.current.contains(e.target);
      const isClickedOnAdditionalRef = additionalRefs.some((item) => item.current.contains(e.target));
      if (ref.current && (!isClickedOnRef && !isClickedOnAdditionalRef)) {
        console.log('outside click');
        callback(e);
      }
    } else if (ref.current && !ref.current.contains(e.target)) {
      console.log('outside click');
      callback(e);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    }
  })
}

export const useSubscribeRedux = (ref, addCallback, removeCallback) => {
  useEffect(() => {
    addCallback();

    return () => {
      removeCallback();
    }
  }, [ref])
}

export const isDataNotFetched = (prop) => {
  return !prop || prop.isFetching || !prop.isLoad || !prop.data;
}

export const isAdmin = (userInfo) => {
  const userRole = R.path(['data', 'role'], userInfo);
  return userRole === 2
}


const createRootElement = function createRootElement(id) {
  const rootContainer = document.createElement('div');
  rootContainer.setAttribute('id', id);
  return rootContainer;
}

const addRootElement = function addRootElement(rootElem) {
  document.body.insertBefore(
    rootElem,
    document.body.lastElementChild.nextElementSibling,
  );
}

export function usePortal(id) {
  const rootElemRef = useRef(null);

  useEffect(function setupElement() {
    const existingParent = document.querySelector(`#${id}`);
    // const parentElem = existingParent || createRootElement(id);
    const parentElem = existingParent

    if (!existingParent) {
      // addRootElement(parentElem);
      return
    }

    parentElem.appendChild(rootElemRef.current);

    return function removeElement() {
      rootElemRef.current.remove();
      if (!parentElem.childElementCount) {
        // parentElem.remove();
      }
    };
  }, [id]);

  function getRootElem() {
    if (!rootElemRef.current) {
      rootElemRef.current = document.createElement('div');
    }
    return rootElemRef.current;
  }

  return getRootElem();
}

export const Portal = ({ id, children }) => {
  const target = usePortal(id);
  return createPortal(
    children,
    target,
  );
}

export const debounce = (func, wait, immediate) => {
  let timeout;

  return function executedFunction() {
    const context = this;
    const args = arguments;

    const later = function() {
      timeout = null;
      if (!immediate) {
        func.apply(context, args)
      }
    };

    const callNow = immediate && !timeout;

    clearTimeout(timeout);

    timeout = setTimeout(later, wait);

    if (callNow) {
      func.apply(context, args);
    }
  };
}
