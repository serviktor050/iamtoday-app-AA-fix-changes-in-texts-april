import { api } from '../config.js'
import cookie from 'react-cookie'

export const RECIEVE_SMM_POSTS = 'RECIEVE_SMM_POSTS'
export const ERROR_SMM_POSTS = 'ERROR_SMM_POSTS'
export const REQ_SMM_POSTS = 'REQ_SMM_POSTS'
export const SET_SIMPLE_REGS = 'SET_SIMPLE_REGS'
export const SET_LIKE_TO_POST = 'SET_LIKE_TO_POST'
export const SET_ERROR_SMM = 'SET_ERROR_SMM';
export const REQ_SMM_LIKE = 'REQ_SMM_LIKE';


export const recieveSmmPostsFalure = (data) => {
  return ({
    type: ERROR_SMM_POSTS,
    data
  })
}

const reqSmmPosts = () =>{
  return ({
    type: REQ_SMM_POSTS
  })
}
const reqSmmLike = () =>{
	return ({
		type: REQ_SMM_LIKE
	})
}
const setSmmError = () =>{
  return ({
    type: SET_ERROR_SMM
  })
}
const setSmmSkip = ({data, field}) =>{
  return ({
    type: 'SET_SMM_SKIP',
    data,
    field
  })
}
export const recieveSmmPosts = (data, counter, mergeSkip, merge) =>{
  return ({
    type: RECIEVE_SMM_POSTS,
    data,
    counter,
		mergeSkip, merge
  })
}
export const setSimpleRegs = (data) =>{
  return ({
    type: SET_SIMPLE_REGS,
    data,
  })
}
export const setLikeToPost = (id, unlike) =>{
	return ({
		type: SET_LIKE_TO_POST,
		id,
    unlike,
	})
}
export const fetchLikePosts = (id, unlike) => (dispatch, getState) => {
  const isLoadingLike = getState().smm.isLoadingLike;
  if(isLoadingLike){
    return;
  }
  const data = {
    id:id
  }
	const payload = {
		authToken: cookie.load('token'),
		data
	}
	const url = unlike ? 'activity-unlike-auth' : 'activity-like-auth';
	dispatch(reqSmmLike())
  return fetch(`${api}/activity/${url}`, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body:JSON.stringify(payload)
  })
    .then(response => response.json())
    .then(json => {
      const data = json.data
      if(data){
        dispatch(setLikeToPost(id, unlike))
      } else {
        dispatch(setSmmError())
      }
    })
    .catch(error => {
      console.log(error)
    });
}
export const fetchSmmPosts = (skip, take, isAuth, mergeSkip, merge) => dispatch => {
  const field = isAuth ? 'auth' : 'notAuth';
  const data = {
    skip:skip[field],
    take:take
  };
	let payload = {
		data
	};
	if(isAuth){
    payload.authToken = cookie.load('token');
  } else {
	  payload = data;
  }

  const action = isAuth ? 'activity-get-info-auth' : 'activity-get-info';
  return fetch(`${api}/activity/${action}`, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body:JSON.stringify(payload)
  })
    .then(response => response.json())
    .then(json => {
      const data = json.data
      const counter = json.itemsCounter
      if(json.errorCode === 1){
        dispatch(recieveSmmPosts(data, counter, mergeSkip, merge));
        const newSkip = data.length ? skip[field] + take : skip[field];
        dispatch(setSmmSkip({ data: newSkip, field }));
      } else {
        dispatch(recieveSmmPostsFalure("Ошибка сервера"));
      }
    })
    .catch(error => {
      console.log(error)
      dispatch(recieveSmmPostsFalure("Ошибка!"))
    });
}

